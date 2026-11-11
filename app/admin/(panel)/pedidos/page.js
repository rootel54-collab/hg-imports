'use client'
import {useEffect,useState} from 'react'
import {sb} from '@/lib/browser'
import {brl} from '@/lib/util'
const ST=['Novo','Confirmado','Em preparação','Enviado','Concluído','Cancelado']
const B={width:'100%',padding:'11px',borderRadius:10,background:'none',fontWeight:600,cursor:'pointer',marginTop:10}
export default function Pedidos(){
 const s=sb(),[all,setAll]=useState([]),[tab,setTab]=useState('ativos')
 const load=()=>s.from('orders').select('*,order_items(*)').order('created_at',{ascending:false}).then(({data})=>setAll(data||[]))
 useEffect(()=>{load()},[])
 const run=async q=>{const {error}=await q;if(error)return alert('Erro: '+error.message);load()}
 const trash=ids=>run(s.from('orders').update({deleted_at:new Date().toISOString()}).in('id',ids))
 const restore=id=>run(s.from('orders').update({deleted_at:null}).eq('id',id))
 const purge=ids=>run(s.from('orders').delete().in('id',ids))
 const act=all.filter(o=>!o.deleted_at),tr=all.filter(o=>o.deleted_at),canc=act.filter(o=>o.status==='Cancelado')
 const l=tab==='lixeira'?tr:act
 return <><h2 style={{marginBottom:14}}>Pedidos</h2>
  <div className="row" style={{marginBottom:14}}>
   <button className={'btn'+(tab==='ativos'?'':' out')} onClick={()=>setTab('ativos')}>Pedidos ({act.length})</button>
   <button className={'btn'+(tab==='lixeira'?'':' out')} onClick={()=>setTab('lixeira')}>🗑️ Lixeira ({tr.length})</button>
  </div>
  {tab==='ativos'&&canc.length>0&&<button type="button" onClick={()=>{if(confirm(`Mover ${canc.length} pedido(s) cancelado(s) para a lixeira?`))trash(canc.map(o=>o.id))}} style={{...B,marginTop:0,marginBottom:14,border:'1px solid var(--line)',color:'var(--fg)'}}>Mover todos os cancelados para a lixeira ({canc.length})</button>}
  {tab==='lixeira'&&<><p style={{color:'var(--mut)',fontSize:14,marginBottom:10}}>Pedidos na lixeira não aparecem na lista nem nas vendas. Você pode restaurá-los ou excluí-los de vez.</p>
   {tr.length>0&&<button type="button" onClick={()=>{if(confirm(`Excluir DEFINITIVAMENTE ${tr.length} pedido(s) da lixeira? Esta ação não pode ser desfeita.`))purge(tr.map(o=>o.id))}} style={{...B,marginTop:0,marginBottom:14,border:'1px solid #e11d48',color:'#e11d48'}}>Esvaziar lixeira ({tr.length})</button>}</>}
  {l.map(o=><div className="box" key={o.id}><b>#{o.number}</b> · {new Date(o.created_at).toLocaleString('pt-BR')}
  <p><b>{o.customer_name||'Sem nome'}</b> · {o.service_type||'-'} · {o.payment||'-'}</p>
  {o.phone&&<p><a href={`https://wa.me/${o.phone.replace(/\D/g,'')}`} target="_blank" style={{color:'var(--blue)'}}>{o.phone}</a></p>}
  {o.address&&<p>📍 {o.address}</p>}
  {o.order_items.map(i=><p key={i.id} style={{fontSize:14}}>{i.qty}× {i.name} {i.size&&`(${i.size}`}{i.color&&`, ${i.color}`}{i.size&&')'} — {brl(i.price)}</p>)}
  <p><b>Total: {brl(o.total)}</b></p>
  {tab==='ativos'?<>
   <select value={o.status} onChange={e=>run(s.from('orders').update({status:e.target.value}).eq('id',o.id))}>{ST.map(x=><option key={x}>{x}</option>)}</select>
   <button type="button" onClick={()=>trash([o.id])} style={{...B,border:'1px solid #e11d48',color:'#e11d48'}}>🗑️ Mover para a lixeira</button></>
  :<>
   <p style={{fontSize:13,color:'var(--mut)'}}>Status: {o.status} · na lixeira desde {new Date(o.deleted_at).toLocaleString('pt-BR')}</p>
   <button type="button" onClick={()=>restore(o.id)} style={{...B,border:'1px solid var(--blue)',color:'var(--fg)'}}>↩️ Restaurar pedido</button>
   <button type="button" onClick={()=>{if(confirm(`Excluir DEFINITIVAMENTE o pedido #${o.number}? Esta ação não pode ser desfeita.`))purge([o.id])}} style={{...B,border:'1px solid #e11d48',color:'#e11d48'}}>Excluir definitivamente</button></>}
  </div>)}
  {!l.length&&<p>{tab==='lixeira'?'A lixeira está vazia.':'Nenhum pedido ainda.'}</p>}</>}
