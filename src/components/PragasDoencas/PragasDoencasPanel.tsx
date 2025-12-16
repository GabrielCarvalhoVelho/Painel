import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Ocorrencia } from './mockOcorrencias';
import OcorrenciaCard from './OcorrenciaCard';
import OcorrenciaDetailPanel from './OcorrenciaDetailPanel';
import OcorrenciaFormModal from './OcorrenciaFormModal';
import LoadingSpinner from '../Dashboard/LoadingSpinner';
import { PragasDoencasService, PragaDoencaComTalhoes } from '../../services/pragasDoencasService';

const TEMP_USER_ID = 'e60c8e2a-db11-4e6c-a223-b9d2b0dd65e7';

function adaptarParaOcorrencia(praga: PragaDoencaComTalhoes): Ocorrencia {
  const nomeTalhao = praga.talhoes_vinculados && praga.talhoes_vinculados.length > 0
    ? praga.talhoes_vinculados[0].nome_talhao || 'Sem talhão'
    : praga.talhoes || 'Sem talhão';

  return {
    id: praga.id,
    origem: (praga.origem as 'WhatsApp' | 'Painel') || 'Painel',
    talhao: nomeTalhao,
    dataOcorrencia: praga.data_da_ocorrencia,
    faseLavoura: (praga.fase_da_lavoura as any) || 'Vegetativo',
    tipoOcorrencia: (praga.tipo_de_ocorrencia as any) || 'Praga',
    severidade: (praga.nivel_da_gravidade as any) || 'Média',
    areaAfetada: praga.area_afetada || '',
    sintomas: praga.sintomas_observados || '',
    acaoTomada: praga.acao_tomada || '',
    nomePraga: praga.nome_praga,
    diagnostico: (praga.diagnostico as any),
    descricaoDetalhada: praga.descricao_detalhada,
    climaRecente: praga.clima_recente,
    produtosAplicados: praga.produtos_aplicados,
    dataAplicacao: praga.data_aplicacao,
    recomendacoes: praga.recomendacoes,
    status: (praga.status as any) || 'Nova',
    anexos: praga.anexos,
    fotoPrincipal: praga.foto_principal || PragasDoencasService.getOcorrenciaIcon(praga.tipo_de_ocorrencia),
  };
}

