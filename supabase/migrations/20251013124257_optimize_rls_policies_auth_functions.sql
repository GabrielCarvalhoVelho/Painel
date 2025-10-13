/*
  # Optimize RLS Policies - Auth Function Performance
  
  1. Performance Optimization
    - Replace auth.uid() with (select auth.uid()) in all RLS policies
    - This prevents re-evaluation of auth functions for each row
  
  2. Tables Updated
    - estoque_de_produtos (7 policies)
    - movimentacoes_estoque (2 policies)
*/

-- Drop and recreate estoque_de_produtos policies with optimized auth function calls
DROP POLICY IF EXISTS "Users can view own products" ON public.estoque_de_produtos;
DROP POLICY IF EXISTS "Users can insert own products" ON public.estoque_de_produtos;
DROP POLICY IF EXISTS "Users can update own products" ON public.estoque_de_produtos;
DROP POLICY IF EXISTS "Users can delete own products" ON public.estoque_de_produtos;

CREATE POLICY "Users can view own products"
  ON public.estoque_de_produtos
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own products"
  ON public.estoque_de_produtos
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own products"
  ON public.estoque_de_produtos
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own products"
  ON public.estoque_de_produtos
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate movimentacoes_estoque policies with optimized auth function calls
DROP POLICY IF EXISTS "select-own-moves" ON public.movimentacoes_estoque;
DROP POLICY IF EXISTS "insert-own-moves" ON public.movimentacoes_estoque;

CREATE POLICY "select-own-moves"
  ON public.movimentacoes_estoque
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "insert-own-moves"
  ON public.movimentacoes_estoque
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));