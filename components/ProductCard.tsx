'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heimport { Heart, ShoppingCart, MoveVertical as MoreVertical, CreditCard as Edit, Trash2 } from 'lucide-react'ard, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Product } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  onDelete?: () => void
  onEdit?: () => void
}

export default function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  const { user, profile } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && isClient) {
      checkIfFavorite()
    }
  }, [user, product.id])

  const isOwner = profile?.id === product.user_id
  const isClient = profile?.role === 'client'

  const checkIfFavorite = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('client_id', user.id)
        .eq('product_id', product.id)
        .single()

      setIsFavorite(!!data)
    } catch (error) {
      // Not a favorite or error occurred
      setIsFavorite(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user || !isClient) return

    setIsLoading(true)
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('client_id', user.id)
          .eq('product_id', product.id)
        
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await supabase
          .from('favorites')
          .insert([{ client_id: user.id, product_id: product.id }])
        
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error: any) {
      toast.error('Failed to update favorites')
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async () => {
    if (!user || !isClient) return

    setIsLoading(true)
    try {
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('client_id', user.id)
        .eq('product_id', product.id)
        .single()

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
      } else {
        await supabase
          .from('cart_items')
          .insert([{ 
            client_id: user.id, 
            product_id: product.id,
            quantity: 1
          }])
      }

      toast.success('Added to cart')
    } catch (error: any) {
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isOwner) return

    try {
      await supabase
        .from('products')
        .delete()
        .eq('id', product.id)
      
      toast.success('Product deleted successfully')
      onDelete?.()
    } catch (error: any) {
      toast.error('Failed to delete product')
    }
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square relative overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
        
        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isClient && (
            <Button
              size="icon"
              variant="secondary"
              onClick={toggleFavorite}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          )}
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {isClient && (
            <Button onClick={addToCart} disabled={isLoading} size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}