export default function PragasDoencasPanel() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<Ocorrencia | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOcorrencia, setEditingOcorrencia] = useState<Ocorrencia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOcorrencias();
  }, []);

  const loadOcorrencias = async () => {
    setLoading(true);
    try {
      const data = await PragasDoencasService.getOcorrencias(TEMP_USER_ID);
      const adaptadas = data.map(adaptarParaOcorrencia);
      setOcorrencias(adaptadas);
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (ocorrencia: Ocorrencia) => {
    setSelectedOcorrencia(ocorrencia);
    setIsDetailOpen(true);
  };

  const handleEdit = (ocorrencia: Ocorrencia) => {
    setEditingOcorrencia(ocorrencia);
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  const handleMarkResolved = async (ocorrencia: Ocorrencia) => {
    console.log('✅ Marcando como resolvida:', ocorrencia.id);

    const { error } = await PragasDoencasService.updateStatus(
      ocorrencia.id,
      'Resolvida',
      TEMP_USER_ID
    );

    if (error) {
      console.error('Erro ao atualizar status:', error);
      return;
    }

    const updated = ocorrencias.map((o) =>
      o.id === ocorrencia.id ? { ...o, status: 'Resolvida' as const } : o
    );
    setOcorrencias(updated);
    setSelectedOcorrencia(updated.find((o) => o.id === ocorrencia.id) || null);
  };

  const handleDelete = async (ocorrenciaId: number) => {
    console.log('🗑️ Deletando ocorrência:', ocorrenciaId);

    const { error } = await PragasDoencasService.deleteOcorrencia(ocorrenciaId);

    if (error) {
      console.error('Erro ao deletar ocorrência:', error);
      return;
    }

    setOcorrencias(ocorrencias.filter((o) => o.id !== ocorrenciaId));
    setIsDetailOpen(false);
    setSelectedOcorrencia(null);
  };

  const handleFormSubmit = async (formData: Partial<Ocorrencia>) => {
    if (editingOcorrencia) {
      console.log('✏️ Editando ocorrência:', editingOcorrencia.id, formData);

      const payload = {
        user_id: TEMP_USER_ID,
        talhoes: formData.talhao,
        data_da_ocorrencia: formData.dataOcorrencia,
        fase_da_lavoura: formData.faseLavoura,
        tipo_de_ocorrencia: formData.tipoOcorrencia,
        nivel_da_gravidade: formData.severidade,
        area_afetada: formData.areaAfetada,
        sintomas_observados: formData.sintomas,
        acao_tomada: formData.acaoTomada,
        nome_praga: formData.nomePraga,
        diagnostico: formData.diagnostico,
        descricao_detalhada: formData.descricaoDetalhada,
        clima_recente: formData.climaRecente,
        produtos_aplicados: formData.produtosAplicados,
        data_aplicacao: formData.dataAplicacao,
        recomendacoes: formData.recomendacoes,
        status: formData.status,
        origem: formData.origem || 'Painel',
        foto_principal: formData.fotoPrincipal,
      };

      const { error } = await PragasDoencasService.updateOcorrencia(
        editingOcorrencia.id,
        payload
      );

      if (error) {
        console.error('Erro ao atualizar ocorrência:', error);
        return;
      }

      await loadOcorrencias();
      setEditingOcorrencia(null);
    } else {
      console.log('➕ Criando nova ocorrência:', formData);

      const payload = {
        user_id: TEMP_USER_ID,
        talhoes: formData.talhao,
        data_da_ocorrencia: formData.dataOcorrencia || new Date().toISOString().split('T')[0],
        fase_da_lavoura: formData.faseLavoura || 'Vegetativo',
        tipo_de_ocorrencia: formData.tipoOcorrencia || 'Praga',
        nivel_da_gravidade: formData.severidade || 'Média',
        area_afetada: formData.areaAfetada || '',
        sintomas_observados: formData.sintomas || '',
        acao_tomada: formData.acaoTomada || '',
        nome_praga: formData.nomePraga,
        diagnostico: formData.diagnostico,
        descricao_detalhada: formData.descricaoDetalhada,
        clima_recente: formData.climaRecente,
        produtos_aplicados: formData.produtosAplicados || [],
        data_aplicacao: formData.dataAplicacao,
        recomendacoes: formData.recomendacoes,
        status: formData.status || 'Nova',
        origem: 'Painel',
        foto_principal: formData.fotoPrincipal || PragasDoencasService.getOcorrenciaIcon(formData.tipoOcorrencia),
        anexos: [],
      };

      const { error } = await PragasDoencasService.createOcorrencia(payload);

      if (error) {
        console.error('Erro ao criar ocorrência:', error);
        return;
      }

      await loadOcorrencias();
    }
    setIsFormOpen(false);
  };

  const handleNewOcorrencia = () => {
    setEditingOcorrencia(null);
    setIsFormOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pragas e Doenças</h1>
          <p className="text-gray-600 mt-1">Acompanhe ocorrências de pragas e doenças nas suas culturas</p>
        </div>
        <button
          onClick={handleNewOcorrencia}
          className="flex items-center gap-2 px-4 py-2 bg-[#00A651] hover:bg-[#008c44] text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Ocorrência
        </button>
      </div>

      {ocorrencias.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma ocorrência registrada</h3>
          <p className="text-gray-600 mb-6">
            Comece registrando uma nova ocorrência de praga ou doença
          </p>
          <button
            onClick={handleNewOcorrencia}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#00A651] hover:bg-[#008c44] text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Registrar Ocorrência
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ocorrencias.map((ocorrencia) => (
            <OcorrenciaCard
              key={ocorrencia.id}
              ocorrencia={ocorrencia}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onMarkResolved={handleMarkResolved}
            />
          ))}
        </div>
      )}

      {isDetailOpen && selectedOcorrencia && (
        <OcorrenciaDetailPanel
          ocorrencia={selectedOcorrencia}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedOcorrencia(null);
          }}
          onEdit={handleEdit}
          onMarkResolved={handleMarkResolved}
          onDelete={handleDelete}
        />
      )}

      <OcorrenciaFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOcorrencia(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingOcorrencia}
      />
    </div>
  );
}
