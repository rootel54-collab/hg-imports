'use client'
import Link from 'next/link'
import Image from 'next/image'
import {useStore} from './Store'
import {brl,pricing,stockOf} from '@/lib/util'
export function Card({p}){
 const {favs,toggleFav}=useStore(),pr=pricing(p),st=stockOf(p),b=[]
 const img=[...p.product_images].sort((a,c)=>a.position-c.position)[0]?.url
 if(st==0)b.push('ESGOTADO');else{if(p.is_new)b.push('NOVO');if(pr.on)b.push('PROMOÇÃO');if(p.is_bestseller)b.push('MAIS VENDIDO');if(st<=3)b.push('ÚLTIMAS UNIDADES')}
 return <div className="card"><Link href={`/produto/${p.slug}`}><div className="im">{img&&<Image src={img} alt={p.name} width={480} height={640} sizes="(max-width:600px) 50vw,25vw" loading="lazy"/>}</div><div className="bd">{b.map(x=><span key={x}>{x}</span>)}</div></Link>
  <button className="fv" onClick={()=>toggleFav(p.id)} aria-label="Favoritar">{favs.includes(p.id)?'❤️':'🤍'}</button>
  <h3>{p.name}</h3><p className="pr">{pr.on&&<><s>{brl(pr.old)}</s> <b className="off">-{pr.off}%</b> </>}<b>{brl(pr.price)}</b></p></div>}
