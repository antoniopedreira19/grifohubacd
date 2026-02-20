
-- Add event-specific columns to products table
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS is_event boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS event_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS event_modality text,
  ADD COLUMN IF NOT EXISTS event_location text;

-- Mark the two existing GrifoTalks as events
UPDATE public.products 
SET is_event = true 
WHERE id IN ('6ef525cb-5159-4a2e-b15a-26f2f2d4bff3', 'a003647e-c047-4e52-90f7-2f5abefd5e81');
