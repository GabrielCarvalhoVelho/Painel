// React import not required with new JSX runtime
import { Calendar, MapPin } from 'lucide-react';
import { ActivityService } from '../../services/activityService';

interface ActivityListProps {
  activities: Array<{
    id_atividade: string;
    nome_atividade?: string;
    observacao?: string;
    dataFormatada?: string;
    area?: string | number;
    produtos?: Array<{
      nome_produto?: string;
      quantidade_val?: number | null;
      quantidade_un?: string | null;
      dose_val?: number | null;
      dose_un?: string | null;
    }>;
    maquinas?: Array<{
      nome_maquina?: string;
      horas_maquina?: number | null;
    }>;
    responsaveis?: Array<{
      nome?: string;
    }>;
  }>;
}

export default function ActivityList({ activities }: ActivityListProps) {
  // Activities are already sorted by data_registro from the backend
  // No need to re-sort on frontend
  const sortedActivities = activities;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#092f20]">Atividades Agrícolas</h3>
        <div className="text-sm text-gray-600">Últimas {activities.length} atividades</div>
      </div>

      <div className="space-y-4">
        {sortedActivities.map((activity) => (
          <div key={activity.id_atividade} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {ActivityService.getAtividadeIcon(activity.nome_atividade || '')}
                </span>
                <div>
                  <h4 className="font-medium text-[#092f20]">{activity.nome_atividade}</h4>
                  {activity.observacao && (
                    <p className="text-sm text-gray-600 mt-1">{activity.observacao}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{activity.dataFormatada}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {activity.area && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#397738]" />
                  <div>
                    <p className="text-gray-600">Área</p>
                    <p className="font-medium text-[#092f20]">{activity.area}</p>
                  </div>
                </div>
              )}

              <div className="col-span-2 md:col-span-1">
                <span className="text-gray-600">Produtos</span>
                <ul className="mt-1 space-y-1">
                  {activity.produtos && activity.produtos.length > 0 ? (
                    activity.produtos.map((p, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span className="font-medium text-[#092f20]">{p.nome_produto}</span>
                        <span className="text-gray-500">
                          {p.quantidade_val ?? '-'} {p.quantidade_un ?? ''}
                          {p.dose_val ? ` · ${p.dose_val} ${p.dose_un ?? ''}` : ''}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Não informado</li>
                  )}
                </ul>
              </div>

              <div>
                <span className="text-gray-600">Responsáveis</span>
                <p className="font-medium text-[#092f20] mt-1">
                  {activity.responsaveis && activity.responsaveis.length > 0 ? activity.responsaveis.map(r => r.nome).join(', ') : 'Não informado'}
                </p>
              </div>
            </div>

            {/* Doses individuais já aparecem na lista de produtos acima (dose_val/dose_un) */}
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma atividade encontrada</p>
        </div>
      )}
    </div>
  );
}