'use client'
import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useStore} from '@/components/Store'
import {brl} from '@/lib/util'
import {sb} from '@/lib/browser'
export default function Cart(){
 const {cart,qty,del,clear,s}=useStore(),[name,setName]=useState(''),[busy,setBusy]=useState(false)
 const total=cart.reduce((a,i)=>a+i.qty*i.price,0)
 const go=async()=>{setBusy(true)
  const {data:n}=await sb().rpc('create_order',{p_name:name||null,p_items:cart.map(i=>({id:i.id,size:i.size,color:i.color,qty:i.qty}))})
  const msg=`Olá! Gostaria de fazer um pedido${n?` (#${n})`:''}:\n\n`+cart.map(i=>`• ${i.name}\nTamanho: ${i.size||'-'}${i.color?`\nCor: ${i.color}`:''}\nQuantidade: ${i.qty}\nPreço: ${brl(i.price)}`).join('\n\n')+`\n\nTotal: ${brl(total)}`+(name?`\nNome: ${name}`:'')
  clear();location.href=`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg)}`}
 return <div className="wrap sec" style={{maxWidth:760}}><div className="sh"><h2>Carrinho</h2></div>
  {!cart.length?<p>Seu carrinho está vazio. <Link href="/catalogo" style={{color:'var(--blue)',fontWeight:700}}>Continuar comprando</Link></p>:<>
   {cart.map(i=><div className="ci" key={i.id+i.size+i.color}>{i.img&&<Image src={i.img} alt={i.name} width={152} height={192}/>}
    <div><b>{i.name}</b><p style={{fontSize:13,color:'var(--mut)'}}>{[i.size&&`Tam. ${i.size}`,i.color].filter(Boolean).join(' · ')}</p><p>{brl(i.price)}</p>
     <div className="qt"><button onClick={()=>qty(i,-1)} aria-label="Diminuir">−</button><b>{i.qty}</b><button onClick={()=>qty(i,1)} aria-label="Aumentar">+</button><button onClick={()=>del(i)} style={{width:'auto',padding:'0 12px',borderRadius:99,fontSize:13}}>Remover</button></div></div>
    <b>{brl(i.price*i.qty)}</b></div>)}
   <p style={{fontSize:22,margin:'18px 0'}}>Subtotal: <b>{brl(total)}</b></p><p style={{fontSize:22,marginBottom:14}}>Total: <b>{brl(total)}</b></p>
   <input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome (opcional)" style={{marginBottom:12}}/>
   <button className="btn wa blk" disabled={busy} onClick={go}>FINALIZAR PEDIDO</button>
   <p style={{textAlign:'center',marginTop:14}}><Link href="/catalogo" style={{color:'var(--blue)',fontWeight:700}}>Continuar comprando</Link></p></>}</div>}
