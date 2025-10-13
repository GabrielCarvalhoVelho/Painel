/*
  # Fix Function Search Paths for Security
  
  1. Security Enhancement
    - Set immutable search_path for all functions to prevent search_path hijacking
    - All functions will use explicit schema references (public, auth, etc.)
  
  2. Functions Updated
    - fn_verificar_area_talhao_before_insert
    - propagar_anexo_para_parcelas
    - limpar_anexo_ao_excluir
    - fn_atualizar_talhao_default
    - match_documents
  
  3. Security Note
    - Setting search_path prevents malicious users from creating similarly-named
      functions in other schemas to hijack function execution
*/

-- Set secure search_path for fn_verificar_area_talhao_before_insert
ALTER FUNCTION public.fn_verificar_area_talhao_before_insert() 
  SET search_path = public, pg_temp;

-- Set secure search_path for propagar_anexo_para_parcelas
ALTER FUNCTION public.propagar_anexo_para_parcelas() 
  SET search_path = public, pg_temp;

-- Set secure search_path for limpar_anexo_ao_excluir
ALTER FUNCTION public.limpar_anexo_ao_excluir() 
  SET search_path = public, pg_temp;

-- Set secure search_path for fn_atualizar_talhao_default
ALTER FUNCTION public.fn_atualizar_talhao_default() 
  SET search_path = public, pg_temp;

-- Set secure search_path for match_documents with correct signature
ALTER FUNCTION public.match_documents(vector, integer, jsonb)
  SET search_path = public, pg_temp;