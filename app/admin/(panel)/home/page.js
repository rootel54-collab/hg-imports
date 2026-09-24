'use client'
import {useEffect,useState} from 'react'
import {sb} from '@/lib/browser'
const S=[['home_destaques','Destaques'],['home_novidades','Novidades'],['home_vendidos','Mais vendidos'],['home_promo','Promoções']]
export default function HomeAdmin(){
 const s=sb(),[P,setP]=useState([]),[sel,setSel]=useState({}),[m,setM]=useState('')
 useEffect(()=>{(async()=>{const [a,b]=await Promise.all([s.from('products').select('id,name').eq('active',true).order('name'),s.from('site_settings').select('*').in('key',S.map(x=>x[0]))]);setP(a.data||[]);const o={};(b.data||[]).forEach(r=>{try{o[r.key]=JSON.parse(r.value||'[]')}catch{}});setSel(o)})()},[])
 const tog=(k,id)=>setSel(x=>{const l=x[k]||[];return{...x,[k]:l.includes(id)?l.filter(y=>y!=id):[...l,id]}})
 const save=async()=>{const {error}=await s.from('site_settings').upsert(S.map(([k])=>({key:k,value:JSON.stringify(sel[k]||[])})));setM(error?error.message:'Salvo! A loja atualiza em até 1 minuto.')}
 return <><h2 style={{marginBottom:8}}>Página inicial</h2><p style={{marginBottom:14,color:'var(--mut)'}}>Marque os produtos de cada seção (a ordem de marcação é a ordem na loja). Sem nenhum marcado, a seção usa a regra automática (etiquetas / promoções ativas). Banner, título e botão ficam em Configurações.</p>
  {S.map(([k,t])=><div className="box" key={k}><h3>{t} ({(sel[k]||[]).length})</h3><div className="ck" style={{flexDirection:'column',marginTop:8}}>{P.map(p=><label key={p.id}><input type="checkbox" checked={(sel[k]||[]).includes(p.id)} onChange={()=>tog(k,p.id)}/>{p.name}</label>)}</div></div>)}
  <button className="btn" onClick={save}>SALVAR</button> <span>{m}</span></>}
