"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Order {
  id: string;
  product_id: string;
  client_id: string;
  merchant_id: string;
  quantity: number;
  total: number;
  status: string;
  created_at: string;
}

interface OrderListProps {
  statusFilter?: "all" | "pending" | "confirmed" | "shipped" | "delivered";
}

import { useAuth } from "@/hooks/useAuth";

export default function OrderList({ statusFilter = "all" }: OrderListProps) {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      loadOrders();
    }
  }, [user, profile, statusFilter]);

  const loadOrders = async () => {
    if (!user || !profile) return;

    try {
      let query = supabase.from("orders").select("*");

      // Role-based filtering
      if (profile.role === "merchant") {
        query = query.eq("merchant_id", user.id);
      } else {
        query = query.eq("client_id", user.id);
      }

      // Status filter
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      setOrders(data || []);
    } catch (error: any) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="p-4 border rounded-lg">
          <p>
            Order #{order.id} — {order.quantity} item(s) — $
            {order.total.toFixed(2)}
          </p>
          <p>
            Status: <strong>{order.status}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
