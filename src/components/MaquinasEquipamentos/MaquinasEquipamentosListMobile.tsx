import React from 'react';
import { Truck, Paperclip } from 'lucide-react';
import { MaquinasEquipamentos } from '../../lib/supabase';

interface Props {
  maquinas: MaquinasEquipamentos[];
  onOpenAttachments: (maquina: MaquinasEquipamentos) => void;
}

export default function MaquinasEquipamentosListMobile({ maquinas, onOpenAttachments }: Props) {
  const formatHours = (h?: number | null) =>
    h !== null && h !== undefined ? `${h.toLocaleString('pt-BR')} h` : '-';

  const formatBRL = (v?: number | null) =>
    v !== null && v !== undefined
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
      : '-';

  const formatDate = (d?: string | Date | null) =>
    d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  if (maquinas.length === 0) {
    return (
      <div className="block md:hidden">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#092f20] mb-2">
            Nenhuma máquina ativa encontrada
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-4">
      {maquinas.map((maquina) => (
        <div
          key={maquina.id_maquina}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-[#092f20] mb-1">
                {maquina.nome}
              </h4>
              <p className="text-sm font-medium text-gray-600 mb-2">
                {maquina.marca_modelo || '-'}
              </p>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full inline-block">
                {maquina.categoria || '-'}
              </span>
            </div>
            <button
              onClick={() => onOpenAttachments(maquina)}
              title="Gerenciar arquivos"
              aria-label={`Gerenciar arquivos de ${maquina.nome}`}
              className="p-2 bg-gray-200 text-gray-600 hover:text-[#397738] hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">Horímetro Atual</p>
              <p className="text-sm font-medium text-[#092f20]">
                {formatHours(maquina.horimetro_atual)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Valor de Compra</p>
              <p className="text-sm font-medium text-[#397738]">
                {formatBRL(maquina.valor_compra)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Data de Compra</p>
              <p className="text-sm font-medium text-[#092f20]">
                {formatDate(maquina.data_compra)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Fornecedor</p>
              <p className="text-sm font-medium text-[#092f20] truncate">
                {maquina.fornecedor || '-'}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-gray-500 mb-1">Número de Série</p>
              <p className="text-sm font-medium text-[#092f20] truncate">
                {maquina.numero_serie || '-'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
