"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  merchant_id: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || ""
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory]);

  // --- Charge les catégories uniques
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from<Product>("products")
        .select("category");

      if (error) throw error;

      // Filtrer les doublons côté client
      const uniqueCategories = Array.from(
        new Set(data?.map((item: Product) => item.category))
      );

      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Erreur chargement catégories :", err);
    }
  };

  // --- Charge les produits selon recherche / catégorie
  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from<Product>("products").select("*");

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (selectedCategory && selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-md">
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="ml-2">
              Rechercher
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <Badge
              variant={selectedCategory === "All" ? "secondary" : "outline"}
              onClick={() => setSelectedCategory("All")}
              className="cursor-pointer"
            >
              Tous
            </Badge>
            {categories.map((cat: string) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "secondary" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className="cursor-pointer"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-12">Chargement...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Aucun produit trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 w-full bg-gray-100">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Image indisponible
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-green-600 font-bold">${product.price}</p>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer fixe en bas */}
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
