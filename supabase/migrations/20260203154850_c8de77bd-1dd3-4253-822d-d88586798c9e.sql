-- Adiciona colunas para rastrear ligações no deal
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS calls_answered integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS calls_missed integer DEFAULT 0;