/*
  # Adicionar campo para URL de arquivos em transações financeiras

  1. Alterações
    - Adiciona campo `anexo_arquivo_url` na tabela `transacoes_financeiras`
    - Campo do tipo text, nullable, para armazenar URL de arquivos (PDF, XML, etc.)
    - Similar ao campo `anexo_compartilhado_url` que armazena URLs de imagens
    
  2. Comportamento
    - Campo será usado para armazenar URLs de arquivos anexados às transações
    - Funciona em conjunto com o sistema de grupos de anexo existente
    - Para transações parceladas, a URL será compartilhada entre todas as parcelas
*/

-- Adicionar campo para URL de arquivo se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transacoes_financeiras' 
    AND column_name = 'anexo_arquivo_url'
  ) THEN
    ALTER TABLE transacoes_financeiras 
    ADD COLUMN anexo_arquivo_url text;
    
    COMMENT ON COLUMN transacoes_financeiras.anexo_arquivo_url IS 'URL do arquivo anexado (PDF, XML, etc.) no Supabase Storage';
  END IF;
END $$;