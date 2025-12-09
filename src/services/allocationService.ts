import { supabase, AlocacaoTalhao } from '../lib/supabase';

export interface AllocationInput {
  id_transacao: string;
  id_talhao: string;
  percentual_alocacao: number;
}

export const allocationService = {
  async saveAllocations(allocations: AllocationInput[]): Promise<AlocacaoTalhao[]> {
    if (allocations.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('transacoes_talhoes_alocacao')
      .insert(allocations)
      .select();

    if (error) {
      console.error('Error saving allocations:', error);
      throw error;
    }

    return data || [];
  },

  async getAllocationsByTransaction(id_transacao: string): Promise<AlocacaoTalhao[]> {
    const { data, error } = await supabase
      .from('transacoes_talhoes_alocacao')
      .select(`
        *,
        talhoes:id_talhao (
          nome
        )
      `)
      .eq('id_transacao', id_transacao);

    if (error) {
      console.error('Error fetching allocations:', error);
      throw error;
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      id_transacao: item.id_transacao,
      id_talhao: item.id_talhao,
      percentual_alocacao: item.percentual_alocacao,
      criado_em: item.criado_em,
      atualizado_em: item.atualizado_em,
      nome_talhao: item.talhoes?.nome || 'N/A'
    }));
  },

  async updateAllocations(
    id_transacao: string,
    allocations: AllocationInput[]
  ): Promise<AlocacaoTalhao[]> {
    const { error: deleteError } = await supabase
      .from('transacoes_talhoes_alocacao')
      .delete()
      .eq('id_transacao', id_transacao);

    if (deleteError) {
      console.error('Error deleting old allocations:', deleteError);
      throw deleteError;
    }

    if (allocations.length === 0) {
      return [];
    }

    return await this.saveAllocations(allocations);
  },

  async deleteAllocationsByTransaction(id_transacao: string): Promise<void> {
    const { error } = await supabase
      .from('transacoes_talhoes_alocacao')
      .delete()
      .eq('id_transacao', id_transacao);

    if (error) {
      console.error('Error deleting allocations:', error);
      throw error;
    }
  },

  async getAllocationsByTalhao(id_talhao: string): Promise<AlocacaoTalhao[]> {
    const { data, error } = await supabase
      .from('transacoes_talhoes_alocacao')
      .select('*')
      .eq('id_talhao', id_talhao);

    if (error) {
      console.error('Error fetching allocations by talhao:', error);
      throw error;
    }

    return data || [];
  },

  validateAllocations(allocations: AllocationInput[]): { valid: boolean; error?: string } {
    if (allocations.length === 0) {
      return { valid: false, error: 'Pelo menos um talhão deve ter alocação' };
    }

    const totalPercentage = allocations.reduce(
      (sum, alloc) => sum + alloc.percentual_alocacao,
      0
    );

    if (Math.abs(totalPercentage - 100) > 0.01) {
      return {
        valid: false,
        error: `A soma das alocações deve ser 100%. Atual: ${totalPercentage.toFixed(2)}%`
      };
    }

    for (const alloc of allocations) {
      if (alloc.percentual_alocacao < 0 || alloc.percentual_alocacao > 100) {
        return {
          valid: false,
          error: 'Cada alocação deve estar entre 0% e 100%'
        };
      }
    }

    return { valid: true };
  }
};
