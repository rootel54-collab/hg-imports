'use client'
import {useEffect,useState} from 'react'
import {useStore} from '@/components/Store'
import {Card} from '@/components/Card'
import {sb} from '@/lib/browser'
export default function Fav(){
 const {favs}=useStore(),[l,setL]=useState([]),[done,setDone]=useState(false)
 useEffect(()=>{if(!favs.length){setL([]);return setDone(true)}
  sb().from('products').select('*,product_images(url,position),product_variants(size,color,stock),categories(name,slug)').in('id',favs).eq('active',true).then(({data})=>{setL(data||[]);setDone(true)})},[favs])
 return <div className="wrap sec"><div className="sh"><h2>Meus favoritos</h2></div>{l.length?<div className="grid">{l.map(p=><Card key={p.id} p={p}/>)}</div>:done&&<p>Você ainda não favoritou nada. Toque no 🤍 em qualquer produto.</p>}</div>}
