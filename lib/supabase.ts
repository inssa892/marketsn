import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const supabase = createClientComponentClient<Database>()

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']