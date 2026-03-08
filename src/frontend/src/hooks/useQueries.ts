import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type { OrderId, OrderType, Product, ProductId } from "../backend.d";
import { useActor } from "./useActor";

// ─── Product Queries ──────────────────────────────────────

export function useListProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ["product", productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) throw new Error("No actor or id");
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && productId !== null,
  });
}

// ─── Order Queries ────────────────────────────────────────

export function useListOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<OrderType[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin Check ──────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ────────────────────────────────────────────

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    OrderId,
    Error,
    {
      productId: ProductId;
      productName: string;
      customerName: string;
      email: string;
      phone: string;
      streetAddress: string;
      city: string;
      state: string;
      pincode: string;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(
        data.productId,
        data.productName,
        data.customerName,
        data.email,
        data.phone,
        data.streetAddress,
        data.city,
        data.state,
        data.pincode,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    ProductId,
    Error,
    {
      name: string;
      description: string;
      price: bigint;
      imageUrl: string;
      designUrl: ExternalBlob;
      available: boolean;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProduct(
        data.name,
        data.description,
        data.price,
        data.imageUrl,
        data.designUrl,
        data.available,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    {
      productId: ProductId;
      name: string;
      description: string;
      price: bigint;
      imageUrl: string;
      designUrl: ExternalBlob;
      available: boolean;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(
        data.productId,
        data.name,
        data.description,
        data.price,
        data.imageUrl,
        data.designUrl,
        data.available,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, ProductId>({
    mutationFn: async (productId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { orderId: OrderId; status: string }>({
    mutationFn: async ({ orderId, status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
