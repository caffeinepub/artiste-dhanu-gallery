import { Button } from "@/components/ui/button";
import { Home, Settings, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import type { AppPage } from "../App";

interface HeaderProps {
  page: AppPage;
  navigate: (p: AppPage) => void;
}

export default function Header({ page, navigate }: HeaderProps) {
  const isAdmin = page.name === "adminLogin" || page.name === "adminDashboard";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-xs">
      {/* Thin terracotta top accent bar */}
      <div className="h-[3px] bg-primary w-full" />

      <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          data-ocid="nav.link"
          onClick={() => navigate({ name: "storefront" })}
          className="flex flex-col items-start group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="font-display text-2xl font-bold leading-none tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            Artiste Dhanu
          </span>
          <span className="font-serif text-[10px] text-muted-foreground tracking-[0.2em] uppercase mt-0.5">
            Gallery · Handcrafted Indian Art
          </span>
        </motion.button>

        {/* Nav */}
        <nav className="flex items-center gap-1.5">
          {!isAdmin && (
            <Button
              data-ocid="nav.storefront.link"
              variant={page.name === "storefront" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate({ name: "storefront" })}
              className="hidden sm:flex items-center gap-1.5 font-sans font-medium"
            >
              <Home size={14} />
              Shop
            </Button>
          )}

          {isAdmin ? (
            <Button
              data-ocid="nav.shop.link"
              variant="ghost"
              size="sm"
              onClick={() => navigate({ name: "storefront" })}
              className="flex items-center gap-1.5 font-sans"
            >
              <ShoppingBag size={14} />
              Back to Shop
            </Button>
          ) : (
            <Button
              data-ocid="nav.admin.link"
              variant="ghost"
              size="sm"
              onClick={() => navigate({ name: "adminLogin" })}
              className="flex items-center gap-1.5 text-muted-foreground font-sans hover:text-foreground"
            >
              <Settings size={14} />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
