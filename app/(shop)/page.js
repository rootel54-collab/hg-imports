import Link from 'next/link'
import Image from 'next/image'
import {db,getSettings,PRODUCT_SELECT} from '@/lib/db'
import {pricing} from '@/lib/util'
import {Card} from '@/components/Card'
export const revalidate=60
const Sec=({t,l,href})=>l.length?<section className="wrap sec"><div className="sh"><h2>{t}</h2><Link href={href}>Ver tudo</Link></div><div className="grid">{l.slice(0,8).map(p=><Card key={p.id} p={p}/>)}</div></section>:null
export default async function Home(){
 const s=await getSettings(),d=db()
 const [a,b]=await Promise.all([d.from('products').select(PRODUCT_SELECT).eq('active',true).order('created_at',{ascending:false}),d.from('categories').select('*').order('position')])
 const P=a.data||[],C=b.data||[]
 const J=k=>{try{return JSON.parse(s[k]||'[]')}catch{return[]}}
 const pick=(k,auto)=>{const i=J(k);return i.length?i.map(id=>P.find(p=>p.id==id)).filter(Boolean):auto}
 const ig=J('insta_images')
 const hasImg=!!s.hero_image
 return <>
  {hasImg&&<section style={{background:'#050816'}}><Image src={s.hero_image} alt={s.store_name} width={1536} height={1024} priority sizes="100vw" style={{width:'100%',height:'auto',maxWidth:1200,margin:'0 auto'}}/></section>}
  <section className="hero" style={hasImg?{padding:'28px 0 36px'}:undefined}><div className="wrap">
   {s.hero_title&&<h1 style={hasImg?{fontSize:'clamp(24px,5.5vw,44px)'}:undefined}>{s.hero_title}</h1>}
   {s.hero_sub&&<p>{s.hero_sub}</p>}
   <Link className="btn" href="/catalogo">{s.hero_cta}</Link></div></section>
  <Sec t="Destaques" l={pick('home_destaques',P.filter(p=>p.is_featured))} href="/catalogo"/>
  <Sec t="Novidades" l={pick('home_novidades',P.filter(p=>p.is_new))} href="/catalogo?f=novo"/>
  {C.length>0&&<section className="wrap sec"><div className="sh"><h2>Categorias</h2></div><div className="cats">{C.map(c=><Link key={c.id} href={`/catalogo?c=${encodeURIComponent(c.name)}`} className="cat" style={c.image_url?{backgroundImage:`linear-gradient(#0000,#050816bb),url(${c.image_url})`}:undefined}>{c.name}</Link>)}</div></section>}
  <Sec t="Mais vendidos" l={pick('home_vendidos',P.filter(p=>p.is_bestseller))} href="/catalogo?f=vendidos"/>
  <Sec t="Promoções" l={pick('home_promo',P.filter(p=>pricing(p).on))} href="/catalogo?f=promo"/>
  <section className="insta"><h2>Siga a gente no Instagram</h2><p style={{marginBottom:22}}>{s.instagram_handle}</p>
   {ig.length>0&&<div className="igrid">{ig.map(u=><a key={u} href={s.instagram} target="_blank" rel="noopener"><Image src={u} alt="Foto do Instagram" width={300} height={300} loading="lazy"/></a>)}</div>}
   <a className="btn" href={s.instagram} target="_blank" rel="noopener">SEGUIR NO INSTAGRAM</a></section></>}
