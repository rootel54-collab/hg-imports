'use client'
import {useState,useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useStore} from './Store'
import {brl,pricing,stockOf} from '@/lib/util'
function Timer({end}){const [t,setT]=useState(0);useEffect(()=>{const f=()=>setT(new Date(end)-Date.now());f();const i=setInterval(f,1000);return()=>clearInterval(i)},[end])
 if(t<=0)return null;const d=Math.floor(t/864e5),h=Math.floor(t%864e5/36e5),m=Math.floor(t%36e5/6e4),s=Math.floor(t%6e4/1e3)
 return <div className="tm">⏱ OFERTA POR TEMPO LIMITADO: {d}d {h}h {m}m {s}s</div>}
export default function Buy({p}){
 const {add,favs,toggleFav,s}=useStore(),pr=pricing(p),V=p.product_variants,st=stockOf(p)
 const imgs=[...p.product_images].sort((a,b)=>a.position-b.position)
 const sizes=[...new Set(V.map(v=>v.size).filter(Boolean))],colors=[...new Set(V.map(v=>v.color).filter(Boolean))]
 const [i,setI]=useState(0),[size,setSize]=useState(''),[color,setColor]=useState(''),[q,setQ]=useState(1),[ok,setOk]=useState(false)
 const avail=(o)=>V.filter(v=>(o.size===undefined||v.size==o.size)&&(o.color===undefined||v.color==o.color)).reduce((a,v)=>a+v.stock,0)
 const left=avail({size:size||undefined,color:color||undefined}),need=(sizes.length&&!size)||(colors.length&&!color)
 const item=()=>({id:p.id,name:p.name,img:imgs[0]?.url,size,color,qty:q,price:pr.price})
 const msg=()=>`Olá! Tenho interesse:\n• ${p.name}${size?`\nTamanho: ${size}`:''}${color?`\nCor: ${color}`:''}\nQuantidade: ${q}\nPreço: ${brl(pr.price*q)}\n${location.href}`
 const share=()=>navigator.share?navigator.share({title:p.name,url:location.href}).catch(()=>{}):window.open(`https://wa.me/?text=${encodeURIComponent(p.name+' '+location.href)}`)
 const tags=[];if(p.is_new)tags.push('NOVO');if(pr.on)tags.push('PROMOÇÃO');if(p.is_bestseller)tags.push('MAIS VENDIDO');if(st>0&&st<=3)tags.push('ÚLTIMAS UNIDADES')
 return <div className="wrap pg">
  <div className="gal"><div className="main">{imgs[i]&&<Image src={imgs[i].url} alt={p.name} width={900} height={1200} priority sizes="(max-width:800px) 100vw,50vw"/>}</div>
   {imgs.length>1&&<div className="th">{imgs.map((m,n)=><button key={m.url} className={n==i?'on':''} onClick={()=>setI(n)} aria-label={`Foto ${n+1}`}><Image src={m.url} alt="" width={136} height={170} loading="lazy"/></button>)}</div>}</div>
  <div><p style={{color:'var(--mut)',fontSize:13}}>{p.categories?.name}</p><h1 style={{fontSize:'clamp(26px,4vw,38px)',margin:'4px 0 10px'}}>{p.name}</h1>
   <div className="bd" style={{position:'static',flexDirection:'row',flexWrap:'wrap',marginBottom:10}}>{tags.map(t=><span key={t}>{t}</span>)}</div>
   <p style={{fontSize:26}}>{pr.on&&<><s style={{color:'var(--mut)',fontSize:17}}>{brl(pr.old)}</s> <b className="off" style={{fontSize:16}}>-{pr.off}%</b> </>}<b>{brl(pr.price)}</b></p>
   {pr.on&&p.sale_end&&<Timer end={p.sale_end}/>}
   <p style={{margin:'16px 0',lineHeight:1.6,whiteSpace:'pre-line'}}>{p.description}</p>
   {sizes.length>0&&<><b>Tamanho</b><div className="chips">{sizes.map(x=><button key={x} className={'chip'+(size==x?' on':'')} disabled={avail({size:x})==0} onClick={()=>setSize(x)}>{x}</button>)}</div></>}
   {colors.length>0&&<><b>Cor</b><div className="chips">{colors.map(x=><button key={x} className={'chip'+(color==x?' on':'')} disabled={avail({color:x})==0} onClick={()=>setColor(x)}>{x}</button>)}</div></>}
   <p style={{fontSize:14,marginBottom:12}}>{st==0?'ESGOTADO':left<=3?`ÚLTIMAS UNIDADES (${left})`:'Em estoque'}</p>
   <div className="qt" style={{marginBottom:14}}><button className="chip" onClick={()=>setQ(Math.max(1,q-1))}>−</button><b>{q}</b><button className="chip" onClick={()=>setQ(Math.min(Math.max(left,1),q+1))}>+</button></div>
   <div className="row"><button className="btn" disabled={st==0||need||left<1} onClick={()=>{add(item());setOk(true);setTimeout(()=>setOk(false),2000)}}>{ok?'ADICIONADO ✓':'ADICIONAR AO CARRINHO'}</button>
    <button className="btn wa" disabled={st==0||need||left<1} onClick={()=>window.open(`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg())}`)}>COMPRAR PELO WHATSAPP</button></div>
   {need&&st>0&&<p style={{fontSize:13,color:'var(--mut)',marginTop:8}}>Escolha tamanho{colors.length?' e cor':''} para continuar.</p>}
   <div className="row" style={{marginTop:12}}><button className="btn out" onClick={()=>toggleFav(p.id)}>{favs.includes(p.id)?'❤️ Favoritado':'🤍 Favoritar'}</button><button className="btn out" onClick={share}>📤 Compartilhar</button></div>
   <p style={{marginTop:18}}><Link href="/carrinho" style={{color:'var(--blue)',fontWeight:700}}>Ver carrinho</Link></p></div></div>}
