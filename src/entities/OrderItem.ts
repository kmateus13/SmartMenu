import { Product } from "./Products";

export interface OrderItem {
    id: number;
    quantity: number;
    order_id?: number;
    product: Product;
    product_id?: number;
}