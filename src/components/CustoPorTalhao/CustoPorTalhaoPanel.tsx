import React, { useState, useEffect } from 'react';
import { BarChart3, X, Info } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { TalhaoService } from '../../services/talhaoService';
import { CustoPorTalhaoService } from '../../services/custoPorTalhaoService';
import type { Talhao } from '../../lib/supabase';

  // Interfaces
  interface Filtros {
    safra: string;
    fazenda: string;
    talhoes: string[];
    macrogrupo: string;
    mesAno: string;
  }

  interface CustoTalhao {
    talhao: string;
    area: number;
    insumos: number;
    operacional: number;
    servicosLogistica: number;
    administrativos: number;
    outros: number;
    total: number;
    custoHa: number;
  }

  interface DetalheCusto {
    data: string;
    categoria: string;
    descricao: string;
    origem: 'Financeiro' | 'Atividade Agrícola';
    valor: number;
  }



  export default function CustoPorTalhaoPanel() {
    const [_loading, setLoading] = useState(false);
    const [_filtros, _setFiltros] = useState<Filtros>({
      safra: '2024/2025',
      fazenda: '',
      talhoes: [],
      macrogrupo: 'Todos',
      mesAno: ''
    });
    const [filtroTalhao, setFiltroTalhao] = useState('todos');

    const [talhoes, setTalhoes] = useState<Talhao[]>([]);
    const [custosMap, setCustosMap] = useState<Record<string, { id: string; nome: string; area: number; insumos: number; operacional: number; servicosLogistica: number; administrativos: number; outros: number; receita: number }>>({});
    const [talhaoSelecionado, _setTalhaoSelecionado] = useState<CustoTalhao | null>(null);
    const [detalhesCusto, _setDetalhesCusto] = useState<DetalheCusto[]>([]);
    const [painelLateralAberto, setPainelLateralAberto] = useState(false);
    const [modalPendenciasAberto, setModalPendenciasAberto] = useState(false);
    

    // Dados iniciais simples — removidos os mocks complexos
    const totalPendencias = 0;

    const macrogrupos = [
      { key: 'insumos', label: 'Insumos', tooltip: 'Fertilizantes, defensivos, sementes' },
      { key: 'operacional', label: 'Operacional', tooltip: 'Combustível, manutenção, reparos' },
      { key: 'servicosLogistica', label: 'Serviços/Logística', tooltip: 'Transporte, armazenagem, serviços terceirizados' },
      { key: 'administrativos', label: 'Administrativos', tooltip: 'Despesas fixas, seguros, impostos' },
      { key: 'outros', label: 'Outros', tooltip: 'Despesas diversas' }
    ];

    // Carrega dados iniciais ao montar: buscar talhões do usuário e popular lista
    useEffect(() => {
      let mounted = true;
      const loadTalhoes = async () => {
        setLoading(true);
        try {
          const auth = AuthService.getInstance();
          let currentUser = auth.getCurrentUser();
          if (!currentUser) {
            currentUser = await auth.init();
          }

          if (!currentUser) {
            console.warn('Usuário não autenticado — nenhum talhão será carregado');
            setTalhoes([]);
            return;
          }

          const talhoesData = await TalhaoService.getTalhoesPorCriador(currentUser.user_id, { onlyActive: true, cultura: 'Café' });
          if (!mounted) return;
          // Excluir talhão default (talhao_default === true) tanto do filtro quanto da tabela
          const visibleTalhoes = (talhoesData || []).filter(t => !t.talhao_default);
          setTalhoes(visibleTalhoes);

          // carregar insumos do dia (data_agendamento_pagamento = hoje)
          try {
            const hoje = new Date();
            const yyyy = hoje.getFullYear();
            const mm = String(hoje.getMonth() + 1).padStart(2, '0');
            const dd = String(hoje.getDate()).padStart(2, '0');
            const hojeStr = `${yyyy}-${mm}-${dd}`;

            const custos = await CustoPorTalhaoService.getInsumosPorTalhao(currentUser.user_id, hojeStr);
            if (!mounted) return;
            setCustosMap(custos || {});
          } catch (err) {
            console.error('Erro ao carregar insumos por talhão:', err);
          }
          // Neste passo apenas carregamos nomes; custos virão depois
        } catch (err) {
          console.error('Erro ao carregar talhões:', err);
          // fallback para lista vazia
          setTalhoes([]);
        } finally {
          if (mounted) setLoading(false);
        }
      };

      loadTalhoes();
      return () => { mounted = false; };
    }, []);

    // Por enquanto não abrimos painel de detalhes (sem dados de custo)

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    // NOTE: removido carregamento por mock

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#004417] flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Custo por Talhão
          </h1>
          <p className="text-[#1d3a2d] mt-1">Resumo dos custos por área</p>
        </div>

        {/* Filtro por Talhões (igual ao Manejo Agrícola) */}
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,68,23,0.06)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#004417]">Filtrar por Talhão</h3>
            <div className="text-[13px] text-[rgba(0,68,23,0.75)] font-medium">
              {talhoes.length} {talhoes.length === 1 ? 'talhão encontrado' : 'talhões encontrados'}
            </div>
          </div>

          <div className="flex items-center flex-row flex-nowrap gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
            {['todos', ...talhoes.map(t => t.nome)].map((opcao) => (
              <button
                key={opcao}
                onClick={() => setFiltroTalhao(opcao)}
                className={`px-4 py-2 rounded-[10px] text-sm font-semibold transition-all duration-200 whitespace-nowrap snap-start flex-shrink-0 ${
                  filtroTalhao === opcao
                    ? 'bg-[rgba(0,166,81,0.10)] border border-[#00A651] text-[#004417] font-semibold'
                    : 'bg-white border border-[rgba(0,68,23,0.10)] text-[#004417] hover:bg-[rgba(0,68,23,0.03)] hover:border-[rgba(0,68,23,0.12)]'
                }`}
              >
                {opcao === 'todos' ? 'Sem Filtro' : opcao}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela Principal - Desktop (≥1024px) */}
        <div className="bg-white rounded-xl shadow-sm border border-[rgba(0,0,0,0.06)] p-6 hidden lg:block">
          <h3 className="text-lg font-bold text-[#004417] mb-4">Custo por Talhão</h3>
        
          <div className="overflow-x-auto bg-white rounded-xl shadow-[0_2px_8px_rgba(0,68,23,0.06)] overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[rgba(0,166,81,0.06)] rounded-t-2xl">
                  <th className="px-6 py-4 text-left text-[14px] font-bold text-[#004417]">Talhão</th>
                  {macrogrupos.map(grupo => (
                    <th key={grupo.key} className="px-6 py-4 text-right text-[14px] font-bold text-[#004417] relative group">
                      <span className="flex items-center justify-end gap-1">
                        <span className="whitespace-nowrap">{grupo.label}</span>
                        <Info className="w-3.5 h-3.5 text-[#004417]" />
                      </span>
                      <div className="hidden group-hover:block absolute top-full right-0 mt-1 bg-[#004417] text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        {grupo.tooltip}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-[14px] font-bold text-[#004417]">Total</th>
                  <th className="px-6 py-4 text-right text-[14px] font-bold text-[#004417]">R$/ha</th>
                </tr>
              </thead>
              <tbody>
                {talhoes.map((t, index) => (
                  <tr
                    key={t.id_talhao || index}
                    className="bg-white border-b border-[rgba(0,0,0,0.06)] transition-all"
                  >
                    <td className="px-6 py-5 text-sm text-[#004417] font-medium align-top">{t.nome}</td>
                    {/* Valores por macrogrupo */}
                    {macrogrupos.map(gr => {
                      const value = (custosMap[t.id_talhao] && (custosMap[t.id_talhao] as any)[gr.key]) || 0;
                      return (
                        <td key={gr.key} className="px-6 py-5 text-sm text-right text-[#1d3a2d] font-semibold align-top">
                          {formatCurrency(value)}
                        </td>
                      );
                    })}
                    {/* Total */}
                    <td className="px-6 py-5 text-sm font-bold text-[#004417] text-right align-top">
                      {formatCurrency(((() => {
                        const c = custosMap[t.id_talhao] || { insumos: 0, operacional: 0, servicosLogistica: 0, administrativos: 0, outros: 0 } as any;
                        return (c.insumos || 0) + (c.operacional || 0) + (c.servicosLogistica || 0) + (c.administrativos || 0) + (c.outros || 0);
                      })()))}
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-[#00A651] text-right align-top">
                      {(() => {
                        const c = custosMap[t.id_talhao] || { insumos: 0, operacional: 0, servicosLogistica: 0, administrativos: 0, outros: 0, receita: 0 } as any;
                        const total = (c.insumos || 0) + (c.operacional || 0) + (c.servicosLogistica || 0) + (c.administrativos || 0) + (c.outros || 0);
                        const area = t.area || 0;
                        const perHa = area > 0 ? total / area : 0;
                        return formatCurrency(perHa) + '/ha';
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards Mobile - Vertical (≤1023px) */}
        <div className="lg:hidden space-y-2">
          {talhoes.map((t, index) => (
            <div key={t.id_talhao || index} className="bg-white rounded-xl shadow-sm border border-[rgba(0,0,0,0.06)] p-3">
              <div className="text-base font-medium text-[#004417]">{t.nome}</div>
            </div>
          ))}
        </div>

        {/* Painel Lateral (Drill-down) */}
        {painelLateralAberto && talhaoSelecionado && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col">
              {/* Header do Painel */}
              <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
                <div>
                  <h3 className="text-xl font-bold text-[#004417]">{talhaoSelecionado.talhao}</h3>
                  <p className="text-sm text-[#1d3a2d]">Detalhamento de custos</p>
                </div>
                <button
                  onClick={() => setPainelLateralAberto(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: '#004417' }}
                >
                  <X className="w-5 h-5 text-[#004417]" />
                </button>
              </div>

              {/* Conteúdo do Painel */}
              <div className="flex-1 overflow-y-auto p-6">
                <div>
                  {/* Desktop: tabela */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[rgba(0,166,81,0.06)] rounded-t-2xl">
                          <th className="px-6 py-4 text-left text-[14px] font-bold text-[#004417]">Data</th>
                          <th className="px-6 py-4 text-left text-[14px] font-bold text-[#004417]">Categoria</th>
                          <th className="px-6 py-4 text-left text-[14px] font-bold text-[#004417]">Descrição</th>
                          <th className="px-6 py-4 text-left text-[14px] font-bold text-[#004417]">Origem</th>
                          <th className="px-6 py-4 text-right text-[14px] font-bold text-[#004417]">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detalhesCusto.map((detalhe, index) => (
                          <tr key={index} className="bg-white border-b border-[rgba(0,0,0,0.06)]">
                            <td className="px-6 py-5 text-sm text-[#1d3a2d]">{detalhe.data}</td>
                            <td className="px-6 py-5 text-sm text-[#1d3a2d]">{detalhe.categoria}</td>
                            <td className="px-6 py-5 text-sm text-[#1d3a2d]">{detalhe.descricao}</td>
                            <td className="px-6 py-5 text-sm">
                              <span className={`text-sm font-medium ${
                                detalhe.origem === 'Financeiro' ? 'text-[#004417]' : 'text-[#00A651]'
                              }`}>
                                {detalhe.origem}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm font-semibold text-[#004417] text-right">{formatCurrency(detalhe.valor)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: cards separados */}
                  <div className="lg:hidden space-y-4">
                    {detalhesCusto.map((detalhe, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm border border-[rgba(0,0,0,0.06)] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-sm text-[#1d3a2d]">{detalhe.data}</div>
                            <div className="text-base font-bold text-[#004417] truncate">{detalhe.categoria}</div>
                            <div className="text-sm text-[#1d3a2d] mt-1 truncate">{detalhe.descricao}</div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className={`text-sm font-medium ${detalhe.origem === 'Financeiro' ? 'text-[#004417]' : 'text-[#00A651]'}`}>
                              {detalhe.origem}
                            </div>
                            <div className="text-lg font-bold text-[#004417] mt-2">{formatCurrency(detalhe.valor)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rodapé do Painel */}
                <div className="p-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', backgroundColor: 'white' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">
                    <span className="text-[#1d3a2d]">💰 Total: </span>
                    <span className="font-bold text-[#004417]">{formatCurrency(talhaoSelecionado.total)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-[#1d3a2d]">📐 Custo/ha: </span>
                    <span className="font-bold text-[#00A651]">{formatCurrency(talhaoSelecionado.custoHa)}/ha</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Pendências */}
        {modalPendenciasAberto && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
              {/* Header do Modal */}
              <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
                <div>
                  <h3 className="text-xl font-bold text-[#004417]">Pendências</h3>
                  <p className="text-sm text-[#1d3a2d]">{totalPendencias} itens pendentes</p>
                </div>
                <button
                  onClick={() => setModalPendenciasAberto(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: '#004417' }}
                >
                  <X className="w-5 h-5 text-[#004417]" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="flex-1 overflow-y-auto p-6">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#004417' }}>
                      <th className="text-left p-3 text-sm font-bold text-white">Tipo</th>
                      <th className="text-left p-3 text-sm font-bold text-white">Referência</th>
                      <th className="text-left p-3 text-sm font-bold text-white">Descrição</th>
                      <th className="text-left p-3 text-sm font-bold text-white">Status</th>
                      <th className="text-center p-3 text-sm font-bold text-white">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalPendencias === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-sm text-[#1d3a2d]">Sem pendências</td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-sm text-[#1d3a2d]">Há pendências — implementar listagem</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
