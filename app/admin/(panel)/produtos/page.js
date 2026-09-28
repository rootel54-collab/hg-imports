'use client'
import {useEffect,useState} from 'react'
import {sb,upload} from '@/lib/browser'
import {brl} from '@/lib/util'
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const shrink=file=>new Promise(res=>{const img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{const r=Math.min(1,1600/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*r);c.height=Math.round(img.height*r);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>res(b?new File([b],file.name.replace(/\.\w+$/,'')+'.jpg',{type:'image/jpeg'}):file),'image/jpeg',0.82)};img.onerror=()=>{URL.revokeObjectURL(u);res(file)};img.src=u})
const V0={size:'',color:'',stock:''}
const E={name:'',description:'',price:'',sale_price:'',sale_start:'',sale_end:'',category_id:'',gender:'unissex',tags:'',is_new:false,is_bestseller:false,is_featured:false,active:true,variants:[V0],images:[]}
export default function Produtos(){
 const s=sb(),[list,setList]=useState([]),[cats,setCats]=useState([]),[f,setF]=useState(null),[m,setM]=useState(''),[nc,setNc]=useState('')
 const load=async()=>{const [a,b]=await Promise.all([s.from('products').select('*,product_images(id,url,position),product_variants(size,color,stock)').order('created_at',{ascending:false}),s.from('categories').select('*').order('name')]);setList(a.data||[]);setCats(b.data||[])}
 useEffect(()=>{load()},[])
 const edit=p=>{setM('');setF({...p,sale_price:p.sale_price??'',sale_start:p.sale_start?.slice(0,16)||'',sale_end:p.sale_end?.slice(0,16)||'',category_id:p.category_id||'',tags:(p.tags||[]).join(', '),variants:p.product_variants.length?p.product_variants.map(v=>({size:v.size||'',color:v.color||'',stock:v.stock})):[V0],images:p.product_images})}
 const set=(k,v)=>setF(x=>({...x,[k]:v}))
