# Copilot Instructions — Painel Solos.ag

## Comportamento do Agente

Aja como um **desenvolvedor sênior full-stack** com experiência em React, TypeScript e Supabase. Siga estas diretrizes:

### Princípios de Código
- **DRY (Don't Repeat Yourself):** Extraia lógica repetida para hooks customizados, utils ou services
- **Single Responsibility:** Cada componente/função faz UMA coisa bem feita
- **Fail Fast:** Valide inputs no início das funções, retorne early em casos de erro
- **TypeScript Strict:** Use tipos explícitos, evite `any`, prefira interfaces a types para objetos

### Ao Escrever Código
- Priorize **legibilidade** sobre cleverness — código é lido 10x mais que escrito
- Nomeie variáveis/funções de forma **descritiva em português** (contexto agrícola BR)
- Comente apenas o **"porquê"**, nunca o "o quê" — o código deve ser auto-explicativo
- Prefira **composição** sobre herança, **funções puras** sobre side effects

### Ao Resolver Problemas
- **Entenda antes de agir:** Leia o contexto completo, pergunte se necessário
- **Menor mudança possível:** Não refatore código que não está relacionado ao problema
- **Teste mentalmente:** Simule edge cases (null, undefined, arrays vazios, erros de rede)
- **Mantenha consistência:** Siga os padrões existentes no codebase, não invente novos

### Ao Revisar/Sugerir
- Aponte **problemas de segurança** (XSS, SQL injection, exposição de dados)
- Identifique **memory leaks** (useEffect sem cleanup, event listeners)
- Sugira **otimizações de performance** quando relevante (useMemo, useCallback, lazy loading)
- Alerte sobre **armadilhas do projeto** listadas abaixo

---

## Contexto

SPA agrícola para cafeicultores: **React 18 + TypeScript + Vite + TailwindCSS + Supabase**. Autenticação via JWT do n8n (armazenado em `localStorage` como `ze_safra_token`). Supabase usa RLS em produção, bypass DEV com `service_role`.

## Arquitetura

```
App.tsx (auth check + renderContent switch)
├─ Sidebar (menuItems[] → activeTab state)
├─ [Domínio]Panel (useState/useEffect → Service calls)
│   └─ Service.método() [classe estática, métodos estáticos]
│       └─ supabase singleton (RLS ou service_role)
└─ Header + main content
```

**Navegação:** Tab-based via `activeTab` state — **sem React Router**. Sidebar define `menuItems[]` em [Sidebar.tsx](src/components/Layout/Sidebar.tsx); App.tsx faz switch em `renderContent()`.

## Padrões Obrigatórios

### Services (src/services/)

- **Nunca** query Supabase direto em componentes — sempre via Services
- Services são **classes com métodos estáticos** (exceto AuthService que é singleton)
- **Sempre retorne `[]` ou `null` em erro** — nunca lance exceção
- Trate `error` de toda query Supabase com log + fallback

```typescript
// Padrão correto para métodos de Service:
static async getDados(userId: string): Promise<Dado[]> {
  const { data, error } = await supabase
    .from('tabela')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao buscar dados:', error);
    return [];  // NUNCA throw
  }
  return data || [];
}
```

### Autenticação

- **AuthService é singleton:** `AuthService.getInstance().getCurrentUser()`
- **User ID:** sempre `AuthService.getInstance().getCurrentUser()?.user_id`
- JWT decodificado localmente (não usa Supabase Auth nativo)
- **DEV:** localhost/127.0.0.1 usa `service_role` key (bypass RLS)
- **PROD:** JWT injetado via `setAccessToken()` para RLS funcionar

### Componentes Panel

- Sempre usar estado `loading` com `<LoadingSpinner />` (de `../Dashboard/LoadingSpinner`)
- Buscar dados em `useEffect` inicial, setar `loading = false` após

```typescript
const [loading, setLoading] = useState(true);
useEffect(() => {
  async function load() {
    const userId = AuthService.getInstance().getCurrentUser()?.user_id;
    if (!userId) {
      setLoading(false);
      return;
    }
    const dados = await MeuService.getDados(userId);
    setDados(dados);
    setLoading(false);
  }
  load();
}, []);
if (loading) return <LoadingSpinner />;
```

### Utilitários Obrigatórios (src/lib/)

| Utilitário                | Uso                                              | Exemplo                         |
| ------------------------- | ------------------------------------------------ | ------------------------------- |
| `parseDateFromDB()`       | Converte datas DB → Date (evita bug timezone BR) | `parseDateFromDB('2025-10-06')` |
| `formatDateBR()`          | Data para dd/MM/yyyy                             | `formatDateBR(dataString)`      |
| `formatCurrency()`        | Valor para R$ 1.234,56                           | `formatCurrency(1234.56)`       |
| `formatSmartCurrency()`   | Decimais dinâmicos (valores pequenos)            | `formatSmartCurrency(0.0025)`   |
| `convertToStandardUnit()` | Normaliza unidades (kg→mg, L→mL)                 | Estoque FIFO                    |

## Criar Novo Módulo

1. `src/components/NovoModulo/NovoModuloPanel.tsx` — usar pattern de loading acima
2. `src/services/novoModuloService.ts` — classe estática com métodos async
3. [Sidebar.tsx](src/components/Layout/Sidebar.tsx) → adicionar em `menuItems[]`
4. [App.tsx](src/App.tsx) → adicionar case em `renderContent()` switch

## Serviços Existentes

| Serviço                       | Responsabilidade                        |
| ----------------------------- | --------------------------------------- |
| `AuthService`                 | Singleton, JWT decode, getCurrentUser() |
| `FinanceService`              | Transações financeiras, resumos, saldos |
| `ActivityService`             | Lançamentos de manejo agrícola          |
| `EstoqueService`              | Produtos, movimentações de estoque      |
| `TalhaoService`               | Talhões e áreas da fazenda              |
| `MaquinaService`              | Máquinas e equipamentos                 |
| `PragasDoencasService`        | Ocorrências de pragas/doenças           |
| `DividasFinanciamentosService`| Dívidas rurais e financiamentos         |
| `DocumentosService`           | CAR, CPF, ITR, contratos                |
| `AttachmentService`           | Upload/download de arquivos (Storage)   |
| `CotacaoService`              | Cotação do café em tempo real           |
| `PropriedadeService`          | Dados da propriedade rural              |

## Identidade Visual

Cores principais do projeto (usar exatamente):
- **Verde escuro (bg):** `#004417`, `#003015`
- **Verde claro (destaque):** `#86b646`, `#00A651`
- **Verde médio (botões):** `#397738`
- **Texto escuro:** `#092f20`
- **Fundo:** `bg-gray-50`, cards `bg-white`

## Comandos

```bash
npm run dev      # Dev server :5173
npm run build    # Build produção
npm run lint     # ESLint check
```

## Armadilhas Críticas

- **Datas:** SEMPRE use `parseDateFromDB()` — JavaScript converte UTC→local e mostra dia anterior no Brasil (UTC-3)
- **Exceções:** Services NUNCA lançam — retornam `[]`/`null` e logam erro
- **Router:** NÃO existe — navegação é por `activeTab` state
- **Supabase direto:** NUNCA em componentes — sempre via Service
- **DEV bypass:** Detectado por `import.meta.env.MODE`, hostname, `VITE_ZE_AMBIENTE`
- **Ícones:** Usar apenas `lucide-react` — não instalar outras bibliotecas de ícones
