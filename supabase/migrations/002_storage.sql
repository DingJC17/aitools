insert into storage.buckets (id, name, public)
values ('trial-uploads', 'trial-uploads', false)
on conflict (id) do nothing;

-- Uploaded trial files stay private. Access should go only through service-role operations.
create policy "service role manages trial uploads"
on storage.objects
for all
using (bucket_id = 'trial-uploads' and auth.role() = 'service_role')
with check (bucket_id = 'trial-uploads' and auth.role() = 'service_role');
