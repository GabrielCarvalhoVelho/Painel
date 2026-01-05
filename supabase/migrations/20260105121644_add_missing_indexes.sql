/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvements
    - Add indexes for foreign keys in `documentos` table
    - Add indexes for foreign keys in `pragas_e_doencas_talhoes` table

  2. Notes
    - These indexes improve JOIN performance
    - Prevent table scans on foreign key lookups
*/

-- Add missing indexes for documentos table
CREATE INDEX IF NOT EXISTS idx_documentos_propriedade_id ON public.documentos(propriedade_id);
CREATE INDEX IF NOT EXISTS idx_documentos_user_id ON public.documentos(user_id);

-- Add missing indexes for pragas_e_doencas_talhoes table
CREATE INDEX IF NOT EXISTS idx_pragas_e_doencas_talhoes_praga_doenca_id ON public.pragas_e_doencas_talhoes(praga_doenca_id);
CREATE INDEX IF NOT EXISTS idx_pragas_e_doencas_talhoes_talhao_id ON public.pragas_e_doencas_talhoes(talhao_id);
CREATE INDEX IF NOT EXISTS idx_pragas_e_doencas_talhoes_user_id ON public.pragas_e_doencas_talhoes(user_id);
