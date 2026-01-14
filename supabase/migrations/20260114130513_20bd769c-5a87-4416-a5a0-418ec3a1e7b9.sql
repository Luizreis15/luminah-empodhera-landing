-- =============================================
-- ÁREA FINANCEIRA EMPODHERA - FASE 1B: TABELAS
-- =============================================

-- 1. CRIAR NOVOS ENUMS PARA O SISTEMA FINANCEIRO

-- Tipo de transação
CREATE TYPE transaction_type AS ENUM ('receita', 'despesa');

-- Métodos de pagamento
CREATE TYPE payment_method AS ENUM ('pix', 'credito', 'debito', 'transferencia', 'boleto');

-- Origem da venda/transação
CREATE TYPE transaction_source AS ENUM (
  'organico', 
  'indicacao', 
  'criadora_samira', 
  'criadora_simone', 
  'criadora_sueli', 
  'trafego_pago'
);

-- Status da transação
CREATE TYPE transaction_status AS ENUM ('previsto', 'recebido', 'pago', 'cancelado');

-- Plataforma de venda
CREATE TYPE sale_platform AS ENUM ('site', 'whatsapp', 'instagram', 'sympla', 'indicacao');

-- Planos de patrocínio
CREATE TYPE sponsor_plan AS ENUM ('bronze', 'prata', 'ouro', 'diamante');

-- 2. TABELA CATEGORIES (Categorias financeiras)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type transaction_type NOT NULL,
  color TEXT DEFAULT '#A67C52',
  icon TEXT DEFAULT 'circle',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABELA TRANSACTIONS (Transações financeiras)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type transaction_type NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  subcategory TEXT,
  description TEXT,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  payment_method payment_method,
  source transaction_source,
  status transaction_status NOT NULL DEFAULT 'previsto',
  is_recurring BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABELA SALES (Vendas de ingressos)
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  amount DECIMAL(12,2) NOT NULL,
  source transaction_source NOT NULL,
  creator transaction_source,
  platform sale_platform NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  transaction_id UUID REFERENCES public.transactions(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABELA SPONSORS (Patrocinadores)
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  plan sponsor_plan NOT NULL,
  contracted_value DECIMAL(12,2) NOT NULL,
  payment_status transaction_status NOT NULL DEFAULT 'previsto',
  benefits_delivered JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TRIGGERS PARA UPDATED_AT
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workbook_responses_updated_at();

CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workbook_responses_updated_at();

-- 7. HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES PARA CATEGORIES
CREATE POLICY "Admin can manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Financeiro can view categories"
  ON public.categories FOR SELECT
  USING (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Viewer can view categories"
  ON public.categories FOR SELECT
  USING (public.has_role(auth.uid(), 'viewer'));

-- 9. RLS POLICIES PARA TRANSACTIONS
CREATE POLICY "Admin can manage all transactions"
  ON public.transactions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Financeiro can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Financeiro can update transactions"
  ON public.transactions FOR UPDATE
  USING (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Financeiro can view transactions"
  ON public.transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Viewer can view transactions"
  ON public.transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'viewer'));

-- 10. RLS POLICIES PARA SALES
CREATE POLICY "Admin can manage all sales"
  ON public.sales FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Financeiro can insert sales"
  ON public.sales FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Financeiro can update sales"
  ON public.sales FOR UPDATE
  USING (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Financeiro can view sales"
  ON public.sales FOR SELECT
  USING (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Viewer can view sales"
  ON public.sales FOR SELECT
  USING (public.has_role(auth.uid(), 'viewer'));

-- 11. RLS POLICIES PARA SPONSORS
CREATE POLICY "Admin can manage all sponsors"
  ON public.sponsors FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Financeiro can insert sponsors"
  ON public.sponsors FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Financeiro can update sponsors"
  ON public.sponsors FOR UPDATE
  USING (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Financeiro can view sponsors"
  ON public.sponsors FOR SELECT
  USING (public.has_role(auth.uid(), 'financeiro'));

CREATE POLICY "Viewer can view sponsors"
  ON public.sponsors FOR SELECT
  USING (public.has_role(auth.uid(), 'viewer'));

-- 12. INSERIR CATEGORIAS PADRÃO
INSERT INTO public.categories (name, type, color, icon) VALUES
  ('Ingresso', 'receita', '#22C55E', 'ticket'),
  ('Patrocínio', 'receita', '#3B82F6', 'building'),
  ('Upsell', 'receita', '#8B5CF6', 'plus-circle'),
  ('Outro (Receita)', 'receita', '#A67C52', 'circle'),
  ('Espaço', 'despesa', '#EF4444', 'home'),
  ('Alimentação', 'despesa', '#F97316', 'utensils'),
  ('Marketing', 'despesa', '#EC4899', 'megaphone'),
  ('Plataforma', 'despesa', '#6366F1', 'credit-card'),
  ('Brindes', 'despesa', '#14B8A6', 'gift'),
  ('Equipamentos', 'despesa', '#64748B', 'settings'),
  ('Outro (Despesa)', 'despesa', '#78716C', 'circle');