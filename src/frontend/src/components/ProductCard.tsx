import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";
import { formatPrice } from "../data/sampleProducts";

interface ProductCardProps {
  product: Product;
  index: number;
  onClick: () => void;
}

export default function ProductCard({
  product,
  index,
  onClick,
}: ProductCardProps) {
  return (
    <motion.article
      data-ocid={`products.item.${index}`}
      className="group cursor-pointer bg-card rounded-xl overflow-hidden border border-border card-accent-hover hover:shadow-product-hover transition-all duration-300"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: (index - 1) * 0.08,
        ease: "easeOut",
      }}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      {/* Image container */}
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* HANDMADE badge — top left */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-sans font-bold uppercase tracking-widest bg-primary/90 text-primary-foreground backdrop-blur-sm">
            Handmade
          </span>
        </div>

        {/* Out of stock overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <Badge variant="secondary" className="font-sans font-semibold">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* View details overlay — slides up on hover */}
        {product.available && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-primary/95 backdrop-blur-sm px-4 py-3 flex items-center justify-center gap-2">
              <span className="font-sans text-sm font-semibold text-primary-foreground tracking-wide">
                View Details
              </span>
              <ArrowRight size={14} className="text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground font-serif italic mt-1 line-clamp-2 leading-snug">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-display text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.available && (
            <span className="text-xs text-muted-foreground font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              tap to order →
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
