"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import VoiceAssistant from "@/components/VoiceAssistant";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
}
interface Merchant {
  id: string;
  name: string;
  image_url?: string;
}
interface Category {
  id: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Vérifier session utilisateur
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  // Charger les données uniquement si l’utilisateur est connecté
  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(6)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    };

    const fetchMerchants = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name as name, avatar_url as image_url")
        .eq("role", "merchant")
        .limit(6);
      if (error) throw error;
      return data || [];
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .limit(6);
      if (error) throw error;
      return data || [];
    };

    const loadAll = async () => {
      try {
        const [productsData, merchantsData, categoriesData] = await Promise.all(
          [fetchProducts(), fetchMerchants(), fetchCategories()]
        );
        setProducts(productsData);
        setMerchants(merchantsData);
        setCategories(categoriesData);
        toast.success("Données chargées avec succès");
      } catch (err) {
        console.error(err);
        toast.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [user]);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        Vérification de session...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-green-600 dark:text-green-400"
          >
            DakarMarket
          </Link>
          <nav className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
            <Link
              href="/login"
              className="text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm px-3 py-1 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition"
            >
              Créer un compte
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-yellow-400/10 to-green-500/10 py-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Votre marché local à Dakar
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Découvrez les meilleurs produits artisanaux et locaux directement
          depuis votre quartier.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/products"
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
          >
            Voir les produits
          </Link>
          <a
            href="https://wa.me/221755227006?text=Bonjour%20Monsieur"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            WhatsApp
          </a>
        </div>
      </section>

      {/* Produits */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos produits phares
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">
              Chargement des produits...
            </p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">
              Aucun produit disponible pour le moment.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-xl transition-transform transform hover:scale-105"
                >
                  <img
                    src={product.image_url || "/placeholder.png"}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-green-600 font-bold mt-1">
                    ${product.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Marchands */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Boutiques populaires
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">
              Chargement des marchands...
            </p>
          ) : merchants.length === 0 ? (
            <p className="text-center text-gray-500">Aucun marchand trouvé.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {merchants.map((merchant) => (
                <div
                  key={merchant.id}
                  className="border rounded-lg p-4 hover:shadow-xl transition flex flex-col items-center"
                >
                  <img
                    src={merchant.image_url || "/default-avatar.png"}
                    alt={merchant.name}
                    className="w-24 h-24 object-cover rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">{merchant.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Catégories populaires
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">
              Chargement des catégories...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500">
              Aucune catégorie disponible.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Assistant vocal */}
      <VoiceAssistant />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DakarMarket</h3>
            <p className="text-gray-300">
              Votre plateforme d'e-commerce local à Dakar.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 DakarMarket. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
