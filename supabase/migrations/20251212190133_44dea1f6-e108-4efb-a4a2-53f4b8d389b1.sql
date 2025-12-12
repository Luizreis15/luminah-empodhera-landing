-- Tabela para respostas do caderno de atividades
CREATE TABLE public.workbook_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id integer NOT NULL CHECK (module_id BETWEEN 1 AND 4),
  activity_id text NOT NULL,
  response jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id, activity_id)
);

-- Enable RLS
ALTER TABLE public.workbook_responses ENABLE ROW LEVEL SECURITY;

-- Usuário só pode ver suas próprias respostas
CREATE POLICY "Users can view own responses" 
ON public.workbook_responses 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Usuário pode inserir suas próprias respostas
CREATE POLICY "Users can insert own responses" 
ON public.workbook_responses 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuário pode atualizar suas próprias respostas
CREATE POLICY "Users can update own responses" 
ON public.workbook_responses 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Usuário pode deletar suas próprias respostas
CREATE POLICY "Users can delete own responses" 
ON public.workbook_responses 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Admins podem ver todas as respostas (para analytics)
CREATE POLICY "Admins can view all responses" 
ON public.workbook_responses 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_workbook_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_workbook_responses_timestamp
BEFORE UPDATE ON public.workbook_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_workbook_responses_updated_at();