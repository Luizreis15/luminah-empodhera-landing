# Arquivos para o Novo Projeto: EMPODHERA Caderno de Atividades

## Instruções de Migração

### Passo 1: Criar Novo Projeto
1. Acesse [lovable.dev](https://lovable.dev) e crie um novo projeto
2. Nomeie como "EMPODHERA Caderno de Atividades"

### Passo 2: Configurar Backend (Lovable Cloud)
No novo projeto, peça para criar a tabela:

```sql
CREATE TABLE workbook_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_id INTEGER NOT NULL,
  activity_id TEXT NOT NULL,
  response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_id, activity_id)
);

ALTER TABLE workbook_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own responses" ON workbook_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses" ON workbook_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own responses" ON workbook_responses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own responses" ON workbook_responses
  FOR DELETE USING (auth.uid() = user_id);
```

### Passo 3: Copiar Arquivos
Copie os arquivos desta pasta para o novo projeto nas seguintes localizações:

- `pages/Index.tsx` → `src/pages/Index.tsx` (página de login)
- `pages/Dashboard.tsx` → `src/pages/Dashboard.tsx`
- `pages/Module.tsx` → `src/pages/Module.tsx`
- `hooks/useWorkbook.tsx` → `src/hooks/useWorkbook.tsx`
- `data/workbookModules.ts` → `src/data/workbookModules.ts`
- `components/workbook/*` → `src/components/workbook/*`
- `edge-functions/send-workbook-welcome/index.ts` → `supabase/functions/send-workbook-welcome/index.ts`

### Passo 4: Configurar App.tsx
Use este código para o App.tsx:

```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Module from "./pages/Module";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/modulo/:moduleId" element={<Module />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

### Passo 5: Configurar Secrets
Adicione o secret `RESEND_API_KEY` no novo projeto

### Passo 6: Configurar Domínio
1. Remova `atividades.empodhera.com` do projeto atual
2. Conecte `atividades.empodhera.com` ao novo projeto

### Passo 7: Habilitar Auto-Confirm
Configure auth para auto-confirmar emails
