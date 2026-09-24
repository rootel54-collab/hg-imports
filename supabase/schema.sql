-- Rode no Supabase: SQL Editor > New query > Run
create table categories(id serial primary key,name text not null,slug text unique not null,image_url text,position int default 0);
create table products(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,description text,price numeric(10,2) not null,sale_price numeric(10,2),sale_start timestamptz,sale_end timestamptz,category_id int references categories on delete set null,gender text default 'unissex',tags text[] default '{}',is_new bool default false,is_bestseller bool default false,is_featured bool default false,active bool default true,created_at timestamptz default now());
create table product_images(id uuid primary key default gen_random_uuid(),product_id uuid references products on delete cascade,url text not null,position int default 0);
create table product_variants(id uuid primary key default gen_random_uuid(),product_id uuid references products on delete cascade,size text,color text,stock int default 0);
create table favorites(user_id uuid references auth.users on delete cascade,product_id uuid references products on delete cascade,primary key(user_id,product_id));
create table orders(id uuid primary key default gen_random_uuid(),number serial,customer_name text,total numeric(10,2) default 0,status text default 'Novo',created_at timestamptz default now());
create table order_items(id uuid primary key default gen_random_uuid(),order_id uuid references orders on delete cascade,product_id uuid,name text,size text,color text,qty int,price numeric(10,2));
create table admins(user_id uuid primary key references auth.users on delete cascade);
create table site_settings(key text primary key,value text);

create function is_admin() returns bool language sql security definer stable as $$ select exists(select 1 from admins where user_id=auth.uid()) $$;

alter table categories enable row level security; alter table products enable row level security; alter table product_images enable row level security;
alter table product_variants enable row level security; alter table favorites enable row level security; alter table orders enable row level security;
alter table order_items enable row level security; alter table admins enable row level security; alter table site_settings enable row level security;

create policy pub_read on categories for select using(true);
create policy pub_read on products for select using(active or is_admin());
create policy pub_read on product_images for select using(true);
create policy pub_read on product_variants for select using(true);
create policy pub_read on site_settings for select using(true);
create policy adm on categories for all using(is_admin()) with check(is_admin());
create policy adm on products for all using(is_admin()) with check(is_admin());
create policy adm on product_images for all using(is_admin()) with check(is_admin());
create policy adm on product_variants for all using(is_admin()) with check(is_admin());
create policy adm on site_settings for all using(is_admin()) with check(is_admin());
create policy adm on orders for all using(is_admin()) with check(is_admin());
create policy adm on order_items for all using(is_admin()) with check(is_admin());
create policy adm on admins for all using(is_admin()) with check(is_admin());
create policy own on favorites for all using(auth.uid()=user_id) with check(auth.uid()=user_id);

-- Pedido público: preço calculado NO SERVIDOR (o cliente não define preço)
create function create_order(p_name text,p_items jsonb) returns int language plpgsql security definer as $$
declare oid uuid; n int; t numeric:=0; i jsonb; pr record; up numeric;
begin
 insert into orders(customer_name) values(p_name) returning id,number into oid,n;
 for i in select * from jsonb_array_elements(p_items) loop
  select * into pr from products where id=(i->>'id')::uuid and active;
  if pr.id is null then continue; end if;
  up:=case when pr.sale_price is not null and (pr.sale_start is null or pr.sale_start<=now()) and (pr.sale_end is null or pr.sale_end>now()) then pr.sale_price else pr.price end;
  insert into order_items(order_id,product_id,name,size,color,qty,price) values(oid,pr.id,pr.name,i->>'size',i->>'color',greatest((i->>'qty')::int,1),up);
  t:=t+greatest((i->>'qty')::int,1)*up;
 end loop;
 update orders set total=t where id=oid; return n;
end $$;
grant execute on function create_order(text,jsonb) to anon,authenticated;

-- Storage (imagens públicas, escrita só admin)
insert into storage.buckets(id,name,public) values('store','store',true) on conflict do nothing;
create policy "store read" on storage.objects for select using(bucket_id='store');
create policy "store admin" on storage.objects for all using(bucket_id='store' and is_admin()) with check(bucket_id='store' and is_admin());

insert into site_settings values('store_name','HG Imports'),('whatsapp','5511947160883'),('instagram','https://www.instagram.com/hg.importsss/'),('instagram_handle','@hg.importsss'),('hero_title','Streetwear importado com atitude'),('hero_sub','Peças exclusivas, direto no seu WhatsApp.'),('hero_cta','COMPRAR AGORA');

-- Depois de criar seu usuário em Authentication > Users, torne-o admin:
-- insert into admins select id from auth.users where email='SEU@EMAIL.COM';
