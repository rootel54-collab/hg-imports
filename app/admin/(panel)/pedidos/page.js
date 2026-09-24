'use client'
import {useEffect,useState} from 'react'
import {sb} from '@/lib/browser'
import {brl} from '@/lib/util'
const ST=['Novo','Confirmado','Em preparação','Enviado','Concluído','Cancelado']
export default function Pedidos(){
 const s=sb(),[l,setL]=useState([])
 const load=()=>s.from('orders').select('*,order_items(*)').order('created_at',{ascending:false}).then(({data})=>setL(data||[]))
 useEffect(()=>{load()},[])
 return <><h2 style={{marginBottom:14}}>Pedidos</h2>{l.map(o=><div className="box" key={o.id}><b>#{o.number}</b> · {new Date(o.created_at).toLocaleString('pt-BR')} · {o.customer_name||'Sem nome'}
  {o.order_items.map(i=><p key={i.id} style={{fontSize:14}}>{i.qty}× {i.name} {i.size&&`(${i.size}`}{i.color&&`, ${i.color}`}{i.size&&')'} — {brl(i.price)}</p>)}
  <p><b>Total: {brl(o.total)}</b></p><select value={o.status} onChange={async e=>{await s.from('orders').update({status:e.target.value}).eq('id',o.id);load()}}>{ST.map(x=><option key={x}>{x}</option>)}</select></div>)}{!l.length&&<p>Nenhum pedido ainda.</p>}</>}
