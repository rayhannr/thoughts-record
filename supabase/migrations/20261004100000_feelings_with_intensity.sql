-- One situation can bring several feelings, each with its own intensity.
-- feelings becomes a jsonb array of {name, intensity}; the single intensity column goes.
alter table public.entries
  alter column feelings type jsonb
  using jsonb_build_array(jsonb_build_object('name', feelings, 'intensity', intensity));

alter table public.entries drop column intensity;

alter table public.entries
  add constraint entries_feelings_is_array
  check (jsonb_typeof(feelings) = 'array' and jsonb_array_length(feelings) >= 1);
