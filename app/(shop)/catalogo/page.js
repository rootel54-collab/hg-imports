import {db,PRODUCT_SELECT} from '@/lib/db'
import Catalog from '@/components/Catalog'
export const revalidate=60
export const metadata={title:'Catálogo | HG Imports'}
export default async function Page({searchParams}){
 const {data}=await db().from('products').select(PRODUCT_SELECT).eq('active',true)
 return <div className="wrap sec"><div className="sh"><h2>Catálogo</h2></div><Catalog products={data||[]} init={searchParams}/></div>}
