'use client'
import Link from 'next/link'
import Image from 'next/image'
import {sb} from '@/lib/browser'
const L=[['Dashboard','/admin'],['Produtos','/admin/produtos'],['Página inicial','/admin/home'],['Pedidos','/admin/pedidos'],['Configurações','/admin/config'],['Ver loja','/']]
export default function Layout({children}){
 const a={display:'block',padding:'14px 16px',color:'#fff',fontWeight:600,fontSize:16,borderTop:'1px solid #16214d'}
 return <><nav style={{background:'#050816'}}>
  <div style={{padding:'12px 16px'}}><Image src="/logo.jpg" alt="HG Imports" width={1600} height={1362} style={{height:56,width:'auto',borderRadius:8}}/></div>
  {L.map(([t,h])=><Link key={h} href={h} style={a}>{t}</Link>)}
  <button onClick={async()=>{await sb().auth.signOut();location.href='/admin/login'}} style={{...a,width:'100%',textAlign:'left',background:'none',border:0,borderTop:'1px solid #16214d',cursor:'pointer',color:'#ff8a8a',fontFamily:'inherit'}}>Sair</button>
 </nav><div className="adm">{children}</div></>}
