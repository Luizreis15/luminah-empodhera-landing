-- Adicionar campos de controle de marketing na waiting_list
ALTER TABLE public.waiting_list 
ADD COLUMN IF NOT EXISTS subscribed_to_marketing boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS unsubscribed_at timestamp with time zone;