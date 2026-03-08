import { ExternalBlob } from "../backend";
import type { Product } from "../backend.d";

// Sample products shown when backend returns empty list
export const sampleProducts: Product[] = [
  {
    id: BigInt(1),
    name: "Terracotta Floral Bowl",
    description:
      "A hand-thrown terracotta bowl adorned with intricate hand-painted floral motifs in cobalt blue and rust orange. Each piece is unique, fired in a wood kiln for a natural, earthy finish. Perfect for fruit, salads, or as a stunning centerpiece.",
    price: BigInt(189900), // ₹1899
    imageUrl: "/assets/generated/product-pottery-bowl.dim_600x600.jpg",
    designUrl: ExternalBlob.fromURL(
      "/assets/generated/product-pottery-bowl.dim_600x600.jpg",
    ),
    available: true,
  },
  {
    id: BigInt(2),
    name: "Boho Macramé Wall Hanging",
    description:
      "Lovingly crafted from 100% natural jute twine, this large macramé wall hanging brings warmth and texture to any room. Each knot is tied by hand using traditional weaving techniques passed down through generations. Dimensions: 60cm × 90cm.",
    price: BigInt(249900), // ₹2499
    imageUrl: "/assets/generated/product-macrame-wall.dim_600x600.jpg",
    designUrl: ExternalBlob.fromURL(
      "/assets/generated/product-macrame-wall.dim_600x600.jpg",
    ),
    available: true,
  },
  {
    id: BigInt(3),
    name: "Silk Embroidered Tote Bag",
    description:
      "A gorgeous hand-stitched tote bag crafted from sturdy canvas with vibrant silk thread embroidery inspired by traditional Indian folk art. Features inner pocket, reinforced handles, and is large enough for daily use. A wearable work of art.",
    price: BigInt(159900), // ₹1599
    imageUrl: "/assets/generated/product-embroidered-bag.dim_600x600.jpg",
    designUrl: ExternalBlob.fromURL(
      "/assets/generated/product-embroidered-bag.dim_600x600.jpg",
    ),
    available: true,
  },
  {
    id: BigInt(4),
    name: "Beeswax Lavender Candle",
    description:
      "Hand-poured pure beeswax candle in a hand-thrown clay pot, infused with dried lavender and rose petals. Burns cleanly for up to 40 hours, filling your space with a soft, calming fragrance. A gift of pure, natural luxury.",
    price: BigInt(89900), // ₹899
    imageUrl: "/assets/generated/product-candle.dim_600x600.jpg",
    designUrl: ExternalBlob.fromURL(
      "/assets/generated/product-candle.dim_600x600.jpg",
    ),
    available: true,
  },
  {
    id: BigInt(5),
    name: "Hand-Carved Walnut Jewellery Box",
    description:
      "Meticulously hand-carved from solid walnut wood, this jewellery box features delicate floral relief carvings on all sides. Lined with soft velvet inside, it holds rings, earrings, and necklaces safely. A timeless heirloom piece.",
    price: BigInt(349900), // ₹3499
    imageUrl: "/assets/generated/product-wooden-box.dim_600x600.jpg",
    designUrl: ExternalBlob.fromURL(
      "/assets/generated/product-wooden-box.dim_600x600.jpg",
    ),
    available: true,
  },
];

export function formatPrice(price: bigint): string {
  // price stored in paise (1 rupee = 100 paise)
  const rupees = Number(price) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
