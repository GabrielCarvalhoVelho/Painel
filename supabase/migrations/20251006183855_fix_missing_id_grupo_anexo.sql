/*
  # Fix Missing id_grupo_anexo Values

  ## Problem
  Some transactions are missing the id_grupo_anexo field which is critical for the
  attachment system to work correctly. This causes download failures because the
  system cannot determine which file to retrieve from storage.

  ## Solution
  Update all transactions to have a proper id_grupo_anexo:
  - For transactions with a parent (installments): use the parent's ID
  - For individual transactions: use their own ID

  ## Changes
  1. Set id_grupo_anexo for all transactions missing this value
  2. Verify the update was successful with a count query
*/

-- Update transactions that have a parent but missing id_grupo_anexo
UPDATE transacoes_financeiras
SET id_grupo_anexo = id_transacao_pai
WHERE id_grupo_anexo IS NULL 
  AND id_transacao_pai IS NOT NULL;

-- Update individual transactions (no parent) missing id_grupo_anexo
UPDATE transacoes_financeiras
SET id_grupo_anexo = id_transacao
WHERE id_grupo_anexo IS NULL 
  AND id_transacao_pai IS NULL;

-- Verify: Count transactions still missing id_grupo_anexo (should be 0)
DO $$
DECLARE
  missing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO missing_count
  FROM transacoes_financeiras
  WHERE id_grupo_anexo IS NULL AND ativo = true;
  
  IF missing_count > 0 THEN
    RAISE WARNING 'Still have % transactions with missing id_grupo_anexo', missing_count;
  ELSE
    RAISE NOTICE 'All active transactions now have id_grupo_anexo populated';
  END IF;
END $$;
