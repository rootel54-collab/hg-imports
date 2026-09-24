import {notFound} from 'next/navigation'
import {db,PRODUCT_SELECT} from '@/lib/db'
import {pricing} from '@/lib/util'
import Buy from '@/components/Buy'
import {Card} from '@/components/Card'
export const revalidate=60
const get=async s=>(await db().from('products').select(PRODUCT_SELECT).eq('slug',s).eq('active',true).maybeSingle()).data
export async function generateMetadata({params}){const p=await get(params.slug);if(!p)return{};const im=p.product_images[0]?.url
 return{title:`${p.name} | HG Imports`,description:(p.description||`Compre ${p.name} na HG Imports`).slice(0,155),alternates:{canonical:`/produto/${p.slug}`},openGraph:{title:p.name,images:im?[im]:[]}}}
export default async function Page({params}){
 const p=await get(params.slug);if(!p)notFound()
 const pr=pricing(p),{data:sim}=await db().from('products').select(PRODUCT_SELECT).eq('active',true).eq('category_id',p.category_id||-1).neq('id',p.id).limit(4)
 const ld={'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description,image:p.product_images.map(i=>i.url),offers:{'@type':'Offer',priceCurrency:'BRL',price:pr.price,availability:p.product_variants.some(v=>v.stock>0)?'https://schema.org/InStock':'https://schema.org/OutOfStock'}}
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/><Buy p={p}/>
  {sim?.length>0&&<section className="wrap sec"><div className="sh"><h2>Você também pode gostar</h2></div><div className="grid">{sim.map(x=><Card key={x.id} p={x}/>)}</div></section>}</>}
