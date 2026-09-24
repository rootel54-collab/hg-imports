'use client'
import {useEffect,useState} from 'react'
import {sb,upload} from '@/lib/browser'
const F=[['store_name','Nome da loja'],['whatsapp','WhatsApp (só números, com 55)'],['instagram','Link do Instagram'],['instagram_handle','@ do Instagram'],['address','Endereço'],['hours','Horários'],['footer_text','Texto do rodapé'],['hero_title','Título do banner'],['hero_sub','Subtítulo do banner'],['hero_cta','Texto do botão'],['color_primary','Cor principal (#hex)'],['color_accent','Cor de destaque (#hex)']]
export default function Cfg(){
 const s=sb(),[v,setV]=useState({}),[m,setM]=useState('')
 useEffect(()=>{s.from('site_settings').select('*').then(({data})=>setV(Object.fromEntries((data||[]).map(r=>[r.key,r.value]))))},[])
 const save=async(o=v)=>{const {error}=await s.from('site_settings').upsert(Object.entries(o).map(([key,value])=>({key,value:value||''})));setM(error?error.message:'Salvo! O site atualiza em até 1 minuto.')}
 const ig=(()=>{try{return JSON.parse(v.insta_images||'[]')}catch{return[]}})()
 const setIg=a=>{const n={...v,insta_images:JSON.stringify(a)};setV(n);save(n)}
 const addIg=async e=>{try{if(ig.length>=6)throw Error('Máximo de 6 fotos');setIg([...ig,await upload(e.target.files[0],'insta')])}catch(x){setM(x.message)}}
 const img=async(k,e)=>{try{const n={...v,[k]:await upload(e.target.files[0],'site')};setV(n);await save(n)}catch(x){setM(x.message)}}
 return <><h2 style={{marginBottom:14}}>Configurações</h2>
  <div className="box"><h3>Identidade da loja</h3><label>Logo atual</label><img src={v.logo_url||'/logo.jpg'} alt="Logo" style={{height:110,width:'auto',borderRadius:12}}/>
   <label>Alterar logo (PNG/JPG/WEBP/SVG, máx. 5 MB)</label><input type="file" accept="image/*" onChange={e=>img('logo_url',e)}/>
   <button className="btn out" style={{marginTop:10}} onClick={()=>{const n={...v,logo_url:''};setV(n);save(n)}}>Remover logo (volta ao padrão)</button>
   <label>Imagem do banner principal</label><input type="file" accept="image/*" onChange={e=>img('hero_image',e)}/></div>
  <div className="box"><h3>Galeria do Instagram (até 6 fotos)</h3><div className="ims">{ig.map((u,n)=><div key={u}><img src={u} alt=""/><button type="button" onClick={()=>setIg(ig.filter((_,j)=>j!=n))}>×</button></div>)}</div><input type="file" accept="image/*" onChange={addIg}/></div>
  <div className="box">{F.map(([k,l])=><div key={k}><label>{l}</label><input value={v[k]||''} onChange={e=>setV({...v,[k]:e.target.value})}/></div>)}<label>Modo escuro (botão 🌙 na loja)</label><select value={v.dark_mode||'on'} onChange={e=>setV({...v,dark_mode:e.target.value})}><option value="on">Ativado</option><option value="off">Desativado</option></select>
   <button className="btn" style={{marginTop:14}} onClick={()=>save()}>SALVAR</button><p style={{marginTop:8}}>{m}</p></div></>}
