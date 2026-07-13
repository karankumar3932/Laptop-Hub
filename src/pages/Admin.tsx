import { useState, useEffect } from "react";
import { Lock, Package, LogOut, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSWORD = "admin123";

interface OrderWithItems {
  id: string;
  order_id: string;
  total: number;
  status: string;
  created_at: string;
  user_id: string;
  order_items: {
    laptop_name: string;
    laptop_brand: string;
    laptop_price: number;
    quantity: number;
  }[];
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    const fetchOrders = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      setOrders((data as OrderWithItems[]) || []);
      setLoading(false);
    };
    fetchOrders();
  }, [authenticated]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-center">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-center font-heading text-xl font-bold text-foreground">Admin Access</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90">
            Login
          </button>
        </form>
        <Link to="/" className="mt-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin — All Orders</h1>
          <button onClick={() => setAuthenticated(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="mt-8 text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-heading font-semibold text-foreground">#{order.order_id}</span>
                  </div>
                  <span className="text-muted-foreground">{formatDate(order.created_at)}</span>
                  <span className="rounded-full bg-success/20 px-3 py-0.5 text-xs font-medium text-success capitalize">{order.status}</span>
                  <span className="font-heading font-bold text-foreground">₹{Number(order.total).toLocaleString()}</span>
                </div>
                <div className="mt-3 divide-y divide-border text-sm">
                  {order.order_items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 text-muted-foreground">
                      <span>{item.laptop_name} ({item.laptop_brand}) × {item.quantity}</span>
                      <span>₹{(item.laptop_price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
