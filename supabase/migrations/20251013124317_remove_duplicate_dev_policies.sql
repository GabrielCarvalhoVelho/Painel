/*
  # Remove Duplicate Development Policies
  
  1. Policy Cleanup
    - Remove dev_* test policies from estoque_de_produtos
    - These are duplicates causing multiple permissive policies warnings
  
  2. Policies Removed
    - dev_select_for_test_user
    - dev_insert_for_test_user
    - dev_update_for_test_user
    - dev_delete_for_test_user
*/

-- Drop duplicate development/test policies
DROP POLICY IF EXISTS "dev_select_for_test_user" ON public.estoque_de_produtos;
DROP POLICY IF EXISTS "dev_insert_for_test_user" ON public.estoque_de_produtos;
DROP POLICY IF EXISTS "dev_update_for_test_user" ON public.estoque_de_produtos;
DROP POLICY IF EXISTS "dev_delete_for_test_user" ON public.estoque_de_produtos;