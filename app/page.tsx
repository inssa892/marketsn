"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  category: string;
}

interface Merchant {
  id: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
}

interface Category {
  name: string;
  count: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalMerchants: 0,
    totalOrders: 0
  });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Load featured products
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
          .limit(8)
        .limit(6)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    };
      // Load top merchants

    const fetchMerchants = async () => {
      const { data, error } = await supabase
          .select("id, display_name, email, avatar_url")
        .select("id, display_name as name, avatar_url as image_url")
        .eq("role", "merchant")
        .limit(6);
      if (error) throw error;
      return data || [];
    };
      // Load categories with product counts

        const { data: products, error } = await supabase
      const { data, error } = await supabase
          .select("category");
        .limit(6);
        
        const categoryCount: { [key: string]: number } = {};
        products?.forEach(product => {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });
        
        return Object.entries(categoryCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
      return data || [];
    };
      // Load stats
      const fetchStats = async () => {
        const [
          { count: productsCount },
          { count: merchantsCount },
          { count: ordersCount }
        ] = await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "merchant"),
          supabase.from("orders").select("*", { count: "exact", head: true })
        ]);
        
        return {
          totalProducts: productsCount || 0,
          totalMerchants: merchantsCount || 0,
          totalOrders: ordersCount || 0
        };
      }
    };
      const [productsData, merchantsData, categoriesData, statsData] = await Promise.all([
        fetchProducts(),
        fetchMerchants(),
        fetchCategories(),
        fetchStats()
      ]);
      
      setProducts(productsData);
      setMerchants(merchantsData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DakarMarket</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard/products" className="text-sm font-medium hover:text-primary">
              Produits
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              À propos
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
            >
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link
              href="/register"
            >
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Votre marché local à Dakar
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Découvrez les meilleurs produits artisanaux et locaux directement
              depuis votre quartier. Connectez-vous avec les marchands locaux.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link href="/dashboard/products">
                <Button size="lg" className="text-lg px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Découvrir les produits
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Users className="mr-2 h-5 w-5" />
                  Devenir marchand
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalProducts}</div>
              <div className="text-sm text-muted-foreground">Produits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalMerchants}</div>
              <div className="text-sm text-muted-foreground">Marchands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalOrders}</div>
              <div className="text-sm text-muted-foreground">Commandes</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos produits phares
          </h2>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Aucun produit disponible pour le moment.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="group overflow-hidden hover:shadow-lg transition-all">
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
                          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        {product.price.toLocaleString()} FCFA
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/dashboard/products">
              <Button size="lg" variant="outline">
                Voir tous les produits
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Merchants */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Marchands populaires
          </h2>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : merchants.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Aucun marchand trouvé.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {merchants.map((merchant) => (
                <motion.div
                  key={merchant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-muted">
                        {merchant.avatar_url ? (
                          <Image
                            src={merchant.avatar_url}
                            alt={merchant.display_name || merchant.email}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">
                        {merchant.display_name || merchant.email.split('@')[0]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Marchand vérifié
                      </p>
                      <div className="flex items-center justify-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Catégories populaires
          </h2>
          {loading ? (
            <div className="flex flex-wrap justify-center gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Aucune catégorie disponible.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge variant="secondary" className="px-6 py-2 text-sm">
                    {category.name} ({category.count})
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">DakarMarket</span>
            </div>
            <p className="text-muted-foreground">
              Votre plateforme d'e-commerce local à Dakar. Connectant marchands et clients.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/products" className="text-muted-foreground hover:text-foreground transition">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-muted-foreground hover:text-foreground transition">
                  Devenir marchand
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition">
                  À propos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition">
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/221755227006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>© 2025 DakarMarket. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
