export interface Divida {
  id: number;
  nome: string;
  credor: string;
  tipo: string;
  dataContratacao: string;
  valorContratado: number;
  taxa: string;
  carencia?: string;
  garantia?: string;
  responsavel: string;
  observacoes?: string;
  formaPagamento: string;
  situacao: 'Ativa' | 'Liquidada' | 'Renegociada';
  anexos: string[];
  // Campos adicionais para o formulário completo
  jurosAA?: string;
  indexador?: string;
  indexadorOutro?: string;
  pagamentoParcela?: {
    valor: number;
    data: string;
  };
  pagamentoParcelado?: {
    numParcelas: number;
    valorParcela: number;
    primeiradata: string;
  };
  pagamentoProducao?: {
    produto: string;
    quantidadeSacas: number;
    precoPorSaca?: number;
    dataPeriodo: string;
  };
  cronogramaManual?: string;
}

export const mockDividas: Divida[] = [
  {
    id: 1,
    nome: 'Custeio 2025',
    credor: 'Banco do Brasil',
    tipo: 'Financiamento bancário',
    dataContratacao: '2025-03-10',
    valorContratado: 120000,
    taxa: '12% a.a.',
    carencia: '6 meses',
    garantia: 'Safra 2025',
    responsavel: 'Produtor',
    observacoes: 'Financiamento para custeio da lavoura de café',
    formaPagamento: '6 parcelas anuais',
    situacao: 'Ativa',
    anexos: ['contrato_custeio.pdf'],
    jurosAA: 'a.a.',
    indexador: 'Fixo',
    pagamentoParcelado: {
      numParcelas: 6,
      valorParcela: 20000,
      primeiradata: '2025-09-10',
    },
  },
  {
    id: 2,
    nome: 'Financiamento Máquina Colheitadeira',
    credor: 'Itaú Unibanco',
    tipo: 'Máquina',
    dataContratacao: '2024-11-15',
    valorContratado: 250000,
    taxa: '10.5% a.a.',
    carencia: '1 ano',
    garantia: 'Hipoteca da máquina',
    responsavel: 'Empresa',
    observacoes: 'Financiamento de colheitadeira modelo X-2000',
    formaPagamento: '60 meses',
    situacao: 'Ativa',
    anexos: ['contrato_maquina.pdf', 'nota_fiscal.pdf'],
    jurosAA: 'a.a.',
    indexador: 'CDI',
    pagamentoParcelado: {
      numParcelas: 60,
      valorParcela: 4500,
      primeiradata: '2025-11-15',
    },
  },
  {
    id: 3,
    nome: 'CPR Física - Venda Safra 2025',
    credor: 'Cooperativa Agrícola Sul',
    tipo: 'CPR Física',
    dataContratacao: '2025-01-20',
    valorContratado: 180000,
    taxa: '8% a.a.',
    garantia: 'Safra de café 2025',
    responsavel: 'Produtor',
    observacoes: 'Contrato de Penhor Rural para entrega em sacas',
    formaPagamento: 'Entrega de 300 sacas de café',
    situacao: 'Ativa',
    anexos: ['cpr_fisica.pdf'],
    jurosAA: 'a.a.',
    indexador: 'Fixo',
    pagamentoProducao: {
      produto: 'Café',
      quantidadeSacas: 300,
      precoPorSaca: 600,
      dataPeriodo: 'Junho a Julho 2025',
    },
  },
  {
    id: 4,
    nome: 'Custeio Safra 2024 - Liquidado',
    credor: 'Banco do Nordeste',
    tipo: 'Custeio',
    dataContratacao: '2024-03-05',
    valorContratado: 95000,
    taxa: '11% a.a.',
    carencia: '3 meses',
    garantia: 'Safra 2024',
    responsavel: 'Produtor',
    observacoes: 'Custeio da safra 2024 - Já liquidado',
    formaPagamento: '4 parcelas',
    situacao: 'Liquidada',
    anexos: ['comprovante_liquidacao.pdf'],
    jurosAA: 'a.a.',
    indexador: 'Fixo',
    pagamentoParcelado: {
      numParcelas: 4,
      valorParcela: 23750,
      primeiradata: '2024-06-05',
    },
  },
  {
    id: 5,
    nome: 'Adiantamento de Venda - Pré-Colheita',
    credor: 'Exportadora Café Brasil',
    tipo: 'Adiantamento de venda',
    dataContratacao: '2025-02-14',
    valorContratado: 75000,
    taxa: '6% a.a.',
    responsavel: 'Produtor',
    observacoes: 'Adiantamento pela venda de 125 sacas',
    formaPagamento: 'Abatimento na venda',
    situacao: 'Ativa',
    anexos: [],
    jurosAA: 'a.a.',
    indexador: 'Fixo',
    pagamentoProducao: {
      produto: 'Café',
      quantidadeSacas: 125,
      dataPeriodo: 'Maio 2025',
    },
  },
  {
    id: 6,
    nome: 'Investimento em Terraceamento',
    credor: 'Programa Agricultura Sustentável',
    tipo: 'Investimento',
    dataContratacao: '2025-04-01',
    valorContratado: 45000,
    taxa: '4% a.a.',
    carencia: '2 anos',
    garantia: 'Benfeitorias na propriedade',
    responsavel: 'Produtor',
    observacoes: 'Investimento em terraceamento e sistema de irrigação',
    formaPagamento: '10 anos (carência 2 anos)',
    situacao: 'Ativa',
    anexos: ['projeto_sustentabilidade.pdf'],
    jurosAA: 'a.a.',
    indexador: 'Fixo',
    pagamentoParcelado: {
      numParcelas: 80,
      valorParcela: 562.5,
      primeiradata: '2027-04-01',
    },
  },
  {
    id: 7,
    nome: 'Barter - Insumos 2025',
    credor: 'Distribuidora de Insumos XYZ',
    tipo: 'Barter',
    dataContratacao: '2025-01-10',
    valorContratado: 32000,
    taxa: '0% a.a.',
    responsavel: 'Produtor',
    observacoes: 'Troca de insumos por café na colheita',
    formaPagamento: 'Entrega de sacas de café',
    situacao: 'Renegociada',
    anexos: ['acordo_barter.pdf'],
    jurosAA: 'a.a.',
    indexador: 'Fixo',
    pagamentoProducao: {
      produto: 'Café',
      quantidadeSacas: 50,
      dataPeriodo: 'Junho 2025',
    },
  },
];
