CREATE POLICY "Trusted server code can manage admin leads"
ON public.admin_leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);