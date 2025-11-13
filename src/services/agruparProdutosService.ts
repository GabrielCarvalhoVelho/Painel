// src/services/agruparProdutosService.ts
import { ProdutoEstoque } from "./estoqueService";
import { convertToStandardUnit, convertFromStandardUnit, getBestDisplayUnit, isMassUnit, isVolumeUnit } from '../lib/unitConverter';

function normalizeName(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function areSimilar(name1: string | null | undefined, name2: string | null | undefined): boolean {
  if (!name1 || !name2 || typeof name1 !== 'string' || typeof name2 !== 'string') {
    return false;
  }
  
  const norm1 = normalizeName(name1);
  const norm2 = normalizeName(name2);
  
  if (norm1 === norm2) return true;
  if (!norm1 || !norm2) return false;

  const avgLength = (norm1.length + norm2.length) / 2;
  const distance = levenshteinDistance(norm1, norm2);
  const similarity = 1 - (distance / Math.max(norm1.length, norm2.length));
  
  if (avgLength < 4) return norm1 === norm2;
  if (avgLength <= 6) return similarity > 0.85;
  if (avgLength <= 10) return similarity > 0.75;
  return similarity > 0.7;
}

export interface ProdutoAgrupado {
  nome: string;
  produtos: ProdutoEstoque[];
  mediaPreco: number;
  mediaPrecoDisplay: number;
  totalEstoque: number;
  totalEstoqueDisplay: number;
  unidadeDisplay: string;
  marcas: string[];
  categorias: string[];
  unidades: string[];
  lotes: (string|null)[];
  validades: (string|null)[];
  fornecedores: {
    fornecedor: string|null;
    quantidade: number;
    valor: number|null;
    registro_mapa: string|null;
    ids: number[];
  }[];
  unidadeValorOriginal: string | null;
  mediaPrecoOriginal: number | null;
}

export function agruparProdutos(produtos: ProdutoEstoque[]): ProdutoAgrupado[] {
  if (!produtos.length) return [];

  const produtosValidos = produtos.filter(p => 
    p.nome_produto && 
    typeof p.nome_produto === 'string' && 
    p.nome_produto.trim()
  );
  
  if (!produtosValidos.length) return [];

  const grupos: Record<string, ProdutoEstoque[]> = {};
  grupos[produtosValidos[0].nome_produto] = [produtosValidos[0]];

  for (let i = 1; i < produtosValidos.length; i++) {
    const produto = produtosValidos[i];
    let encontrouGrupo = false;

    for (const [nomeGrupo] of Object.entries(grupos)) {
      if (areSimilar(produto.nome_produto, nomeGrupo)) {
        grupos[nomeGrupo].push(produto);
        encontrouGrupo = true;
        break;
      }
    }

    if (!encontrouGrupo) {
      grupos[produto.nome_produto] = [produto];
    }
  }

  return Object.values(grupos).map(grupo => {
    // 1️⃣ ORDENAR produtos por created_at (mais antigo primeiro)
    grupo.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateA - dateB;
    });

    const nomes = grupo.map(p => p.nome_produto);
    const nomeMaisComum = nomes.sort((a, b) =>
      nomes.filter(n => n === a).length - nomes.filter(n => n === b).length
    ).pop() || grupo[0].nome_produto;

    // Considerar TODOS os produtos do grupo que possuem valor, não apenas os em estoque
    const produtosComValor = grupo.filter(p => p.valor !== null && p.valor > 0);
    const produtosEmEstoque = grupo.filter(p => (p.quantidade ?? 0) > 0 && p.valor !== null);

    // 2️⃣ DETERMINAR unidade de referência (primeiro produto = mais antigo)
    const produtoMaisAntigo = grupo[0];
    const unidadeReferencia = produtoMaisAntigo.unidade_valor_original || produtoMaisAntigo.unidade;

    console.log('🎯 Unidade de Referência (produto mais antigo):', {
      grupo: grupo[0].nome_produto,
      produtoMaisAntigo: produtoMaisAntigo.nome_produto,
      created_at: produtoMaisAntigo.created_at,
      unidadeReferencia
    });

    // 3️⃣ CONVERTER e CALCULAR média ponderada
    // Fórmula: soma(quantidade × valor) ÷ soma(quantidade)
    let somaCustoTotal = 0;
    let somaQuantidadeTotal = 0;

    produtosComValor.forEach(p => {
      const valorPorUnidadeOriginal = p.valor ?? 0; // Já é valor por unidade!
      if (valorPorUnidadeOriginal <= 0) return;

      const unidadeOriginalProduto = p.unidade_valor_original || p.unidade;
      const quantidadeInicial = p.quantidade_inicial ?? 0;
      if (quantidadeInicial <= 0) return;

      // 🎯 PASSO 1: Converter quantidade_inicial (mg/mL) para unidade de referência
      let quantidadeConvertida = quantidadeInicial;
      if (isMassUnit(unidadeReferencia)) {
        quantidadeConvertida = convertFromStandardUnit(quantidadeInicial, 'mg', unidadeReferencia);
      } else if (isVolumeUnit(unidadeReferencia)) {
        quantidadeConvertida = convertFromStandardUnit(quantidadeInicial, 'mL', unidadeReferencia);
      }

      // 🎯 PASSO 2: Converter valor unitário para unidade de referência
      let valorConvertido = valorPorUnidadeOriginal;
      
      if (unidadeOriginalProduto !== unidadeReferencia) {
        const ehMassaOrigem = isMassUnit(unidadeOriginalProduto);
        const ehMassaDestino = isMassUnit(unidadeReferencia);
        const ehVolumeOrigem = isVolumeUnit(unidadeOriginalProduto);
        const ehVolumeDestino = isVolumeUnit(unidadeReferencia);

        if (ehMassaOrigem && ehMassaDestino) {
          // Converter R$/unidade_original → R$/unidade_referencia
          // Exemplo: R$ 3,50/kg → R$ 3.500/ton
          // 1 ton = 1000 kg, então R$/ton = R$/kg × 1000
          const umUnidadeOriginalEmMg = convertToStandardUnit(1, unidadeOriginalProduto).quantidade;
          const umUnidadeReferenciaEmMg = convertToStandardUnit(1, unidadeReferencia).quantidade;
          const fator = umUnidadeReferenciaEmMg / umUnidadeOriginalEmMg;
          
          valorConvertido = valorPorUnidadeOriginal * fator;
          
          console.log('🔢 Conversão de Valor:', {
            produto: p.nome_produto,
            de: `R$ ${valorPorUnidadeOriginal.toFixed(2)}/${unidadeOriginalProduto}`,
            para: `R$ ${valorConvertido.toFixed(2)}/${unidadeReferencia}`,
            fator,
            calculo: `${valorPorUnidadeOriginal.toFixed(2)} × ${fator} = ${valorConvertido.toFixed(2)}`
          });
        } else if (ehVolumeOrigem && ehVolumeDestino) {
          const umUnidadeOriginalEmML = convertToStandardUnit(1, unidadeOriginalProduto).quantidade;
          const umUnidadeReferenciaEmML = convertToStandardUnit(1, unidadeReferencia).quantidade;
          const fator = umUnidadeReferenciaEmML / umUnidadeOriginalEmML;
          valorConvertido = valorPorUnidadeOriginal * fator;
        }
      }

      // 🎯 PASSO 3: Calcular custo total
      const custoTotalProduto = quantidadeConvertida * valorConvertido;

      console.log('💰 Cálculo Ponderado:', {
        produto: p.nome_produto,
        valorOriginal: `R$ ${valorPorUnidadeOriginal.toFixed(2)}/${unidadeOriginalProduto}`,
        quantidadeConvertida: `${quantidadeConvertida.toFixed(2)} ${unidadeReferencia}`,
        valorConvertido: `R$ ${valorConvertido.toFixed(2)}/${unidadeReferencia}`,
        custoTotal: `R$ ${custoTotalProduto.toFixed(2)}`,
        calculo: `${quantidadeConvertida.toFixed(2)} ${unidadeReferencia} × R$ ${valorConvertido.toFixed(2)}/${unidadeReferencia} = R$ ${custoTotalProduto.toFixed(2)}`
      });

      somaCustoTotal += custoTotalProduto;
      somaQuantidadeTotal += quantidadeConvertida;
    });

    // 4️⃣ CALCULAR média ponderada
    const media = somaQuantidadeTotal > 0 
      ? somaCustoTotal / somaQuantidadeTotal 
      : 0;

    console.log('📊 Média Ponderada Final:', {
      totalProdutosNoGrupo: grupo.length,
      produtosComValor: produtosComValor.length,
      somaCustoTotal: `R$ ${somaCustoTotal.toFixed(2)}`,
      somaQuantidadeTotal: `${somaQuantidadeTotal.toFixed(2)} ${unidadeReferencia}`,
      mediaPonderada: `R$ ${media.toFixed(2)}/${unidadeReferencia}`,
      grupo: grupo[0].nome_produto
    });

    const primeiraUnidade = grupo[0].unidade;
    let totalEstoqueEmUnidadePadrao = 0;
    let unidadePadrao: 'mg' | 'mL' | null = null;

    if (isMassUnit(primeiraUnidade)) {
      unidadePadrao = 'mg';
      produtosEmEstoque.forEach(p => {
        const converted = convertToStandardUnit(p.quantidade ?? 0, p.unidade);
        totalEstoqueEmUnidadePadrao += converted.quantidade;
      });
    } else if (isVolumeUnit(primeiraUnidade)) {
      unidadePadrao = 'mL';
      produtosEmEstoque.forEach(p => {
        const converted = convertToStandardUnit(p.quantidade ?? 0, p.unidade);
        totalEstoqueEmUnidadePadrao += converted.quantidade;
      });
    } else {
      totalEstoqueEmUnidadePadrao = produtosEmEstoque.reduce((sum, p) => sum + (p.quantidade ?? 0), 0);
    }

    let totalEstoqueDisplay = totalEstoqueEmUnidadePadrao;
    let unidadeDisplay = primeiraUnidade;

    if (unidadePadrao) {
      const displayResult = getBestDisplayUnit(totalEstoqueEmUnidadePadrao, unidadePadrao);
      totalEstoqueDisplay = displayResult.quantidade;
      unidadeDisplay = displayResult.unidade;
    }

    const totalEstoque = totalEstoqueEmUnidadePadrao;

    const marcas = Array.from(new Set(grupo.map(p => p.marca)));
    const categorias = Array.from(new Set(grupo.map(p => p.categoria)));
    const unidades = Array.from(new Set(grupo.map(p => p.unidade)));
    const lotes = Array.from(new Set(grupo.map(p => p.lote)));
    const validades = Array.from(new Set(grupo.map(p => p.validade)));

    const fornecedoresMap: Record<string, { fornecedor: string|null, quantidade: number, valor: number|null, registro_mapa: string|null, ids: number[] }> = {};
    produtosEmEstoque.forEach(p => {
      const key = (p.fornecedor ?? "Desconhecido") + "_" + (p.valor ?? "0");
      if (!fornecedoresMap[key]) {
        fornecedoresMap[key] = {
          fornecedor: p.fornecedor ?? "Desconhecido",
          quantidade: 0,
          valor: p.valor,
          registro_mapa: p.registro_mapa ?? null,
          ids: []
        };
      }
      fornecedoresMap[key].quantidade += p.quantidade;
      fornecedoresMap[key].ids.push(p.id);
    });

    // ✅ Usar unidadeReferencia já calculada (do produto mais antigo)
    return {
      nome: nomeMaisComum,
      produtos: grupo,
      mediaPreco: media,
      mediaPrecoDisplay: media,
      totalEstoque,
      totalEstoqueDisplay,
      unidadeDisplay,
      marcas,
      categorias,
      unidades,
      lotes,
      validades,
      fornecedores: Object.values(fornecedoresMap),
      unidadeValorOriginal: unidadeReferencia,
      mediaPrecoOriginal: media
    };
  });
}
