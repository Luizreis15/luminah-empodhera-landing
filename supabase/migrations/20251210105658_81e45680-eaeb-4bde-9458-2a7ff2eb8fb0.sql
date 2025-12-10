-- Create waiting_list table
CREATE TABLE public.waiting_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waiting_list_email_unique UNIQUE (email)
);

-- Enable Row Level Security
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- Public can insert (anyone can join the waiting list)
CREATE POLICY "Anyone can join waiting list"
ON public.waiting_list
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view the waiting list
CREATE POLICY "Admins can view waiting list"
ON public.waiting_list
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete from waiting list
CREATE POLICY "Admins can delete from waiting list"
ON public.waiting_list
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));