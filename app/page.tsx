"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Product, supabase } from "@/lib/supabase";
import { ROUTES } from "@/lib/routes";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const whatsappNumber = "221755227006";
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from("products").select("*");
      if (profile?.role === "merchant" && user?.id) {
        query = query.eq("user_id", user.id);
      }
      if (search) query = query.ilike("title", `%${search}%`);
      if (category !== "all") query = query.eq("category", category);

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, profile, user]);

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("name");
      if (!error && data) setCategories(["all", ...data.map((c) => c.name)]);
    };
    fetchCategories();
  }, []);

  // Real-time subscription for new products
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel("public:products")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  return (
    <main className="min-h-screen font-sans bg-background text-foreground">
      {/* HERO */}
      <section
        className="relative py-20 text-center px-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1664575602276-acd073f104c1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-blue-400/30 dark:bg-blue-900/30"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Votre marché local à Dakar
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Découvrez les meilleurs produits artisanaux et locaux directement
            depuis votre quartier.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="#catalogue"
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
            >
              Voir les produits
            </Link>
            <Link
              href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Monsieur`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Contacter sur WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* RECHERCHE + FILTRES */}
      <section id="catalogue" className="py-16 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "Toutes les catégories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {profile?.role === "merchant" && (
            <Link
              href={ROUTES.addProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              + Ajouter un produit
            </Link>
          )}
        </div>

        {/* GRID DES PRODUITS */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des produits...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun produit trouvé.{" "}
            {profile?.role === "merchant"
              ? "Commencez par ajouter votre premier produit !"
              : ""}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={() => fetchProducts()}
              />
            ))}
          </div>
        )}
      </section>

      {/* QUICK LINKS */}
      <section className="py-16 container mx-auto px-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Link
          href={ROUTES.cart}
          className="p-4 border rounded-lg hover:shadow-md transition"
        >
          <h3 className="font-semibold text-lg">Panier</h3>
          <p className="text-sm text-muted-foreground">
            Voir les articles ajoutés
          </p>
        </Link>
        <Link
          href="/faq"
          className="p-4 border rounded-lg hover:shadow-md transition"
        >
          <h3 className="font-semibold text-lg">FAQ</h3>
          <p className="text-sm text-muted-foreground">Questions fréquentes</p>
        </Link>
        <Link
          href="/contact"
          className="p-4 border rounded-lg hover:shadow-md transition"
        >
          <h3 className="font-semibold text-lg">Contact</h3>
          <p className="text-sm text-muted-foreground">
            Nous envoyer un message
          </p>
        </Link>
        <Link
          href="/about"
          className="p-4 border rounded-lg hover:shadow-md transition"
        >
          <h3 className="font-semibold text-lg">À propos</h3>
          <p className="text-sm text-muted-foreground">
            En savoir plus sur DakarMarket
          </p>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DakarMarket</h3>
            <p className="text-gray-400">
              Votre plateforme d'e-commerce local à Dakar.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">Email: contact@dakarmarket.sn</p>
            <p className="text-gray-400">Tel: +221 77 522 70 06</p>
            <div className="flex space-x-3 mt-2">
              <Link href="#" className="text-gray-400 hover:text-white">
                Facebook
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Twitter
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Instagram
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8 text-sm">
          &copy; {new Date().getFullYear()} DakarMarket. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}
