import { useState } from 'react';
import { X } from 'lucide-react';
import { Ocorrencia } from './mockOcorrencias';

interface OcorrenciaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ocorrencia: Partial<Ocorrencia>) => void;
  initialData?: Ocorrencia | null;
}

const fasesOptions = ['Vegetativo', 'Floração', 'Granação', 'Pré-colheita', 'Colheita', 'Pós-colheita'];
const tiposOptions = ['Praga', 'Doença', 'Deficiência', 'Planta daninha', 'Não sei / Outra'];
const severidadeOptions = ['Baixa', 'Média', 'Alta'];
const diagnosticoOptions = ['Sugerido pela IA (não confirmado)', 'Confirmado pelo agrônomo', 'Ainda em dúvida'];
const statusOptions = ['Nova', 'Em acompanhamento', 'Resolvida'];

export default function OcorrenciaFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: OcorrenciaFormModalProps) {
  const [formData, setFormData] = useState<Partial<Ocorrencia>>(
    initialData || {
      talhao: '',
      dataOcorrencia: '',
      faseLavoura: 'Vegetativo',
      tipoOcorrencia: 'Praga',
      severidade: 'Média',
      areaAfetada: '',
      sintomas: '',
      acaoTomada: '',
      nomePraga: '',
      diagnostico: 'Sugerido pela IA (não confirmado)',
      descricaoDetalhada: '',
      climaRecente: '',
      produtosAplicados: [],
      dataAplicacao: '',
      recomendacoes: '',
      status: 'Nova',
    }
  );

  const [produtoInput, setProdutoInput] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduto = () => {
    if (produtoInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        produtosAplicados: [...(prev.produtosAplicados || []), produtoInput.trim()],
      }));
      setProdutoInput('');
    }
  };

  const handleRemoveProduto = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      produtosAplicados: (prev.produtosAplicados || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Formulário de ocorrência enviado:', formData);
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Editar Ocorrência' : 'Nova Ocorrência'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* SEÇÃO 1: Campos Obrigatórios */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Informações da Ocorrência
                </h3>

                {/* 1. Talhão */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Talhão / Área *
                  </label>
                  <input
                    type="text"
                    name="talhao"
                    value={formData.talhao || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    placeholder="Ex: Talhão 3"
                    required
                  />
                </div>

                {/* 2. Data da ocorrência */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Ocorrência *
                  </label>
                  <input
                    type="date"
                    name="dataOcorrencia"
                    value={formData.dataOcorrencia || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* 3. Fase da lavoura */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fase da Lavoura *
                  </label>
                  <select
                    name="faseLavoura"
                    value={formData.faseLavoura || 'Vegetativo'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    required
                  >
                    {fasesOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Tipo da ocorrência */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo da Ocorrência *
                  </label>
                  <select
                    name="tipoOcorrencia"
                    value={formData.tipoOcorrencia || 'Praga'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    required
                  >
                    {tiposOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Severidade */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severidade *
                  </label>
                  <select
                    name="severidade"
                    value={formData.severidade || 'Média'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    required
                  >
                    {severidadeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Área afetada */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área Afetada Aproximada *
                  </label>
                  <input
                    type="text"
                    name="areaAfetada"
                    value={formData.areaAfetada || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    placeholder="Ex: ~10% do talhão"
                    required
                  />
                </div>

                {/* 7. Sintomas observados */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sintomas Observados *
                  </label>
                  <textarea
                    name="sintomas"
                    value={formData.sintomas || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none resize-none"
                    rows={3}
                    placeholder="Descreva os sintomas observados"
                    required
                  />
                </div>

                {/* 8. Ação tomada */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ação Tomada *
                  </label>
                  <textarea
                    name="acaoTomada"
                    value={formData.acaoTomada || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none resize-none"
                    rows={2}
                    placeholder="Qual ação foi tomada para contornar o problema"
                    required
                  />
                </div>
              </div>

              {/* SEÇÃO 2: Campos Extras (apenas no painel) */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Informações Adicionais
                </h3>

                {/* 9. Nome da praga/doença */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Praga / Doença
                  </label>
                  <input
                    type="text"
                    name="nomePraga"
                    value={formData.nomePraga || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    placeholder="Ex: Ferrugem do cafeeiro"
                  />
                </div>

                {/* 10. Confirmação do diagnóstico */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmação do Diagnóstico
                  </label>
                  <select
                    name="diagnostico"
                    value={formData.diagnostico || 'Sugerido pela IA (não confirmado)'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                  >
                    {diagnosticoOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 11. Descrição detalhada */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição Detalhada dos Sintomas
                  </label>
                  <textarea
                    name="descricaoDetalhada"
                    value={formData.descricaoDetalhada || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none resize-none"
                    rows={2}
                    placeholder="Detalhe mais sobre os sintomas"
                  />
                </div>

                {/* 12. Clima recente */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clima Recente
                  </label>
                  <input
                    type="text"
                    name="climaRecente"
                    value={formData.climaRecente || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    placeholder="Ex: Últimos 7 dias com muita chuva"
                  />
                </div>

                {/* 13. Produtos aplicados */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produtos Aplicados
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={produtoInput}
                      onChange={(e) => setProdutoInput(e.target.value)}
                      placeholder="Ex: Fungicida X – 0,5 L/ha"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddProduto();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddProduto}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {formData.produtosAplicados && formData.produtosAplicados.length > 0 && (
                    <div className="space-y-2">
                      {formData.produtosAplicados.map((produto, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-sm"
                        >
                          <span className="text-gray-700">{produto}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduto(idx)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 14. Data da aplicação */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Aplicação
                  </label>
                  <input
                    type="date"
                    name="dataAplicacao"
                    value={formData.dataAplicacao || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                  />
                </div>

                {/* 15. Recomendações */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Próximas Recomendações / Acompanhamento
                  </label>
                  <textarea
                    name="recomendacoes"
                    value={formData.recomendacoes || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none resize-none"
                    rows={2}
                    placeholder="Recomendações para acompanhamento futuro"
                  />
                </div>

                {/* 16. Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status da Ocorrência *
                  </label>
                  <select
                    name="status"
                    value={formData.status || 'Nova'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                    required
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 17. Anexos (mockado) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anexos Adicionais (Mockado)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-not-allowed opacity-50">
                    <p className="text-sm text-gray-600">
                      Upload desabilitado (mock apenas)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 md:p-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#00A651] hover:bg-[#008c44] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
