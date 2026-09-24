'use client'
import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useStore} from '@/components/Store'
import {brl} from '@/lib/util'
import {sb} from '@/lib/browser'
export default function Cart(){
 const {cart,qty,del,clear,s}=useStore()
 const [f,setF]=useState({tipo:'Delivery',nome:'',tel:'',end:'',pag:'PIX'}),[busy,setBusy]=useState(false),[err,setErr]=useState('')
 const set=(k,v)=>setF(x=>({...x,[k]:v}))
 const sub=cart.reduce((a,i)=>a+i.qty*i.price,0)
 const taxa=f.tipo=='Delivery'?Number(s.delivery_fee||0):0
 const total=sub+taxa
 const go=async()=>{
  if(!f.nome.trim()||!f.tel.trim()||(f.tipo=='Delivery'&&!f.end.trim()))return setErr('Preencha nome, telefone'+(f.tipo=='Delivery'?' e endereço.':'.'))
  setBusy(true)
  const {data:n}=await sb().rpc('create_order',{p_name:f.nome,p_items:cart.map(i=>({id:i.id,size:i.size,color:i.color,qty:i.qty}))})
  const d=new Date(),data=d.toLocaleDateString('pt-BR'),hora=d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
  const L=cart.map(i=>`*${i.qty}x ${i.name}*  ${brl(i.price)}\n   Tamanho: ${i.size||'-'}${i.color?`\n   Cor: ${i.color}`:''}\n   Subtotal: ${brl(i.price*i.qty)}`).join('\n\n')
  const msg=`👋 Venho de ${location.host}\n${n?`Pedido #${n}\n`:''}📅 ${data} ⏰ ${hora}\n\n*Tipo de serviço:* ${f.tipo}\n\nNome: ${f.nome}\nTelefone: ${f.tel}${f.tipo=='Delivery'?`\nEndereço: ${f.end}`:''}\n\n📝 *Produtos*\n${L}\n\nSubtotal: ${brl(sub)}${f.tipo=='Delivery'?`\nDelivery: ${brl(taxa)}`:''}\n*Total: ${brl(total)}*\n\n💲 *Pagamento*\nForma de pagamento: ${f.pag}\nEstado do pagamento: Não pago\n*Total a pagar: ${brl(total)}*\n\n👆 Por favor, envie-nos esta mensagem agora. Assim que recebermos estaremos atendendo você.`
  clear();location.href=`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg)}`}
 return <div className="wrap sec" style={{maxWidth:760}}><div className="sh"><h2>Carrinho</h2></div>
  {!cart.length?<p>Seu carrinho está vazio. <Link href="/catalogo" style={{color:'var(--blue)',fontWeight:700}}>Continuar comprando</Link></p>:<>
   {cart.map(i=><div className="ci" key={i.id+i.size+i.color}>{i.img&&<Image src={i.img} alt={i.name} width={152} height={192}/>}
    <div><b>{i.name}</b><p style={{fontSize:13,color:'var(--mut)'}}>{[i.size&&`Tam. ${i.size}`,i.color].filter(Boolean).join(' · ')}</p><p>{brl(i.price)}</p>
     <div className="qt"><button onClick={()=>qty(i,-1)} aria-label="Diminuir">−</button><b>{i.qty}</b><button onClick={()=>qty(i,1)} aria-label="Aumentar">+</button><button onClick={()=>del(i)} style={{width:'auto',padding:'0 12px',borderRadius:99,fontSize:13}}>Remover</button></div></div>
    <b>{brl(i.price*i.qty)}</b></div>)}
   <div className="box" style={{marginTop:18}}>
    <label>Tipo de serviço</label><select value={f.tipo} onChange={e=>set('tipo',e.target.value)}><option>Delivery</option><option>Retirada</option></select>
    <label>Nome</label><input value={f.nome} onChange={e=>set('nome',e.target.value)}/>
    <label>Telefone</label><input type="tel" value={f.tel} onChange={e=>set('tel',e.target.value)} placeholder="55 11 91234-5678"/>
    {f.tipo=='Delivery'&&<><label>Endereço</label><input value={f.end} onChange={e=>set('end',e.target.value)} placeholder="Rua, número, bairro"/></>}
    <label>Pagamento</label><select value={f.pag} onChange={e=>set('pag',e.target.value)}><option>PIX</option><option>Cartão</option><option>Dinheiro</option></select></div>
   <p>Subtotal: <b>{brl(sub)}</b></p>{taxa>0&&<p>Delivery: <b>{brl(taxa)}</b></p>}
   <p style={{fontSize:22,margin:'8px 0 14px'}}>Total: <b>{brl(total)}</b></p>
   {err&&<p style={{color:'#e11d48',marginBottom:8}}>{err}</p>}
   <button className="btn wa blk" disabled={busy} onClick={go}>FINALIZAR PEDIDO</button>
   <p style={{textAlign:'center',marginTop:14}}><Link href="/catalogo" style={{color:'var(--blue)',fontWeight:700}}>Continuar comprando</Link></p></>}</div>}
