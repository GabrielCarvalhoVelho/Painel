/*
  # Fix Security Issues - Indexes and Foreign Keys
  
  1. Indexes
    - Add missing indexes for foreign key columns
    - Drop unused indexes
    - Drop duplicate unique constraints (keeping primary keys)
  
  2. Changes
    - Add index on maquinas_equipamentos.user_id (foreign key)
    - Add index on vinculo_usuario_propriedade.user_id (foreign key)
    - Drop unused indexes: idx_atividades_id_talhoes, mov_prod_created_idx, mov_user_idx
    - Drop duplicate constraints: ids_culturas_id_key, movimentacoes_estoque_id_key, usuarios_user_id_key
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_maquinas_equipamentos_user_id 
  ON public.maquinas_equipamentos(user_id);

CREATE INDEX IF NOT EXISTS idx_vinculo_usuario_propriedade_user_id 
  ON public.vinculo_usuario_propriedade(user_id);

-- Drop unused indexes
DROP INDEX IF EXISTS public.idx_atividades_id_talhoes;
DROP INDEX IF EXISTS public.mov_prod_created_idx;
DROP INDEX IF EXISTS public.mov_user_idx;

-- Drop duplicate constraints (keep primary keys, drop redundant unique constraints)
ALTER TABLE public.ids_culturas DROP CONSTRAINT IF EXISTS ids_culturas_id_key;
ALTER TABLE public.movimentacoes_estoque DROP CONSTRAINT IF EXISTS movimentacoes_estoque_id_key;
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_user_id_key;