import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { AppPage } from "../App";
import { ExternalBlob } from "../backend";
import type { OrderType, Product } from "../backend.d";
import { formatPrice } from "../data/sampleProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useListOrders,
  useListProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  description: string;
  price: string; // in rupees (user input)
  imageUrl: string;
  available: boolean;
  imageFile: File | null;
  uploadProgress: number;
}

const EMPTY_PRODUCT_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  available: true,
  imageFile: null,
  uploadProgress: 0,
};

// ─── Status badge helper ──────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    pending: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      dot: "bg-amber-400",
    },
    shipped: {
      bg: "bg-sky-50 border-sky-200",
      text: "text-sky-800",
      dot: "bg-sky-400",
    },
    delivered: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
      dot: "bg-emerald-400",
    },
  };
  const c = config[status] ?? {
    bg: "bg-muted border-border",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-sans capitalize ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {status}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────

interface AdminDashboardPageProps {
  navigate: (p: AppPage) => void;
}

export default function AdminDashboardPage({
  navigate,
}: AdminDashboardPageProps) {
  const { clear, identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "";

  // Products
  const { data: products, isLoading: loadingProducts } = useListProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Orders
  const { data: orders, isLoading: loadingOrders } = useListOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  // Dialogs
  const [productDialog, setProductDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    product: Product | null;
  }>({ open: false, mode: "add", product: null });

  const [form, setForm] = useState<ProductFormData>(EMPTY_PRODUCT_FORM);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Product form helpers ──

  const openAddDialog = () => {
    setForm(EMPTY_PRODUCT_FORM);
    setProductDialog({ open: true, mode: "add", product: null });
  };

  const openEditDialog = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: (Number(product.price) / 100).toString(),
      imageUrl: product.imageUrl,
      available: product.available,
      imageFile: null,
      uploadProgress: 0,
    });
    setProductDialog({ open: true, mode: "edit", product });
  };

  const closeProductDialog = () => {
    setProductDialog((p) => ({ ...p, open: false }));
  };

  const updateForm = (field: keyof ProductFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateForm("imageFile", file);
    // Preview URL
    const url = URL.createObjectURL(file);
    updateForm("imageUrl", url);
  };

  const handleProductSubmit = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      toast.error("Name and price are required.");
      return;
    }
    const priceInPaise = BigInt(
      Math.round(Number.parseFloat(form.price) * 100),
    );
    if (Number.isNaN(Number(priceInPaise)) || priceInPaise <= 0n) {
      toast.error("Please enter a valid price.");
      return;
    }

    let designUrl: ExternalBlob;
    if (form.imageFile) {
      const bytes = new Uint8Array(await form.imageFile.arrayBuffer());
      designUrl = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        updateForm("uploadProgress", pct),
      );
    } else {
      designUrl = ExternalBlob.fromURL(form.imageUrl || "");
    }

    const finalImageUrl = form.imageUrl;

    try {
      if (productDialog.mode === "add") {
        await addProduct.mutateAsync({
          name: form.name,
          description: form.description,
          price: priceInPaise,
          imageUrl: finalImageUrl,
          designUrl,
          available: form.available,
        });
        toast.success("Product added successfully!");
      } else if (productDialog.product) {
        await updateProduct.mutateAsync({
          productId: productDialog.product.id,
          name: form.name,
          description: form.description,
          price: priceInPaise,
          imageUrl: finalImageUrl,
          designUrl,
          available: form.available,
        });
        toast.success("Product updated!");
      }
      closeProductDialog();
    } catch {
      toast.error("Failed to save product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId: bigint) => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  const handleStatusChange = async (orderId: bigint, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleLogout = () => {
    clear();
    navigate({ name: "storefront" });
  };

  const isSaving = addProduct.isPending || updateProduct.isPending;

  return (
    <div
      data-ocid="admin.dashboard.page"
      className="container max-w-6xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          {principal && (
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              Logged in as:{" "}
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                {principal.slice(0, 20)}…
              </span>
            </p>
          )}
        </div>
        <Button
          data-ocid="admin.logout.button"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-muted-foreground font-sans hover:text-foreground"
        >
          <LogOut size={14} />
          Logout
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products">
        <TabsList data-ocid="admin.tab" className="mb-6">
          <TabsTrigger
            data-ocid="admin.products.tab"
            value="products"
            className="flex items-center gap-1.5 font-sans"
          >
            <ShoppingBag size={14} />
            Products
          </TabsTrigger>
          <TabsTrigger
            data-ocid="admin.orders.tab"
            value="orders"
            className="flex items-center gap-1.5 font-sans"
          >
            <Package size={14} />
            Orders
          </TabsTrigger>
        </TabsList>

        {/* ── Products Tab ── */}
        <TabsContent value="products">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Products{" "}
              <span className="text-muted-foreground font-sans text-sm font-normal">
                ({products?.length ?? 0})
              </span>
            </h2>
            <Button
              data-ocid="admin.product.add.open_modal_button"
              onClick={openAddDialog}
              className="flex items-center gap-1.5 font-sans"
            >
              <Plus size={14} />
              Add Product
            </Button>
          </div>

          {loadingProducts ? (
            <div data-ocid="admin.products.loading_state" className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div
              data-ocid="admin.products.empty_state"
              className="text-center py-16 border border-dashed border-border rounded-2xl bg-secondary/20"
            >
              <ShoppingBag
                className="mx-auto mb-3 text-muted-foreground"
                size={32}
              />
              <p className="font-serif text-muted-foreground">
                No products yet. Add your first product!
              </p>
            </div>
          ) : (
            <div
              data-ocid="admin.products.table"
              className="border border-border rounded-2xl overflow-hidden shadow-xs"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead className="font-sans font-semibold text-foreground">
                      Image
                    </TableHead>
                    <TableHead className="font-sans font-semibold text-foreground">
                      Name
                    </TableHead>
                    <TableHead className="font-sans font-semibold text-foreground">
                      Price
                    </TableHead>
                    <TableHead className="font-sans font-semibold text-foreground">
                      Status
                    </TableHead>
                    <TableHead className="font-sans font-semibold text-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product, i) => (
                    <TableRow
                      key={product.id.toString()}
                      data-ocid={`admin.products.row.${i + 1}`}
                      className={
                        i % 2 === 0 ? "bg-background" : "bg-secondary/20"
                      }
                    >
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shadow-xs">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-sans font-semibold text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                      </TableCell>
                      <TableCell className="font-display font-bold text-primary text-base">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.available ? "default" : "secondary"}
                          className="font-sans text-xs"
                        >
                          {product.available ? "Available" : "Hidden"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            data-ocid={`admin.products.edit_button.${i + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            className="hover:bg-secondary"
                          >
                            <Pencil size={13} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                data-ocid={`admin.products.delete_button.${i + 1}`}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 size={13} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent data-ocid="admin.delete.dialog">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-display">
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-sans">
                                  Are you sure you want to delete "
                                  {product.name}"? This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-ocid="admin.delete.cancel_button">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  data-ocid="admin.delete.confirm_button"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deleteProduct.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ── Orders Tab ── */}
        <TabsContent value="orders">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Orders{" "}
              <span className="text-muted-foreground font-sans text-sm font-normal">
                ({orders?.length ?? 0})
              </span>
            </h2>
          </div>

          {loadingOrders ? (
            <div data-ocid="admin.orders.loading_state" className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : orders?.length === 0 ? (
            <div
              data-ocid="admin.orders.empty_state"
              className="text-center py-16 border border-dashed border-border rounded-2xl bg-secondary/20"
            >
              <Package
                className="mx-auto mb-3 text-muted-foreground"
                size={32}
              />
              <p className="font-serif text-muted-foreground">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders?.map((order: OrderType, i) => (
                <motion.div
                  key={order.id.toString()}
                  data-ocid={`admin.orders.item.${i + 1}`}
                  className="border border-border rounded-2xl p-5 bg-card shadow-xs hover:shadow-craft transition-shadow duration-200"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Customer Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-display font-semibold text-foreground">
                          {order.customerName}
                        </span>
                        <span className="font-sans text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
                          Order #{order.id.toString().padStart(6, "0")}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="font-sans text-sm font-semibold text-primary">
                        {order.productName}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2">
                        <p className="text-xs text-muted-foreground font-sans flex items-center gap-1.5">
                          <span>📞</span> {order.phone}
                        </p>
                        <p className="text-xs text-muted-foreground font-sans flex items-center gap-1.5">
                          <span>✉️</span> {order.email}
                        </p>
                        <p className="text-xs text-muted-foreground font-sans col-span-full flex items-start gap-1.5 mt-0.5">
                          <span className="mt-0.5">📮</span>
                          <span className="text-foreground font-medium">
                            {order.streetAddress}, {order.city}, {order.state} —{" "}
                            {order.pincode}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Status Update */}
                    <div className="flex-shrink-0 min-w-[160px]">
                      <Label className="font-sans text-xs text-muted-foreground mb-1.5 block font-semibold uppercase tracking-wide">
                        Update Status
                      </Label>
                      <Select
                        data-ocid={`admin.orders.status.select.${i + 1}`}
                        value={order.status}
                        onValueChange={(val) =>
                          handleStatusChange(order.id, val)
                        }
                        disabled={updateOrderStatus.isPending}
                      >
                        <SelectTrigger
                          data-ocid={`admin.orders.status.select.${i + 1}`}
                          className="w-full font-sans text-sm"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Add/Edit Product Dialog ── */}
      <Dialog
        open={productDialog.open}
        onOpenChange={(open) => !open && closeProductDialog()}
      >
        <DialogContent
          data-ocid="admin.product.dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {productDialog.mode === "add"
                ? "Add New Product"
                : "Edit Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="p-name" className="font-sans text-sm font-medium">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="admin.product.name.input"
                id="p-name"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Terracotta Floral Bowl"
                className="font-sans"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="p-desc" className="font-sans text-sm font-medium">
                Description
              </Label>
              <Textarea
                data-ocid="admin.product.description.textarea"
                id="p-desc"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Describe your handmade product…"
                rows={3}
                className="font-sans"
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label
                htmlFor="p-price"
                className="font-sans text-sm font-medium"
              >
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="admin.product.price.input"
                id="p-price"
                type="number"
                min="1"
                step="0.01"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
                placeholder="1899"
                className="font-sans"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-1.5">
              <Label className="font-sans text-sm font-medium">
                Product Image
              </Label>
              <button
                type="button"
                className="w-full border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="admin.product.image.dropzone"
              >
                {form.imageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg mx-auto shadow-xs"
                    />
                    <p className="text-xs text-muted-foreground font-sans">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <Upload
                      className="mx-auto text-muted-foreground"
                      size={28}
                    />
                    <p className="text-sm font-sans text-muted-foreground">
                      Click to upload image
                    </p>
                  </div>
                )}
              </button>
              <input
                data-ocid="admin.product.image.upload_button"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
              {form.uploadProgress > 0 && form.uploadProgress < 100 && (
                <p className="text-xs text-muted-foreground font-sans">
                  Uploading: {form.uploadProgress}%
                </p>
              )}
            </div>

            {/* Available Toggle */}
            <div className="flex items-center justify-between py-1">
              <Label
                htmlFor="p-available"
                className="font-sans text-sm font-medium"
              >
                Available in shop
              </Label>
              <Switch
                data-ocid="admin.product.available.switch"
                id="p-available"
                checked={form.available}
                onCheckedChange={(checked) => updateForm("available", checked)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              data-ocid="admin.product.cancel_button"
              variant="ghost"
              onClick={closeProductDialog}
              className="font-sans"
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.product.save_button"
              onClick={handleProductSubmit}
              disabled={isSaving}
              className="font-sans"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : productDialog.mode === "add" ? (
                "Add Product"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
