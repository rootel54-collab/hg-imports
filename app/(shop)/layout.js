import {getSettings} from '@/lib/db'
import {Store} from '@/components/Store'
export const revalidate=60
export default async function L({children}){return <Store s={await getSettings()}>{children}</Store>}
