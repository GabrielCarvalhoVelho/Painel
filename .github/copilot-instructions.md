# Copilot Instructions for Painel

## Visão Geral da Arquitetura
- Projeto React + TypeScript, usando Vite para build e TailwindCSS para estilos.
- Estrutura modular: cada domínio possui um painel em `src/components/<Domínio>/<Painel>.tsx`.
- Serviços de dados e integrações externas ficam em `src/services/` e `src/lib/`.
- Integração principal com Supabase para autenticação e persistência de dados (`src/lib/supabase.ts`).

## Fluxos de Desenvolvimento
- **Build/Dev:**
  - `npm install` para dependências.
  - `npm run dev` para ambiente de desenvolvimento (Vite).
  - `npm run build` para build de produção.
- **Testes:**
  - Não há testes automatizados detectados. Se implementar, siga padrões do React Testing Library.
- **Debug:**
  - Use o Vite Dev Server para hot reload e debugging.

## Convenções e Padrões
- Componentes React funcionais, organizados por domínio.
- Serviços de acesso a dados (ex: `activityService.ts`, `userService.ts`) centralizam chamadas à API/Supabase.
- Evite lógica de negócio nos componentes; utilize serviços.
- Estilização via Tailwind classes diretamente nos componentes.
- Nomes de arquivos e pastas em PascalCase para componentes, camelCase para serviços.
- Novos domínios devem seguir o padrão de painel + serviço.

## Integrações e Dependências
- **Supabase:** configuração em `src/lib/supabase.ts`.
- **TailwindCSS:** configuração em `tailwind.config.js` e `postcss.config.js`.
- **Vite:** configuração em `vite.config.ts`.
- **TypeScript:** configs em `tsconfig*.json`.

## Exemplos de Padrão
- Novo painel: crie `src/components/NovoDominio/NovoDominioPanel.tsx` e, se necessário, um serviço em `src/services/novoDominioService.ts`.
- Para acessar dados: use funções do serviço correspondente, não acesse Supabase direto no componente.

## Outras Observações
- Documentação de schema de banco em `docs/database-schema.md`.
- Assets públicos em `public/`.
- Siga a estrutura modular para facilitar manutenção e escalabilidade.

---

Seções pouco claras ou incompletas? Peça feedback para aprimorar as instruções.
