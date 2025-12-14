# Copilot Instructions — Painel Solos.ag

## Contexto
Painel de gestão agrícola para cafeicultores. **React 18 + TypeScript + Vite + TailwindCSS + Supabase**.

## Arquitetura — LEIA PRIMEIRO

```
App.tsx → <DomínioPanel> → services/*Service.ts → supabase (src/lib/supabase.ts)
         ↓ renderContent()    ↓ classes estáticas       ↓ singleton client
      switch(activeTab)    métodos async            RLS bypass em DEV
```

### Regras Fundamentais
1. **NUNCA acesse Supabase diretamente em componentes** — sempre via Services
2. **Serviços são classes com métodos estáticos** — ex: `FinanceService.getTransacoes(userId)`
3. **AuthService é singleton** — use `AuthService.getInstance().getCurrentUser()`
4. **Token JWT** armazenado em `localStorage` como `ze_safra_token`
5. **DEV bypass** automático (não precisa de token em localhost)

### Services Existentes
| Service | Responsabilidade |
|---------|-----------------|
| `authService` | Autenticação, singleton, JWT decode |
| `financeService` | Transações financeiras, resumos, filtros por período |
| `estoqueService` | Produtos, movimentações FIFO, conversão de unidades |
| `activityService` | Lançamentos agrícolas (pulverização, adubação, etc.) |
| `talhaoService` | Talhões e áreas da fazenda |
| `propriedadeService` | Propriedades rurais |
| `maquinaService` | Máquinas e equipamentos |
| `custoService` / `custoPorTalhaoService` | Análise de custos por safra/talhão |
| `cotacaoService` | Cotação diária do café |
| `weatherService` | Dados meteorológicos |

## Criar Novo Módulo — Checklist

```bash
# 1. Componente (pasta própria)
src/components/NovoModulo/NovoModuloPanel.tsx

# 2. Service (camelCase)
src/services/novoModuloService.ts

# 3. Menu (adicionar em menuItems array)
src/components/Layout/Sidebar.tsx

# 4. Rota (adicionar case no switch)
src/App.tsx → renderContent()

# 5. Import do Panel no App.tsx (topo do arquivo)
```

### Template Service
```typescript
import { supabase } from '../lib/supabase';

export class NovoModuloService {
  static async listar(userId: string) {
    const { data, error } = await supabase
      .from('tabela')
      .select('*')
      .eq('user_id', userId);
    if (error) { console.error('Erro:', error); return []; }
    return data || [];
  }
}
```

### Template Panel
```tsx
import { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import LoadingSpinner from '../Dashboard/LoadingSpinner';

export default function NovoModuloPanel() {
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const user = AuthService.getInstance().getCurrentUser();
      if (!user) return;
      // const items = await NovoModuloService.listar(user.user_id);
      // setDados(items);
      setLoading(false);
    };
    carregar();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Título</h2>
    </div>
  );
}
```

## Libs Obrigatórias — Use Estas

| Necessidade | Lib | Import |
|-------------|-----|--------|
| Ícones | lucide-react | `import { Home } from 'lucide-react'` |
| Datas | date-fns + ptBR | `import { format } from 'date-fns'` |
| Formatação data BR | dateUtils | `import { formatDateBR, parseDateFromDB } from '../../lib/dateUtils'` |
| Moeda R$ | currencyFormatter | `import { formatCurrency, formatSmartCurrency } from '../../lib/currencyFormatter'` |
| Conversão unidades | unitConverter | `import { convertToStandardUnit, convertBetweenUnits } from '../../lib/unitConverter'` |
| Gráficos | recharts | `import { LineChart, BarChart } from 'recharts'` |
| DatePicker | react-datepicker | `import DatePicker from 'react-datepicker'` |

## Cores Solos.ag — Copie e Cole

```tsx
// Sidebar/Header
bg-[#004417]     // verde escuro principal
text-[#00A651]   // verde accent (ícones ativos)
bg-[#003015]     // item ativo no menu

// Cards
bg-white rounded-xl shadow-sm border border-gray-200 p-6

// Títulos
text-xl font-bold text-gray-900   // ou text-[#092f20]

// Botão primário
bg-[#00A651] hover:bg-[#008c44] text-white px-4 py-2 rounded-lg

// Botão secundário
border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg

// Gradient (logo/avatar)
bg-gradient-to-br from-[#86b646] to-[#397738]
```

## Banco de Dados — Tabelas Principais

| Tabela | Descrição | user_id? |
|--------|-----------|----------|
| `transacoes_financeiras` | Fluxo de caixa | ✅ |
| `lancamentos_agricolas` | Atividades agrícolas (header) | ✅ |
| `lancamento_produtos` | Produtos usados nas atividades | — |
| `lancamento_talhoes` | Talhões vinculados | — |
| `estoque_de_produtos` | Inventário de insumos | ✅ |
| `talhoes` | Áreas/parcelas da fazenda | — |
| `propriedades` | Fazendas | — |
| `vinculo_usuario_propriedade` | Relação user ↔ propriedade | ✅ |
| `cotacao_diaria_cafe` | Preços do café por município | — |

**Migrations**: `supabase/migrations/`

## Comandos

```bash
npm run dev      # Dev server :5173
npm run build    # Build prod
npm run lint     # ESLint
npm run preview  # Preview build
```

## Padrões de Código

- **Componentes**: PascalCase, funcionais, hooks
- **Services**: camelCase, classe com métodos estáticos
- **Tipagem**: interfaces em `src/lib/supabase.ts` ou no próprio service
- **Erros**: `console.error()` + retornar array vazio ou null (não lançar)
- **Loading**: sempre ter estado `loading` com `<LoadingSpinner />`
- **Navegação**: baseada em `activeTab` state, não React Router

## ⚠️ Armadilhas Comuns

1. **Datas**: use `parseDateFromDB()` de `dateUtils.ts` — evita bug de timezone UTC-3
2. **User ID**: sempre pegar de `AuthService.getInstance().getCurrentUser()?.user_id`
3. **Queries Supabase**: sempre tratar `error` e retornar `[]` se falhar
4. **RLS**: em DEV usa service_role (bypass), em PROD aplica RLS via JWT
5. **Valores monetários pequenos**: use `formatSmartCurrency()` para valores < R$ 0,01
6. **Unidades de medida**: estoque usa conversão FIFO — verifique `unitConverter.ts`

