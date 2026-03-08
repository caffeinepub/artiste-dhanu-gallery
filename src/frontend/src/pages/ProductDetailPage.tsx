import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, ShoppingCart, Truck } from "lucide-react";
import { motion } from "motion/react";
import type { AppPage } from "../App";
import { formatPrice, sampleProducts } from "../data/sampleProducts";
import { useGetProduct } from "../hooks/useQueries";

interface ProductDetailPageProps {
  productId: bigint;
  navigate: (p: AppPage) => void;
}

export default function ProductDetailPage({
  productId,
  navigate,
}: ProductDetailPageProps) {
  const { data: product, isLoading } = useGetProduct(productId);

  // Fall back to sample data while loading/if not found
  const displayProduct =
    product ?? sampleProducts.find((p) => p.id === productId);

  const handleOrderNow = () => {
    if (!displayProduct) return;
    navigate({
      name: "order",
      productId: displayProduct.id,
      productName: displayProduct.name,
      productPrice: displayProduct.price,
    });
  };

  return (
    <div
      data-ocid="product.page"
      className="container max-w-5xl mx-auto px-4 py-10"
    >
      {/* Back */}
      <Button
        data-ocid="product.nav.link"
        variant="ghost"
        size="sm"
        onClick={() => navigate({ name: "storefront" })}
        className="mb-8 flex items-center gap-1.5 text-muted-foreground font-sans hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to Shop
      </Button>

      {isLoading && !displayProduct ? (
        <div
          data-ocid="product.loading_state"
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ) : displayProduct ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-craft-lg bg-muted">
              <img
                src={displayProduct.imageUrl}
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* HANDMADE badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-sans font-bold uppercase tracking-widest bg-primary/90 text-primary-foreground shadow-craft">
                Handmade
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Availability indicator */}
            {!displayProduct.available && (
              <Badge variant="secondary" className="mb-3 self-start">
                Out of Stock
              </Badge>
            )}

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-2">
              {displayProduct.name}
            </h1>

            {/* Price — prominent */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display text-4xl font-bold text-primary">
                {formatPrice(displayProduct.price)}
              </span>
              <span className="font-serif text-muted-foreground text-sm italic">
                incl. all taxes
              </span>
            </div>

            {/* Decorative divider */}
            <div className="divider-ornament mb-6">
              <span className="font-serif italic text-muted-foreground text-xs">
                ✦ artisan details ✦
              </span>
            </div>

            <p className="font-serif text-muted-foreground text-lg leading-relaxed mb-8">
              {displayProduct.description}
            </p>

            {/* Features */}
            <div className="space-y-2.5 mb-8 bg-secondary/40 rounded-xl p-4 border border-border">
              {[
                { icon: CheckCircle, text: "100% Handmade with care" },
                { icon: Truck, text: "Ships via India Post across India" },
                { icon: CheckCircle, text: "Unique, one-of-a-kind piece" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-sm text-foreground"
                >
                  <Icon size={15} className="text-primary flex-shrink-0" />
                  <span className="font-sans">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-auto">
              {displayProduct.available ? (
                <Button
                  data-ocid="product.order.primary_button"
                  size="lg"
                  className="w-full font-sans font-semibold flex items-center justify-center gap-2 text-base py-6 shadow-craft"
                  onClick={handleOrderNow}
                >
                  <ShoppingCart size={18} />
                  Order Now
                </Button>
              ) : (
                <Button
                  data-ocid="product.order.primary_button"
                  size="lg"
                  disabled
                  className="w-full font-sans font-semibold py-6"
                >
                  Out of Stock
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-3 font-sans text-center">
                We'll collect your postal address at checkout to ship via India
                Post.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div data-ocid="product.error_state" className="text-center py-24">
          <p className="font-serif text-muted-foreground text-xl mb-6">
            Product not found.
          </p>
          <Button
            data-ocid="product.back.link"
            variant="default"
            size="lg"
            onClick={() => navigate({ name: "storefront" })}
          >
            Browse all products
          </Button>
        </div>
      )}
    </div>
  );
}
