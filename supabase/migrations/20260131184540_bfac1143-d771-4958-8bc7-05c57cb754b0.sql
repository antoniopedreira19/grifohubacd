-- Add owner_id column to deals table for deal responsible person
ALTER TABLE public.deals 
ADD COLUMN owner_id uuid REFERENCES public.team_members(id);

-- Create index for better performance
CREATE INDEX idx_deals_owner_id ON public.deals(owner_id);