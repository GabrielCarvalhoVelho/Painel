/*
  # Drop Duplicate Indexes Safely

  1. Changes
    - Remove duplicate indexes to improve write performance
    - Skip constraint indexes that cannot be dropped
    - Keep the older index in each pair for stability

  2. Performance Benefits
    - Reduces storage overhead
    - Improves INSERT/UPDATE performance
    - Simplifies query planning
*/

-- Drop duplicate indexes on atividades_agricolas (keep idx_atividades_agricolas_user_id)
DROP INDEX IF EXISTS public.idx_atividades_user_id;

-- Drop duplicate indexes on lancamento_maquinas (keep idx_lmaq_ativ)
DROP INDEX IF EXISTS public.idx_lanc_maq_atividade;

-- Drop duplicate indexes on lancamento_produtos (keep idx_lprod_ativ)
DROP INDEX IF EXISTS public.idx_lanc_prod_atividade;

-- Drop duplicate indexes on lancamento_responsaveis (keep idx_lresp_ativ)
DROP INDEX IF EXISTS public.idx_lanc_resp_atividade;

-- Drop duplicate indexes on lancamento_talhoes (keep idx_ltalhoes_talhao)
-- Skip lanc_talhoes_atividade_talhao_key as it's a constraint
DROP INDEX IF EXISTS public.idx_lanc_talhoes_talhao;

-- Drop duplicate indexes on maquinas_equipamentos (keep idx_maquinas_equipamentos_user_id)
DROP INDEX IF EXISTS public.idx_maq_user;

-- Drop duplicate indexes on transacoes_financeiras (keep newer indexes)
DROP INDEX IF EXISTS public.idx_data_transacao;
DROP INDEX IF EXISTS public.idx_tipo_transacao;
DROP INDEX IF EXISTS public.idx_user_id;

-- Drop duplicate indexes on vinculo_usuario_propriedade (keep idx_vinculo_usuario_propriedade_user_id)
DROP INDEX IF EXISTS public.idx_vinc_user;
