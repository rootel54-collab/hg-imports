import './globals.css'
import {Bowlby_One,Inter} from 'next/font/google'
const d=Bowlby_One({weight:'400',subsets:['latin'],variable:'--display'}),b=Inter({subsets:['latin'],variable:'--body'})
export const metadata={title:'HG Imports',description:'Streetwear e roupas importadas — HG Imports',metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')}
export default function L({children}){return <html lang="pt-BR" suppressHydrationWarning className={`${d.variable} ${b.variable}`}><head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.theme;if(t)document.documentElement.dataset.theme=t}catch(e){}"}}/></head><body>{children}</body></html>}
