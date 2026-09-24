import {createClient} from '@supabase/supabase-js'
export const db=()=>createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false}})
export const PRODUCT_SELECT='*,product_images(url,position),product_variants(size,color,stock),categories(name,slug)'
export async function getSettings(){
 const s={store_name:'HG Imports',whatsapp:'5511947160883',instagram:'https://www.instagram.com/hg.importsss/',instagram_handle:'@hg.importsss',logo_url:'/logo.jpg',hero_cta:'COMPRAR AGORA'}
 try{const {data}=await db().from('site_settings').select('*');(data||[]).forEach(r=>{if(r.value)s[r.key]=r.value})}catch{}
 return s}
