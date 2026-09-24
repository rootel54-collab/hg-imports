'use client'
import {createContext,useContext,useEffect,useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
const C=createContext()
export const useStore=()=>useContext(C)
export const fmtWa=d=>`+${d.slice(0,2)} ${d.slice(2,4)} ${d.slice(4,9)}-${d.slice(9)}`
export function Store({s,children}){
 const [cart,setCart]=useState([]),[favs,setFavs]=useState([]),[ready,setReady]=useState(false),[menu,setMenu]=useState(false),[dark,setDark]=useState(false)
 useEffect(()=>{try{setCart(JSON.parse(localStorage.cart||'[]'));setFavs(JSON.parse(localStorage.favs||'[]'))}catch{}setReady(true)},[])
 useEffect(()=>{if(ready){localStorage.cart=JSON.stringify(cart);localStorage.favs=JSON.stringify(favs)}},[cart,favs,ready])
 const k=i=>i.id+'|'+i.size+'|'+i.color
 const add=i=>setCart(c=>c.some(x=>k(x)==k(i))?c.map(x=>k(x)==k(i)?{...x,qty:x.qty+i.qty}:x):[...c,i])
 const qty=(i,d)=>setCart(c=>c.map(x=>k(x)==k(i)?{...x,qty:Math.max(1,x.qty+d)}:x))
 const del=i=>setCart(c=>c.filter(x=>k(x)!=k(i)))
 const toggleFav=id=>setFavs(f=>f.includes(id)?f.filter(x=>x!=id):[...f,id])
 useEffect(()=>{if(s.dark_mode==='off')delete document.documentElement.dataset.theme;setDark(document.documentElement.dataset.theme=='dark')},[s.dark_mode])
 const toggle=()=>{const n=dark?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.theme=n}catch{};setDark(!dark)}
 const count=cart.reduce((a,i)=>a+i.qty,0)
 const nav=[['Início','/'],['Novidades','/catalogo?f=novo'],['Masculino','/catalogo?g=masculino'],['Feminino','/catalogo?g=feminino'],['Categorias','/catalogo'],['Promoções','/catalogo?f=promo']]
 const st={'--blue':s.color_primary||undefined,'--cyan':s.color_accent||undefined}
 return <C.Provider value={{s,cart,favs,add,qty,del,toggleFav,clear:()=>setCart([])}}><div style={st}>
  <header><div className="wrap bar">
   <Link href="/" aria-label={s.store_name}><Image src={s.logo_url} alt={s.store_name} width={1600} height={1362} priority style={{height:54,width:'auto'}}/></Link>
   <nav className={menu?'open':''} onClick={()=>setMenu(false)}>{nav.map(([n,h])=><Link key={n} href={h}>{n}</Link>)}<a href={s.instagram} target="_blank" rel="noopener">Instagram</a></nav>
   <form action="/catalogo"><input name="q" placeholder="Buscar produtos" aria-label="Buscar"/></form>
   <Link className="ic" href="/favoritos" aria-label="Favoritos">🤍{favs.length>0&&<b>{favs.length}</b>}</Link>
   <Link className="ic" href="/carrinho" aria-label="Carrinho">🛍️{count>0&&<b>{count}</b>}</Link>
   {s.dark_mode!=='off'&&<button className="ic" style={{background:'none',border:0,color:'#fff',cursor:'pointer'}} onClick={toggle} aria-label="Modo escuro">{dark?'☀️':'🌙'}</button>}
   <button className="burger" onClick={()=>setMenu(!menu)} aria-label="Menu">{menu?'✕':'☰'}</button>
  </div></header>
  <main>{children}</main>
  <footer><div className="wrap fg">
   <div><Image src={s.logo_url} alt={s.store_name} width={1600} height={1362} style={{height:90,width:'auto'}}/><p>{s.footer_text}</p></div>
   <div><b>Contato</b><p><a href={`https://wa.me/${s.whatsapp}`}>WhatsApp {fmtWa(s.whatsapp)}</a></p><p><a href={s.instagram} target="_blank" rel="noopener">Instagram {s.instagram_handle}</a></p>{s.email&&<p><a href={`mailto:${s.email}`}>E-mail {s.email}</a></p>}{s.address&&<p>{s.address}</p>}{s.hours&&<p>{s.hours}</p>}</div>
   <div><b>Links úteis</b><p><Link href="/catalogo">Catálogo</Link></p><p><Link href="/favoritos">Meus favoritos</Link></p><p><Link href="/carrinho">Carrinho</Link></p><p><Link href="/politica/privacidade">Política de privacidade</Link></p><p><Link href="/politica/termos">Termos de uso</Link></p></div>
  </div><p className="wrap" style={{marginTop:24}}>© {new Date().getFullYear()} {s.store_name}</p></footer>
  <a className="wafl" href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>
 </div></C.Provider>}
