import {createServerClient} from '@supabase/ssr'
import {NextResponse} from 'next/server'
export async function middleware(req){
 let res=NextResponse.next({request:req})
 const s=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>req.cookies.getAll(),setAll:l=>{l.forEach(({name,value})=>req.cookies.set(name,value));res=NextResponse.next({request:req});l.forEach(({name,value,options})=>res.cookies.set(name,value,options))}}})
 const {data:{user}}=await s.auth.getUser()
 let ok=false
 if(user){const {data}=await s.from('admins').select('user_id').eq('user_id',user.id).maybeSingle();ok=!!data}
 if(!ok&&req.nextUrl.pathname!=='/admin/login')return NextResponse.redirect(new URL('/admin/login',req.url))
 return res}
export const config={matcher:['/admin/:path*']}
