# HG Imports — loja Next.js + Supabase (PT-BR)
## Estrutura
app/(shop) loja (home, catalogo, produto/[slug], carrinho, favoritos, politica) · app/admin (login + painel protegido) · components · lib · supabase/schema.sql · middleware.js (protege /admin)
## Variáveis de ambiente (.env.local e Vercel) — nenhuma é secreta
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_URL. A chave service_role NUNCA é usada. A segurança vem de RLS + is_admin().
## Supabase
1. Crie o projeto em supabase.com. 2. SQL Editor: cole e rode supabase/schema.sql (tabelas, RLS, bucket "store", função create_order).
3. Authentication > Users > Add user (e-mail + senha). Depois rode: insert into admins select id from auth.users where email='SEU@EMAIL.COM';
4. Authentication > Providers: deixe só Email; desative "Allow new users to sign up" (Settings) para ninguém mais criar conta.
5. Storage: o bucket público "store" já é criado pelo SQL (leitura pública, escrita só admin).
## Rodar local
npm install && cp .env.example .env.local (preencha) && npm run dev → http://localhost:3000 e /admin/login
## Deploy Vercel
Suba para o GitHub → vercel.com > Add New Project → importe → adicione as 3 variáveis → Deploy.
## Domínio .com.br
Registre em registro.br → Vercel > Settings > Domains > adicione seudominio.com.br → no Registro.br configure o DNS: A @ 76.76.21.21 e CNAME www cname.vercel-dns.com → aguarde propagar. Atualize NEXT_PUBLIC_SITE_URL e redeploy.
## Admin
Configurações: logo, WhatsApp, Instagram, banner, cores, endereço. Produtos: CRUD, fotos, estoque (linhas "tamanho, cor, qtd"), promoção com datas. Pedidos: status.

## Novidades v2
Modo escuro (botão 🌙; ativar/desativar em Configurações), galeria do Instagram (Configurações, até 6 fotos) e seleção manual dos produtos da home (Admin > Página inicial). Não requer novo SQL.
