import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import OrderFormPage from "./pages/OrderFormPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import StorefrontPage from "./pages/StorefrontPage";

export type AppPage =
  | { name: "storefront" }
  | { name: "product"; id: bigint }
  | {
      name: "order";
      productId: bigint;
      productName: string;
      productPrice: bigint;
    }
  | { name: "orderSuccess"; orderId: bigint }
  | { name: "adminLogin" }
  | { name: "adminDashboard" };

export default function App() {
  const [page, setPage] = useState<AppPage>({ name: "storefront" });

  const navigate = (p: AppPage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col grain-bg">
      <Header page={page} navigate={navigate} />

      <main className="flex-1">
        {page.name === "storefront" && <StorefrontPage navigate={navigate} />}
        {page.name === "product" && (
          <ProductDetailPage productId={page.id} navigate={navigate} />
        )}
        {page.name === "order" && (
          <OrderFormPage
            productId={page.productId}
            productName={page.productName}
            productPrice={page.productPrice}
            navigate={navigate}
          />
        )}
        {page.name === "orderSuccess" && (
          <OrderSuccessPage orderId={page.orderId} navigate={navigate} />
        )}
        {page.name === "adminLogin" && <AdminLoginPage navigate={navigate} />}
        {page.name === "adminDashboard" && (
          <AdminDashboardPage navigate={navigate} />
        )}
      </main>

      <Footer navigate={navigate} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
