'use client'
import Link from 'next/link'
import Image from 'next/image'
import {sb} from '@/lib/browser'
export default function L({children}){
 return <><nav className="adm" style={{maxWidth:'none'}}><Image src="/logo.jpg" alt="HG" width={1600} height={1362} style={{height:40,width:'auto'}}/>
  <Link href="/admin">Dashboard</Link><Link href="/admin/produtos">Produtos</Link><Link href="/admin/home">Página inicial</Link><Link href="/admin/pedidos">Pedidos</Link><Link href="/admin/config">Configurações</Link><Link href="/" style={{marginLeft:'auto'}}>Ver loja</Link>
  <button onClick={async()=>{await sb().auth.signOut();location.href='/admin/login'}} style={{background:'none',border:0,color:'#fff',cursor:'pointer'}}>Sair</button></nav><div className="adm">{children}</div></>}
