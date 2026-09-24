'use client'
import {useEffect,useState} from 'react'
import {sb,upload} from '@/lib/browser'
import {brl} from '@/lib/util'
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const V0={size:'',color:'',stock:''}
const E={name:'',description:'',price:'',sale_price:'',sale_start:'',sale_end:'',category_id:'',gender:'unissex',tags:'',is_new:false,is_bestseller:false,is_featured:false,active:true,variants:[V0],images:[]}
export default function Produtos(){
 const s=sb(),[list,setList]=useState([]),[cats,setCats]=useState([]),[f,setF]=useState(null),[m,setM]=useState(''),[nc,setNc]=useState('')
 const load=async()=>{const [a,b]=await Promise.all([s.from('products').select('*,product_images(id,url,position),product_variants(size,color,stock)').order('created_at',{ascending:false}),s.from('categories').select('*').order('name')]);setList(a.data||[]);setCats(b.data||[])}
 useEffect(()=>{load()},[])
 const edit=p=>{setM('');setF({...p,sale_price:p.sale_price??'',sale_start:p.sale_start?.slice(0,16)||'',sale_end:p.sale_end?.slice(0,16)||'',category_id:p.category_id||'',tags:(p.tags||[]).join(', '),variants:p.product_variants.length?p.product_variants.map(v=>({size:v.size||'',color:v.color||'',stock:v.stock})):[V0],images:p.product_images})}
 const set=(k,v)=>setF(x=>({...x,[k]:v}))
 const setV=(i,k,v)=>setF(x=>({...x,variants:x.variants.map((r,j)=>j==i?{...r,[k]:v}:r)}))
 const addV=()=>setF(x=>({...x,variants:[...x.variants,V0]}))
 const delV=i=>setF(x=>({...x,variants:x.variants.filter((_,j)=>j!=i)}))
 const save=async e=>{e.preventDefault();setM('Salvando…')
  const row={name:f.name,slug:f.slug||slug(f.name),description:f.description,price:+f.price,sale_price:f.sale_price===''?null:+f.sale_price,sale_start:f.sale_start?new Date(f.sale_start).toISOString():null,sale_end:f.sale_end?new Date(f.sale_end).toISOString():null,category_id:f.category_id||null,gender:f.gender,tags:f.tags.split(',').map(t=>t.trim()).filter(Boolean),is_new:f.is_new,is_bestseller:f.is_bestseller,is_featured:f.is_featured,active:f.active}
  const {data,error}=await(f.id?s.from('products').update(row).eq('id',f.id):s.from('products').insert(row)).select().single();if(error)return setM(error.message)
  await s.from('product_variants').delete().eq('product_id',data.id)
  const vs=f.variants.filter(v=>v.size.trim()||v.color.trim()).map(v=>({product_id:data.id,size:v.size.trim()||null,color:v.color.trim()||null,stock:parseInt(v.stock)||0}))
  if(vs.length)await s.from('product_variants').insert(vs)
  setF(x=>({...x,id:data.id,slug:data.slug}));setM('Salvo! Agora você pode enviar fotos.');load()}
 const up=async e=>{try{for(const file of e.target.files){const url=await upload(file,`products/${f.id}`);const {data}=await s.from('product_images').insert({product_id:f.id,url,position:f.images.length}).select().single();setF(x=>({...x,images:[...x.images,data]}))}load()}catch(x){setM(x.message)}}
 const rmImg=async i=>{await s.from('product_images').delete().eq('id',i.id);await s.storage.from('store').remove([i.url.split('/store/')[1]]);setF(x=>({...x,images:x.images.filter(y=>y.id!=i.id)}));load()}
 const del=async p=>{if(confirm(`Excluir "${p.name}"?`)){await s.from('products').delete().eq('id',p.id);load()}}
 const off=f&&f.price&&f.sale_price!==''?Math.round((1-f.sale_price/f.price)*100):0
 const g={display:'grid',gridTemplateColumns:'1fr 1fr 84px 40px',gap:8,alignItems:'center',marginBottom:8}
 if(f)return <form onSubmit={save}><button type="button" className="btn out" onClick={()=>setF(null)}>← Voltar</button><h2 style={{margin:'14px 0'}}>{f.id?'Editar':'Novo'} produto</h2>
  <label>Nome</label><input value={f.name} onChange={e=>set('name',e.target.value)} required/><label>Descrição</label><textarea rows={4} value={f.description||''} onChange={e=>set('description',e.target.value)}/>
  <div className="row"><div><label>Preço (R$)</label><input type="number" step="0.01" value={f.price} onChange={e=>set('price',e.target.value)} required/></div><div><label>Preço promocional</label><input type="number" step="0.01" value={f.sale_price} onChange={e=>set('sale_price',e.target.value)}/></div></div>
  {off>0&&<p>Desconto automático: <b>-{off}%</b> ({brl(f.price)} → {brl(f.sale_price)})</p>}
  <div className="row"><div><label>Início da promoção</label><input type="datetime-local" value={f.sale_start} onChange={e=>set('sale_start',e.target.value)}/></div><div><label>Fim (ativa o contador)</label><input type="datetime-local" value={f.sale_end} onChange={e=>set('sale_end',e.target.value)}/></div></div>
  <div className="row"><div><label>Categoria</label><select value={f.category_id} onChange={e=>set('category_id',e.target.value)}><option value="">—</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label>Público</label><select value={f.gender} onChange={e=>set('gender',e.target.value)}><option>unissex</option><option>masculino</option><option>feminino</option></select></div></div>
  <label>Tags (separadas por vírgula)</label><input value={f.tags} onChange={e=>set('tags',e.target.value)}/>
  <div className="box" style={{marginTop:14}}><b>Estoque</b><p style={{fontSize:13,color:'var(--mut)',margin:'4px 0 10px'}}>Uma linha por tamanho/cor. Ex.: M, Preto, 5. A cor pode ficar vazia.</p>
   <div style={{...g,marginBottom:4,fontSize:12,fontWeight:600}}><span>Tamanho</span><span>Cor</span><span>Qtd.</span><span/></div>
   {f.variants.map((v,i)=><div key={i} style={g}><input placeholder="M" value={v.size} onChange={e=>setV(i,'size',e.target.value)}/><input placeholder="Preto" value={v.color} onChange={e=>setV(i,'color',e.target.value)}/><input type="number" min="0" inputMode="numeric" placeholder="0" value={v.stock} onChange={e=>setV(i,'stock',e.target.value)}/><button type="button" onClick={()=>delV(i)} aria-label="Remover" style={{height:42,border:0,borderRadius:10,background:'#e11d48',color:'#fff',cursor:'pointer'}}>×</button></div>)}
   <button type="button" className="btn out" style={{padding:'10px 18px',marginTop:4}} onClick={addV}>+ Adicionar tamanho/cor</button></div>
  <div className="ck" style={{margin:'12px 0'}}>{[['is_new','NOVO'],['is_bestseller','MAIS VENDIDO'],['is_featured','Destaque'],['active','Ativo (visível)']].map(([k,l])=><label key={k}><input type="checkbox" checked={f[k]} onChange={e=>set(k,e.target.checked)}/>{l}</label>)}</div>
  <p style={{fontSize:13,color:'var(--mut)'}}>PROMOÇÃO e ÚLTIMAS UNIDADES (≤3) / ESGOTADO são automáticos.</p>
  <button className="btn">SALVAR</button> <span>{m}</span>
  {f.id&&<div className="box" style={{marginTop:16}}><b>Fotos</b><div className="ims">{f.images.map(i=><div key={i.id}><img src={i.url} alt=""/><button type="button" onClick={()=>rmImg(i)}>×</button></div>)}</div><input type="file" accept="image/*" multiple onChange={up}/></div>}</form>
 return <><div className="sh"><h2>Produtos</h2><button className="btn" onClick={()=>{setM('');setF(E)}}>+ NOVO</button></div>
  <div className="box"><b>Categorias</b><div className="row" style={{marginTop:8}}><input value={nc} onChange={e=>setNc(e.target.value)} placeholder="Ex.: Camisetas"/><button className="btn out" style={{flex:'none'}} onClick={async()=>{if(nc){await s.from('categories').insert({name:nc,slug:slug(nc)});setNc('');load()}}}>Adicionar</button></div><div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>{cats.map(c=><span key={c.id} className="chip" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 12px',minWidth:0}}>{c.name}<button type="button" aria-label={`Excluir ${c.name}`} onClick={async()=>{if(confirm(`Excluir a categoria "${c.name}"? Os produtos dela ficam sem categoria.`)){await s.from('categories').delete().eq('id',c.id);load()}}} style={{background:'none',border:0,color:'#e11d48',fontSize:18,cursor:'pointer'}}>×</button></span>)}</div></div><div className="row" style={{marginTop:8}}><input value={nc} onChange={e=>setNc(e.target.value)} placeholder="Ex.: Camisetas"/><button className="btn out" style={{flex:'none'}} onClick={async()=>{if(nc){await s.from('categories').insert({name:nc,slug:slug(nc)});setNc('');load()}}}>Adicionar</button></div></div>
  {list.map(p=><div className="box row" key={p.id} style={{alignItems:'center'}}><div style={{flex:3}}><b>{p.name}</b> {!p.active&&'(oculto)'}<br/>{brl(p.price)}{p.sale_price&&` → ${brl(p.sale_price)}`} · estoque {p.product_variants.reduce((a,v)=>a+v.stock,0)}</div><button className="btn out" onClick={()=>edit(p)}>Editar</button><button className="btn out" onClick={()=>del(p)}>Excluir</button></div>)}</>}
