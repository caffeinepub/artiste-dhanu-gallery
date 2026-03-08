import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Leaf, ShieldCheck, Truck } from "lucide-react";
import { motion } from "motion/react";
import type { AppPage } from "../App";
import ProductCard from "../components/ProductCard";
import { sampleProducts } from "../data/sampleProducts";
import { useListProducts } from "../hooks/useQueries";

interface StorefrontPageProps {
  navigate: (p: AppPage) => void;
}

export default function StorefrontPage({ navigate }: StorefrontPageProps) {
  const { data: products, isLoading } = useListProducts();

  const displayProducts =
    products && products.length > 0 ? products : sampleProducts;

  return (
    <div data-ocid="storefront.page">
      {/* ── Hero Banner ── */}
      <section
        data-ocid="storefront.section"
        className="relative overflow-hidden"
        style={{ minHeight: "540px" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/generated/hero-banner.dim_1400x600.jpg')`,
          }}
        />
        {/* Multi-layer gradient for depth and legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

        {/* Content */}
        <div
          className="relative container max-w-6xl mx-auto px-4 flex flex-col justify-center"
          style={{ minHeight: "540px" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="font-sans text-[11px] text-white/60 tracking-[0.3em] uppercase mb-4">
              ✦ Handcrafted Indian Artisan Goods ✦
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] mb-3">
              Artiste Dhanu
            </h1>
            <h2 className="font-serif font-normal text-2xl sm:text-3xl text-white/75 italic mb-6 leading-snug">
              Gallery of Handmade Wonders
            </h2>
            <p className="font-serif text-white/75 text-lg max-w-lg mb-8 leading-relaxed">
              Every piece is born from passion — shaped, stitched, carved, and
              poured by hand. Own a piece of art that carries a soul.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                data-ocid="storefront.shop.primary_button"
                size="lg"
                className="font-sans font-semibold text-base px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-craft-lg"
                onClick={() => {
                  const el = document.getElementById("products-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Shop Now
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.8,
              ease: "easeInOut",
            }}
          >
            <ChevronDown size={22} className="text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="container max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14">
            {[
              { icon: Leaf, label: "100% Handmade" },
              { icon: Truck, label: "India Post Delivery" },
              { icon: ShieldCheck, label: "Quality Assured" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 text-muted-foreground"
              >
                <Icon size={16} className="text-primary flex-shrink-0" />
                <span className="font-sans text-sm font-semibold tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section
        id="products-section"
        className="container max-w-6xl mx-auto px-4 py-16"
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-3">
            ✦ Handpicked for you ✦
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our Collection
          </h2>
          <div className="divider-ornament max-w-xs mx-auto">
            <span className="font-serif italic text-muted-foreground text-sm">
              each piece, uniquely yours
            </span>
          </div>
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="products.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div
            data-ocid="products.list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayProducts.map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i + 1}
                onClick={() => navigate({ name: "product", id: product.id })}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── About Section ── */}
      <section className="bg-secondary/25 border-t border-border">
        <div className="container max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.25em] mb-4">
              ✦ Our Story ✦
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5 leading-tight">
              Made with heart,
              <br />
              <em className="font-serif font-normal text-2xl sm:text-3xl">
                shipped with care
              </em>
            </h2>
            <p className="font-serif text-muted-foreground text-lg leading-relaxed mb-4">
              At Artiste Dhanu Gallery, each product is a labour of love. We use
              traditional Indian techniques with natural materials, creating
              pieces that are as unique as the hands that craft them.
            </p>
            <p className="font-serif text-muted-foreground text-base leading-relaxed mb-6">
              From clay pots shaped on the wheel to silk threads pulled through
              linen canvas — every item is made to order with full attention and
              care.
            </p>
            <p className="font-sans text-sm text-muted-foreground flex items-center gap-2 border-l-2 border-primary pl-4">
              📮 All orders shipped via{" "}
              <strong className="text-foreground">India Post</strong> —
              reliable, affordable, reaching every corner of India.
            </p>
          </motion.div>
          <motion.div
            className="aspect-video rounded-2xl overflow-hidden shadow-craft-lg"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img
              src="/assets/generated/hero-banner.dim_1400x600.jpg"
              alt="Handmade crafts at Artiste Dhanu Gallery"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
