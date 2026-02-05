
-- sales: keep sales, just set deal_id to NULL
ALTER TABLE public.sales DROP CONSTRAINT IF EXISTS sales_deal_id_fkey;
ALTER TABLE public.sales ADD CONSTRAINT sales_deal_id_fkey 
  FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE SET NULL;

-- deal_comments: delete with the deal
ALTER TABLE public.deal_comments DROP CONSTRAINT IF EXISTS deal_comments_deal_id_fkey;
ALTER TABLE public.deal_comments ADD CONSTRAINT deal_comments_deal_id_fkey 
  FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE CASCADE;

-- deal_tag_assignments: delete with the deal
ALTER TABLE public.deal_tag_assignments DROP CONSTRAINT IF EXISTS deal_tag_assignments_deal_id_fkey;
ALTER TABLE public.deal_tag_assignments ADD CONSTRAINT deal_tag_assignments_deal_id_fkey 
  FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE CASCADE;

-- whatsapp_messages: keep messages, set deal_id to NULL
ALTER TABLE public.whatsapp_messages DROP CONSTRAINT IF EXISTS whatsapp_messages_deal_id_fkey;
ALTER TABLE public.whatsapp_messages ADD CONSTRAINT whatsapp_messages_deal_id_fkey 
  FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE SET NULL;

-- form_submissions: keep submissions, set deal references via lead_id (no deal FK, so no change needed)

-- deals itself references pipeline_stages, which may also block deletion of stages/pipelines
-- When deleting a pipeline's stages, deals should have stage_id set to NULL
ALTER TABLE public.deals DROP CONSTRAINT IF EXISTS deals_stage_id_fkey;
ALTER TABLE public.deals ADD CONSTRAINT deals_stage_id_fkey 
  FOREIGN KEY (stage_id) REFERENCES public.pipeline_stages(id) ON DELETE SET NULL;

-- When deleting a pipeline, deals should have pipeline_id set to NULL
ALTER TABLE public.deals DROP CONSTRAINT IF EXISTS deals_pipeline_id_fkey;
ALTER TABLE public.deals ADD CONSTRAINT deals_pipeline_id_fkey 
  FOREIGN KEY (pipeline_id) REFERENCES public.pipelines(id) ON DELETE SET NULL;

-- pipeline_stages: when deleting a pipeline, cascade delete its stages
ALTER TABLE public.pipeline_stages DROP CONSTRAINT IF EXISTS pipeline_stages_pipeline_id_fkey;
ALTER TABLE public.pipeline_stages ADD CONSTRAINT pipeline_stages_pipeline_id_fkey 
  FOREIGN KEY (pipeline_id) REFERENCES public.pipelines(id) ON DELETE CASCADE;
