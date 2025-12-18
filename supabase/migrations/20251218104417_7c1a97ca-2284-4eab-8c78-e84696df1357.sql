-- Fix generate_slug function to use extensions schema for gen_random_bytes
CREATE OR REPLACE FUNCTION public.generate_slug(name text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(encode(extensions.gen_random_bytes(4), 'hex'), 1, 8);
END;
$$;