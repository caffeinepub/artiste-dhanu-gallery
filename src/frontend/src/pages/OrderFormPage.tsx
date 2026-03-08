import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, MapPin, Package } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { formatPrice } from "../data/sampleProducts";
import { usePlaceOrder } from "../hooks/useQueries";

interface OrderFormPageProps {
  productId: bigint;
  productName: string;
  productPrice: bigint;
  navigate: (p: AppPage) => void;
}

interface FormData {
  customerName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
}

const INITIAL_FORM: FormData = {
  customerName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  pincode: "",
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function OrderFormPage({
  productId,
  productName,
  productPrice,
  navigate,
}: OrderFormPageProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const placeOrder = usePlaceOrder();

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.customerName.trim()) newErrors.customerName = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim()))
      newErrors.phone = "Valid 10-digit Indian phone number required";
    if (!form.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim()))
      newErrors.pincode = "Valid 6-digit pincode required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    try {
      const orderId = await placeOrder.mutateAsync({
        productId,
        productName,
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        streetAddress: form.streetAddress,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      });
      navigate({ name: "orderSuccess", orderId });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div
      data-ocid="order.page"
      className="container max-w-2xl mx-auto px-4 py-10"
    >
      {/* Back */}
      <Button
        data-ocid="order.nav.link"
        variant="ghost"
        size="sm"
        onClick={() => navigate({ name: "storefront" })}
        className="mb-8 flex items-center gap-1.5 text-muted-foreground font-sans hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to Shop
      </Button>

      {/* Order Summary Card */}
      <motion.div
        className="bg-primary/8 border border-primary/25 rounded-2xl p-5 mb-10 flex items-center gap-4 shadow-craft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Package className="text-primary" size={22} />
        </div>
        <div className="flex-1">
          <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-0.5">
            Your Order
          </p>
          <p className="font-display font-semibold text-foreground leading-tight">
            {productName}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-primary leading-none">
            {formatPrice(productPrice)}
          </p>
          <p className="font-sans text-[10px] text-muted-foreground mt-1">
            incl. taxes
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        noValidate
      >
        {/* ── Personal Info Section ── */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              Personal Details
            </h2>
            <p className="font-serif text-sm text-muted-foreground italic">
              Your contact information for order communication
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="customerName"
                className="font-sans font-medium text-sm"
              >
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="order.name.input"
                id="customerName"
                placeholder="Rajesh Kumar"
                value={form.customerName}
                onChange={(e) => update("customerName", e.target.value)}
                autoComplete="name"
                className={`font-sans ${errors.customerName ? "border-destructive" : ""}`}
              />
              {errors.customerName && (
                <p
                  data-ocid="order.name.error_state"
                  className="text-xs text-destructive font-sans"
                >
                  {errors.customerName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-sans font-medium text-sm">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="order.email.input"
                id="email"
                type="email"
                placeholder="rajesh@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                className={`font-sans ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p
                  data-ocid="order.email.error_state"
                  className="text-xs text-destructive font-sans"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="font-sans font-medium text-sm">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              data-ocid="order.phone.input"
              id="phone"
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              autoComplete="tel"
              maxLength={10}
              className={`font-sans max-w-xs ${errors.phone ? "border-destructive" : ""}`}
            />
            {errors.phone && (
              <p
                data-ocid="order.phone.error_state"
                className="text-xs text-destructive font-sans"
              >
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Decorative section separator */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={14} className="text-primary" />
            <span className="font-sans text-xs tracking-widest uppercase font-semibold text-muted-foreground">
              Delivery Address
            </span>
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Postal Address Section ── */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
          <div className="mb-5">
            <h3 className="font-display text-xl font-bold text-foreground mb-1">
              Postal Address
            </h3>
            <p className="font-serif text-sm text-muted-foreground italic flex items-center gap-1.5">
              <MapPin size={11} className="text-primary flex-shrink-0" />
              We need your complete address to ship via India Post
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="streetAddress"
                className="font-sans font-medium text-sm"
              >
                Street Address <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="order.street.input"
                id="streetAddress"
                placeholder="House No. 12, Main Street, Gandhi Nagar"
                value={form.streetAddress}
                onChange={(e) => update("streetAddress", e.target.value)}
                autoComplete="street-address"
                className={`font-sans ${errors.streetAddress ? "border-destructive" : ""}`}
              />
              {errors.streetAddress && (
                <p
                  data-ocid="order.street.error_state"
                  className="text-xs text-destructive font-sans"
                >
                  {errors.streetAddress}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city" className="font-sans font-medium text-sm">
                  City / Town <span className="text-destructive">*</span>
                </Label>
                <Input
                  data-ocid="order.city.input"
                  id="city"
                  placeholder="Jaipur"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  autoComplete="address-level2"
                  className={`font-sans ${errors.city ? "border-destructive" : ""}`}
                />
                {errors.city && (
                  <p
                    data-ocid="order.city.error_state"
                    className="text-xs text-destructive font-sans"
                  >
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="state"
                  className="font-sans font-medium text-sm"
                >
                  State <span className="text-destructive">*</span>
                </Label>
                <select
                  data-ocid="order.state.select"
                  id="state"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  autoComplete="address-level1"
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-sans ${
                    errors.state ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">Select state…</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p
                    data-ocid="order.state.error_state"
                    className="text-xs text-destructive font-sans"
                  >
                    {errors.state}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 max-w-xs">
              <Label
                htmlFor="pincode"
                className="font-sans font-medium text-sm"
              >
                PIN Code <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="order.pincode.input"
                id="pincode"
                placeholder="302001"
                value={form.pincode}
                onChange={(e) =>
                  update("pincode", e.target.value.replace(/\D/, ""))
                }
                autoComplete="postal-code"
                maxLength={6}
                className={`font-sans ${errors.pincode ? "border-destructive" : ""}`}
              />
              {errors.pincode && (
                <p
                  data-ocid="order.pincode.error_state"
                  className="text-xs text-destructive font-sans"
                >
                  {errors.pincode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            data-ocid="order.submit_button"
            type="submit"
            size="lg"
            disabled={placeOrder.isPending}
            className="w-full font-sans font-semibold text-base py-6 shadow-craft"
          >
            {placeOrder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing Order…
              </>
            ) : (
              "Confirm Order & Ship via India Post"
            )}
          </Button>
          {placeOrder.isError && (
            <p
              data-ocid="order.error_state"
              className="text-xs text-destructive text-center mt-2 font-sans"
            >
              Failed to place order. Please try again.
            </p>
          )}
          <p className="text-xs text-center text-muted-foreground mt-3 font-sans">
            By placing this order, you agree to share your address for India
            Post delivery.
          </p>
        </div>
      </motion.form>
    </div>
  );
}
