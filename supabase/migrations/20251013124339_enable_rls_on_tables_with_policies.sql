/*
  # Enable RLS on Tables with Policies
  
  1. RLS Activation
    - Enable RLS on tables that have policies but RLS is disabled
    - These tables already have policies defined but they are not being enforced
  
  2. Tables Updated
    - propriedades
    - transacoes_financeiras
    - usuarios
    - vinculo_usuario_propriedade
    - maquinas_equipamentos
    - talhoes
    - cotacao_diaria_cafe
    - atividades_recentes
    - quantidade_propriedades_por_tamanho
    - mensagens_meio_dia
    - controle_envio
    - interacoes_por_usuario
    - painel_interno
*/

-- Enable RLS on tables with existing policies
ALTER TABLE public.propriedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vinculo_usuario_propriedade ENABLE ROW LEVEL SECURITY;

-- Enable RLS on other public tables without RLS
ALTER TABLE public.maquinas_equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talhoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotacao_diaria_cafe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atividades_recentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quantidade_propriedades_por_tamanho ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_meio_dia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.controle_envio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacoes_por_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.painel_interno ENABLE ROW LEVEL SECURITY;