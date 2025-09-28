'use client'

import { useState } from "react"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/supabase";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  role: "merchant" | "client";
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ProductCard({ product, role, onEdit, onDelete }: ProductCardProps) {
  const images = product.images || [];
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);

    const message = `Hello, I am interested in your product:\n
Title: ${product.title}\n
Description: ${product.description}\n
Price: $${product.price?.toFixed(2)}\n
Category: ${product.category}\n
Link: ${window.location.href}`;

    const whatsappLink = `https://wa.me/${product.user_id}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");

    toast.success("Product added to cart and ready to send via WhatsApp!");
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm flex flex-col">
      {/* Images */}
      <div className="relative w-full h-64 bg-gray-50 overflow-hidden">
        {images.length > 0 ? (
          <Image
            src={images[0]} // Affiche la première image
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg">{product.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
          <p className="mt-2 font-semibold">${product.price?.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Category: {product.category}</p>
        </div>

        {role === "merchant" ? (
          <div className="mt-2 flex justify-end space-x-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            className="mt-4"
            disabled={added}
          >
            {added ? "Added to Cart" : "Add to Cart / Send via WhatsApp"}
          </Button>
        )}
      </div>
    </div>
  );
}
