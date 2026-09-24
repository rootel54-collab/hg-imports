'use client'
import {useState,useMemo} from 'react'
import {Card} from './Card'
import {pricing} from '@/lib/util'
const N=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
export default function Catalog({products,init}){
 const [q,setQ]=useState(init.q||''),[sort,setSort]=useState('new'),[cat,setCat]=useState(init.c||''),[size,setSize]=useState(''),[color,setColor]=useState(''),[max,setMax]=useState(''),[f,setF]=useState(init.f||''),[g,setG]=useState(init.g||'')
 const U=fn=>[...new Set(products.flatMap(fn).filter(Boolean))]
 const list=useMemo(()=>{
  const l=products.filter(p=>{const pr=pricing(p),h=N([p.name,p.categories?.name,p.description,(p.tags||[]).join(' ')].join(' '));
   return N(q).split(' ').every(w=>h.includes(w))&&(!cat||p.categories?.name==cat)&&(!g||p.gender==g||p.gender=='unissex')&&(!size||p.product_variants.some(v=>v.size==size&&v.stock>0))&&(!color||p.product_variants.some(v=>v.color==color&&v.stock>0))&&(!max||pr.price<=+max)&&(f!='promo'||pr.on)&&(f!='novo'||p.is_new)&&(f!='vendidos'||p.is_bestseller)})
  const P=p=>pricing(p).price
  return l.sort(sort=='low'?(a,b)=>P(a)-P(b):sort=='high'?(a,b)=>P(b)-P(a):sort=='best'?(a,b)=>b.is_bestseller-a.is_bestseller:(a,b)=>new Date(b.created_at)-new Date(a.created_at))},[products,q,sort,cat,size,color,max,f,g])
 const Sel=(v,set,ph,opts)=><select value={v} onChange={e=>set(e.target.value)} aria-label={ph}><option value="">{ph}</option>{opts.map(o=><option key={o}>{o}</option>)}</select>
 return <><div className="filters">
  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar (ex.: camiseta preta)"/>
  <select value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Mais recentes</option><option value="best">Mais vendidos</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select>
  {Sel(cat,setCat,'Categoria',U(p=>[p.categories?.name]))}{Sel(size,setSize,'Tamanho',U(p=>p.product_variants.map(v=>v.size)))}{Sel(color,setColor,'Cor',U(p=>p.product_variants.map(v=>v.color)))}
  <input type="number" value={max} onChange={e=>setMax(e.target.value)} placeholder="Preço máx. (R$)"/></div>
  {list.length?<div className="grid">{list.map(p=><Card key={p.id} p={p}/>)}</div>:<p>Nenhum produto encontrado. Tente outros filtros.</p>}</>}
