import { useState } from 'react';
import { Plus } from 'lucide-react';
import { mockOcorrencias, Ocorrencia } from './mockOcorrencias';
import OcorrenciaCard from './OcorrenciaCard';
import OcorrenciaDetailPanel from './OcorrenciaDetailPanel';
import OcorrenciaFormModal from './OcorrenciaFormModal';
import LoadingSpinner from '../Dashboard/LoadingSpinner';

export default function PragasDoencasPanel() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(mockOcorrencias);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<Ocorrencia | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOcorrencia, setEditingOcorrencia] = useState<Ocorrencia | null>(null);
  const [loading] = useState(false);

  const handleViewDetails = (ocorrencia: Ocorrencia) => {
    setSelectedOcorrencia(ocorrencia);
    setIsDetailOpen(true);
  };

  const handleEdit = (ocorrencia: Ocorrencia) => {
    setEditingOcorrencia(ocorrencia);
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  const handleMarkResolved = (ocorrencia: Ocorrencia) => {
    console.log('✅ Marcando como resolvida:', ocorrencia.id);
    const updated = ocorrencias.map((o) =>
      o.id === ocorrencia.id ? { ...o, status: 'Resolvida' as const } : o
    );
    setOcorrencias(updated);
    setSelectedOcorrencia(updated.find((o) => o.id === ocorrencia.id) || null);
  };

  const handleDelete = (ocorrenciaId: number) => {
    console.log('🗑️ Deletando ocorrência:', ocorrenciaId);
    setOcorrencias(ocorrencias.filter((o) => o.id !== ocorrenciaId));
    setIsDetailOpen(false);
    setSelectedOcorrencia(null);
  };

  const handleFormSubmit = (formData: Partial<Ocorrencia>) => {
    if (editingOcorrencia) {
      console.log('✏️ Editando ocorrência:', editingOcorrencia.id, formData);
      const updated = ocorrencias.map((o) =>
        o.id === editingOcorrencia.id
          ? { ...o, ...formData }
          : o
      );
      setOcorrencias(updated);
      setEditingOcorrencia(null);
    } else {
      console.log('➕ Criando nova ocorrência:', formData);
      const newId = Math.max(...ocorrencias.map((o) => o.id), 0) + 1;
      const newOcorrencia: Ocorrencia = {
        id: newId,
        origem: 'Painel',
        anexos: [],
        fotoPrincipal: '🌾',
        ...formData,
      } as Ocorrencia;
      setOcorrencias([newOcorrencia, ...ocorrencias]);
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
      {/* Header */}
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

      {/* Cards Grid */}
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

      {/* Detail Panel */}
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

      {/* Form Modal */}
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
