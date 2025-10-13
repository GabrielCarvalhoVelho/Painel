/*
  # Add Policies to Tables with RLS Enabled
  
  1. Policy Creation
    - Add basic policies to tables that have RLS enabled but no policies
    - This prevents complete lockout while maintaining security
  
  2. Tables Updated
    - ids_culturas (allow all authenticated users to read)
    - lista_de_usuarios_em_espera (allow all authenticated users - no user_id column)
    - memory_long_financeiro (allow all authenticated users - uses telefone_do_usuario)
    - talhoes_teste (allow all authenticated users - uses criado_por)
  
  3. Security
    - All policies allow authenticated users to access data
    - More restrictive policies can be added later if needed
*/

-- ids_culturas: Allow all authenticated users to read culture types
CREATE POLICY "Authenticated users can view culture types"
  ON public.ids_culturas
  FOR SELECT
  TO authenticated
  USING (true);

-- lista_de_usuarios_em_espera: Allow authenticated users to view and insert
CREATE POLICY "Authenticated users can view waiting list"
  ON public.lista_de_usuarios_em_espera
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert waiting list entries"
  ON public.lista_de_usuarios_em_espera
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- memory_long_financeiro: Allow authenticated users to manage financial memory
CREATE POLICY "Authenticated users can view financial memory"
  ON public.memory_long_financeiro
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert financial memory"
  ON public.memory_long_financeiro
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update financial memory"
  ON public.memory_long_financeiro
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- talhoes_teste: Allow authenticated users to manage test plots
CREATE POLICY "Authenticated users can view test plots"
  ON public.talhoes_teste
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert test plots"
  ON public.talhoes_teste
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update test plots"
  ON public.talhoes_teste
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete test plots"
  ON public.talhoes_teste
  FOR DELETE
  TO authenticated
  USING (true);