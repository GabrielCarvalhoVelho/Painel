/*
  # Add Missing RLS Policies

  1. Changes
    - Add RLS policies for `documentos` table
    - Disable RLS for analytics/admin tables that don't have user ownership

  2. Security
    - documentos table: users can only access their own documents
    - Analytics tables: disabled RLS as they contain aggregated data
*/

-- Add policies for documentos table (has user_id)
CREATE POLICY "Users can view own documents" ON public.documentos
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own documents" ON public.documentos
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own documents" ON public.documentos
  FOR UPDATE TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own documents" ON public.documentos
  FOR DELETE TO authenticated
  USING (user_id = (select auth.uid()));

-- Disable RLS for analytics/admin tables (no user ownership concept)
ALTER TABLE public.controle_envio DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacoes_por_usuario DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_meio_dia DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.painel_interno DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quantidade_propriedades_por_tamanho DISABLE ROW LEVEL SECURITY;
