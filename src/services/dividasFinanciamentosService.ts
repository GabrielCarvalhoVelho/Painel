import { supabase } from '../lib/supabase';

export interface DividaFinanciamento {
  id: string;
  user_id: string;
  nome: string;
  credor: string;
  tipo: string;
  data_contratacao: string;
  valor_contratado: number;
  taxa?: string;
  carencia?: string;
  garantia?: string;
  responsavel: string;
  observacoes?: string;
  forma_pagamento: string;
  situacao: 'Ativa' | 'Liquidada' | 'Renegociada';
  juros_aa?: string;
  indexador?: string;
  indexador_outro?: string;
  pagamento_parcela?: {
    valor: number;
    data: string;
  };
  pagamento_parcelado?: {
    numParcelas: number;
    valorParcela: number;
    primeiradata: string;
  };
  pagamento_producao?: {
    produto: string;
    quantidadeSacas: number;
    precoPorSaca?: number;
    dataPeriodo: string;
  };
  cronograma_manual?: string;
  anexos: string[];
  created_at?: string;
  updated_at?: string;
}

export class DividasFinanciamentosService {
  static async getAll(userId: string): Promise<DividaFinanciamento[]> {
    try {
      const { data, error } = await supabase
        .from('dividas_financiamentos')
        .select('*')
        .eq('user_id', userId)
        .order('data_contratacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dívidas:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Erro ao buscar dívidas:', err);
      return [];
    }
  }

  static async getById(id: string): Promise<DividaFinanciamento | null> {
    try {
      const { data, error } = await supabase
        .from('dividas_financiamentos')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dívida:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Erro ao buscar dívida:', err);
      return null;
    }
  }

  static async create(divida: Omit<DividaFinanciamento, 'id' | 'created_at' | 'updated_at'>): Promise<DividaFinanciamento | null> {
    try {
      const { data, error } = await supabase
        .from('dividas_financiamentos')
        .insert([divida])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar dívida:', error);
        return null;
      }

      console.log('✅ Dívida/financiamento criado com sucesso:', data);
      return data;
    } catch (err) {
      console.error('Erro ao criar dívida:', err);
      return null;
    }
  }

  static async update(id: string, divida: Partial<DividaFinanciamento>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dividas_financiamentos')
        .update(divida)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar dívida:', error);
        return false;
      }

      console.log('✅ Dívida/financiamento atualizado com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar dívida:', err);
      return false;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dividas_financiamentos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar dívida:', error);
        return false;
      }

      console.log('✅ Dívida/financiamento deletado com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao deletar dívida:', err);
      return false;
    }
  }

  static async liquidar(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dividas_financiamentos')
        .update({ situacao: 'Liquidada' })
        .eq('id', id);

      if (error) {
        console.error('Erro ao liquidar dívida:', error);
        return false;
      }

      console.log('✅ Dívida/financiamento liquidado com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao liquidar dívida:', err);
      return false;
    }
  }

  static async renegociar(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dividas_financiamentos')
        .update({ situacao: 'Renegociada' })
        .eq('id', id);

      if (error) {
        console.error('Erro ao renegociar dívida:', error);
        return false;
      }

      console.log('✅ Dívida/financiamento renegociado com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao renegociar dívida:', err);
      return false;
    }
  }

  static async getBySituacao(userId: string, situacao: 'Ativa' | 'Liquidada' | 'Renegociada'): Promise<DividaFinanciamento[]> {
    try {
      const { data, error } = await supabase
        .from('dividas_financiamentos')
        .select('*')
        .eq('user_id', userId)
        .eq('situacao', situacao)
        .order('data_contratacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dívidas por situação:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Erro ao buscar dívidas por situação:', err);
      return [];
    }
  }

  static async getByTipo(userId: string, tipo: string): Promise<DividaFinanciamento[]> {
    try {
      const { data, error } = await supabase
        .from('dividas_financiamentos')
        .select('*')
        .eq('user_id', userId)
        .eq('tipo', tipo)
        .order('data_contratacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dívidas por tipo:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Erro ao buscar dívidas por tipo:', err);
      return [];
    }
  }

  static async getTotalPorSituacao(userId: string): Promise<{ ativa: number; liquidada: number; renegociada: number }> {
    try {
      const dividas = await this.getAll(userId);

      const totais = {
        ativa: 0,
        liquidada: 0,
        renegociada: 0,
      };

      dividas.forEach((divida) => {
        if (divida.situacao === 'Ativa') {
          totais.ativa += divida.valor_contratado;
        } else if (divida.situacao === 'Liquidada') {
          totais.liquidada += divida.valor_contratado;
        } else if (divida.situacao === 'Renegociada') {
          totais.renegociada += divida.valor_contratado;
        }
      });

      return totais;
    } catch (err) {
      console.error('Erro ao calcular totais:', err);
      return { ativa: 0, liquidada: 0, renegociada: 0 };
    }
  }
}
