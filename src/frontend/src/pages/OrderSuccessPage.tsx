import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import type { AppPage } from "../App";

interface OrderSuccessPageProps {
  orderId: bigint;
  navigate: (p: AppPage) => void;
}

export default function OrderSuccessPage({
  orderId,
  navigate,
}: OrderSuccessPageProps) {
  return (
    <div
      data-ocid="order.success_state"
      className="container max-w-xl mx-auto px-4 py-20 flex flex-col items-center text-center"
    >
      {/* Celebratory checkmark */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-primary/12 border-2 border-primary/30 flex items-center justify-center shadow-craft">
          <CheckCircle className="text-primary" size={46} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.55 }}
        className="space-y-6 w-full"
      >
        {/* Ornament line */}
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <span className="text-primary text-lg">✦</span>
          <span className="font-serif italic text-sm text-muted-foreground">
            order confirmed
          </span>
          <span className="text-primary text-lg">✦</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          Thank you!
        </h1>
        <p className="font-serif text-muted-foreground text-xl leading-relaxed max-w-md mx-auto">
          Your order is confirmed. We'll carefully pack and ship it with love
          via <strong className="text-foreground">India Post</strong>.
        </p>

        {/* Order ID */}
        <div className="bg-secondary/50 border border-border rounded-2xl p-6 shadow-xs">
          <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.25em] mb-2 flex items-center gap-1.5 justify-center">
            <Package size={12} />
            Order Reference
          </p>
          <p className="font-display text-3xl font-bold text-primary">
            #{orderId.toString().padStart(6, "0")}
          </p>
          <p className="font-sans text-xs text-muted-foreground mt-2">
            Save this number for tracking purposes
          </p>
        </div>

        {/* Decorative ornament */}
        <div className="divider-ornament max-w-xs mx-auto">
          <span className="font-serif italic text-muted-foreground text-xs">
            ✦ made with heart, shipped with care ✦
          </span>
        </div>

        {/* Shipping details */}
        <div className="bg-accent/8 border border-accent/20 rounded-xl p-5 text-sm font-sans text-muted-foreground text-left space-y-2">
          <p className="flex items-start gap-2">
            <span className="mt-0.5">📮</span>
            <span>
              Orders are processed and dispatched within{" "}
              <strong className="text-foreground">2–3 working days</strong>.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-0.5">🚚</span>
            <span>
              Delivery typically takes{" "}
              <strong className="text-foreground">5–10 days</strong> via India
              Post Speed Post.
            </span>
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Button
            data-ocid="order.success.shop.primary_button"
            size="lg"
            onClick={() => navigate({ name: "storefront" })}
            className="w-full font-sans font-semibold flex items-center justify-center gap-2 py-6 shadow-craft"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
