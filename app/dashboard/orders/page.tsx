"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderList from "@/components/OrderList";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Package, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const { user, profile } = useAuth();
  const [orderCounts, setOrderCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  useEffect(() => {
    if (user) {
      loadOrderCounts();
    }
  }, [user, profile]);

  const loadOrderCounts = async () => {
    if (!user) return;

    try {
      let query = supabase.from("orders").select("status", { count: "exact" });

      // Filter based on role
      if (profile?.role === "merchant") {
        query = query.eq("merchant_id", user.id);
      } else {
        query = query.eq("client_id", user.id);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const counts = {
        all: count || 0,
        pending: data?.filter((o) => o.status === "pending").length || 0,
        confirmed: data?.filter((o) => o.status === "confirmed").length || 0,
        shipped: data?.filter((o) => o.status === "shipped").length || 0,
        delivered: data?.filter((o) => o.status === "delivered").length || 0,
        cancelled: data?.filter((o) => o.status === "cancelled").length || 0,
      };

      setOrderCounts(counts);
    } catch (error: any) {
      console.error("Failed to load order counts:", error);
    }
  };

  const getPageTitle = () =>
    profile?.role === "merchant" ? "Order Management" : "My Orders";

  const getPageDescription = () =>
    profile?.role === "merchant"
      ? "Manage and track all customer orders"
      : "Track your order history and status";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        {profile?.role === "merchant" ? (
          <Package className="h-8 w-8 text-primary" />
        ) : (
          <ShoppingBag className="h-8 w-8 text-primary" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        {[
          "all",
          "pending",
          "confirmed",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <Card key={status}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orderCounts[status as keyof typeof orderCounts]}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {[
                "all",
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => (
                <TabsTrigger key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)} (
                  {orderCounts[status as keyof typeof orderCounts]})
                </TabsTrigger>
              ))}
            </TabsList>

            {[
              "all",
              "pending",
              "confirmed",
              "shipped",
              "delivered",
              "cancelled",
            ].map((status) => (
              <TabsContent key={status} value={status} className="mt-6">
                <OrderList
                  statusFilter={
                    status === "all"
                      ? undefined
                      : (status as
                          | "pending"
                          | "confirmed"
                          | "shipped"
                          | "delivered"
                          | "cancelled")
                  }
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
