-- Create page_visits table for visitor tracking
CREATE TABLE public.page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

-- Enable Row Level Security
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (visitor tracking)
CREATE POLICY "Anyone can insert page visits" 
ON public.page_visits 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read page visits" 
ON public.page_visits 
FOR SELECT 
USING (true);

-- Create index for performance
CREATE INDEX idx_page_visits_created_at ON public.page_visits(created_at DESC);
CREATE INDEX idx_page_visits_page_path ON public.page_visits(page_path);
CREATE INDEX idx_page_visits_session_id ON public.page_visits(session_id);