-- Keepalive heartbeat table and RPC
-- Intended for server-side schedulers such as GitHub Actions

CREATE TABLE IF NOT EXISTS public.project_heartbeat (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source TEXT NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_heartbeat_checked_at
  ON public.project_heartbeat (checked_at DESC);

CREATE OR REPLACE FUNCTION public.record_project_heartbeat(p_source TEXT DEFAULT 'github-actions')
RETURNS public.project_heartbeat
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted_row public.project_heartbeat;
BEGIN
  INSERT INTO public.project_heartbeat (source)
  VALUES (COALESCE(NULLIF(TRIM(p_source), ''), 'github-actions'))
  RETURNING * INTO inserted_row;

  RETURN inserted_row;
END;
$$;

REVOKE ALL ON TABLE public.project_heartbeat FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_project_heartbeat(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_project_heartbeat(TEXT) TO service_role;
