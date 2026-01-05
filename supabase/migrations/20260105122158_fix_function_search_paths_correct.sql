/*
  # Fix Function Search Paths for Security

  1. Changes
    - Set explicit search_path for all functions to prevent search_path injection
    - Use "pg_catalog, public" as the safe default

  2. Security
    - Prevents malicious schema manipulation attacks
    - Ensures functions always use intended schema
*/

-- Set search_path for trigger functions (no parameters)
ALTER FUNCTION public.fn_sync_horimetro_maquinas() SET search_path = pg_catalog, public;
ALTER FUNCTION public.processar_entrada_estoque(bigint, numeric, numeric) SET search_path = pg_catalog, public;
ALTER FUNCTION public.processar_saida_estoque(bigint, bigint, numeric) SET search_path = pg_catalog, public;
ALTER FUNCTION public.atualizar_valor_medio_before() SET search_path = pg_catalog, public;
ALTER FUNCTION public.update_dividas_financiamentos_updated_at() SET search_path = pg_catalog, public;
ALTER FUNCTION public.fn_sync_estoque_lanc_prod() SET search_path = pg_catalog, public;
ALTER FUNCTION public.set_updated_at() SET search_path = pg_catalog, public;
ALTER FUNCTION public.fn_normaliza_quantidade_base(numeric, text) SET search_path = pg_catalog, public;
ALTER FUNCTION public.atualizar_valor_medio_after() SET search_path = pg_catalog, public;
ALTER FUNCTION public.atualizar_valor_medio() SET search_path = pg_catalog, public;
ALTER FUNCTION public.trg_processar_movimentacao() SET search_path = pg_catalog, public;

-- Set search_path for utility functions with parameters
ALTER FUNCTION public.converter_de_unidade_base(numeric, text, text) SET search_path = pg_catalog, public;
ALTER FUNCTION public.converter_quantidade(numeric, text, text) SET search_path = pg_catalog, public;
ALTER FUNCTION public.converter_para_unidade_base(numeric, text) SET search_path = pg_catalog, public;
ALTER FUNCTION public.calcular_valor_medio() SET search_path = pg_catalog, public;
ALTER FUNCTION public.calcular_valor_medio(bigint) SET search_path = pg_catalog, public;
ALTER FUNCTION public.converter_de_unidade_padrao(numeric, text, text) SET search_path = pg_catalog, public;
ALTER FUNCTION public.normalizar_unidade(text) SET search_path = pg_catalog, public;
ALTER FUNCTION public.padronizar_unidade(text) SET search_path = pg_catalog, public;
