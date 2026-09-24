export const brl=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
export function pricing(p){const on=p.sale_price!=null&&(!p.sale_start||new Date(p.sale_start)<=Date.now())&&(!p.sale_end||new Date(p.sale_end)>Date.now());return{on,price:on?+p.sale_price:+p.price,old:+p.price,off:on?Math.round((1-p.sale_price/p.price)*100):0}}
export const stockOf=p=>(p.product_variants||[]).reduce((a,v)=>a+v.stock,0)
