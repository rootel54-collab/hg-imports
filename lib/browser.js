import {createBrowserClient} from '@supabase/ssr'
export const sb=()=>createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
export async function upload(file,folder){
 if(!file)throw Error('Nenhum arquivo')
 if(!/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.type))throw Error('Formato inválido (use PNG, JPG, WEBP ou SVG)')
 if(file.size>5*1024*1024)throw Error('Arquivo muito grande (máx. 5 MB)')
 const s=sb(),path=`${folder}/${Date.now()}-${file.name.replace(/[^\w.]/g,'_')}`
 const {error}=await s.storage.from('store').upload(path,file);if(error)throw error
 return s.storage.from('store').getPublicUrl(path).data.publicUrl}
