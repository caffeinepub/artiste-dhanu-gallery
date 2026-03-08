import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: ProductId;
    designUrl: ExternalBlob;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    price: bigint;
}
export interface OrderType {
    id: OrderId;
    customerName: string;
    status: string;
    city: string;
    productId: ProductId;
    productName: string;
    email: string;
    state: string;
    timestamp: Time;
    phone: string;
    pincode: string;
    streetAddress: string;
}
export type OrderId = bigint;
export type Time = bigint;
export type ProductId = bigint;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, imageUrl: string, designUrl: ExternalBlob, available: boolean): Promise<ProductId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(productId: ProductId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: OrderId): Promise<OrderType>;
    getProduct(productId: ProductId): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listOrders(): Promise<Array<OrderType>>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(productId: ProductId, productName: string, customerName: string, email: string, phone: string, streetAddress: string, city: string, state: string, pincode: string): Promise<OrderId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: OrderId, status: string): Promise<void>;
    updateProduct(productId: ProductId, name: string, description: string, price: bigint, imageUrl: string, designUrl: ExternalBlob, available: boolean): Promise<void>;
}
