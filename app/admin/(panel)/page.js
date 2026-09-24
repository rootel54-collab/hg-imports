'use client'
import {useEffect,useState} from 'react'
import {sb} from '@/lib/browser'
import {brl} from '@/lib/util'
export default function Dash(){
 const [d,setD]=useState(null)
 useEffect(()=>{const s=sb();(async()=>{
  const [p,o]=await Promise.all([s.from('products').select('id,sale_price,sale_end,product_variants(stock)'),s.from('orders').select('*,order_items(*)').order('created_at',{ascending:false})])
  const P=p.data||[],O=o.data||[]
  setD({n:P.length,est:P.filter(x=>x.product_variants.some(v=>v.stock>0)).length,promo:P.filter(x=>x.sale_price!=null&&(!x.sale_end||new Date(x.sale_end)>Date.now())).length,o:O.length,v:O.filter(x=>x.status!='Cancelado').reduce((a,x)=>a+ +x.total,0),rec:O.slice(0,6)})})()},[])
 if(!d)return <p>Carregando…</p>
 return <><h2 style={{marginBottom:14}}>Dashboard</h2><div className="kpi"><div><b>{d.n}</b>Produtos</div><div><b>{d.est}</b>Em estoque</div><div><b>{d.promo}</b>Em promoção</div><div><b>{d.o}</b>Pedidos</div><div><b>{brl(d.v)}</b>Vendas</div></div>
  <h3>Pedidos recentes</h3>{d.rec.map(o=><div className="box" key={o.id}>#{o.number} · {o.customer_name||'Sem nome'} · <b>{brl(o.total)}</b> · {o.status}</div>)}</>}
