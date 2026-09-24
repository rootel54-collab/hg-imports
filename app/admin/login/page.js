'use client'
import {useState} from 'react'
import Image from 'next/image'
import {sb} from '@/lib/browser'
export default function Login(){
 const [e,setE]=useState(''),[p,setP]=useState(''),[m,setM]=useState('')
 const go=async ev=>{ev.preventDefault();const {error}=await sb().auth.signInWithPassword({email:e,password:p});if(error)return setM(error.message);location.href='/admin'}
 return <form onSubmit={go} style={{maxWidth:380,margin:'60px auto',padding:16}}><Image src="/logo.jpg" alt="HG Imports" width={1600} height={1362} style={{width:'70%',height:'auto',margin:'0 auto 20px',borderRadius:16}}/>
  <label>E-mail</label><input type="email" value={e} onChange={x=>setE(x.target.value)} required/><label>Senha</label><input type="password" value={p} onChange={x=>setP(x.target.value)} required/>
  <button className="btn blk" style={{marginTop:16}}>ENTRAR</button><p style={{color:'#e11d48',marginTop:10}}>{m}</p></form>}
