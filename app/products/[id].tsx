"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  merchant_id: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") || "";
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (productId) loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from<Product>("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      setProduct(data);

      if (data?.category) loadRelatedProducts(data.category, data.id);
    } catch (err) {
      console.error("Erreur chargement produit :", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (category: string, excludeId: string) => {
    try {
      const { data, error } = await supabase
        .from<Product>("products")
        .select("*")
        .eq("category", category)
        .neq("id", excludeId)
        .limit(8);

      if (error) throw error;
      setRelatedProducts(data || []);
    } catch (err) {
      console.error("Erreur chargement produits liés :", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center text-gray-500">
          Chargement...
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center text-gray-500">
          Produit introuvable.
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb / Title */}
        <h1 className="text-2xl font-bold mb-6">{product.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name}-${idx}`}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ))
            ) : (
              <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-400">
                Image indisponible
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-4">
            <p className="text-green-600 font-bold text-xl">${product.price}</p>
            <Badge variant="outline">{product.category}</Badge>

            {/* Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Couleur</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={
                        selectedColor === color ? "secondary" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Taille</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-gray-700">{product.description}</p>
            )}

            {/* Add to Cart */}
            <Button className="mt-4 w-full">Ajouter au panier</Button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Produits liés</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.id}`}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-40 w-full bg-gray-100">
                    {prod.images[0] ? (
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Image indisponible
                      </div>
                    )}
                  </div>
                  <div className="p-2 space-y-1">
                    <h3 className="text-sm font-semibold">{prod.name}</h3>
                    <p className="text-green-600 font-bold">${prod.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer fixe */}
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DakarMarket</h3>
            <p className="text-white/80">
              Votre plateforme d'e-commerce local à Dakar.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-white/80 hover:text-white transition"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white/80 hover:text-white transition"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-white/80 hover:text-white transition"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-white/80">Email: contact@dakarmarket.sn</p>
            <p className="text-white/80">Tel: +221 77 522 70 06</p>
            <div className="flex space-x-3 mt-2">
              <Link href="#" className="text-white/80 hover:text-white">
                Facebook
              </Link>
              <Link href="#" className="text-white/80 hover:text-white">
                Twitter
              </Link>
              <Link href="#" className="text-white/80 hover:text-white">
                Instagram
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-white/70 mt-8 text-sm">
          &copy; {new Date().getFullYear()} DakarMarket. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
