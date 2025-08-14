-- Enable public read access to AI_Glossar table
CREATE POLICY "Allow public read access to AI_Glossar" 
ON public."AI_Glossar" 
FOR SELECT 
USING (true);

-- Also ensure the table is properly accessible via the API
GRANT SELECT ON public."AI_Glossar" TO anon;
GRANT SELECT ON public."AI_Glossar" TO authenticated;