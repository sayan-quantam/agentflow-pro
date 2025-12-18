-- Fix generate_slug function search path
CREATE OR REPLACE FUNCTION public.generate_slug(name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(encode(gen_random_bytes(4), 'hex'), 1, 8);
END;
$$;