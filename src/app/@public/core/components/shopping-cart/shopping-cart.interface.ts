import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';

export interface ICart {
  total: number; // Total amount to pay
  subtotal: number; // Total number of units
  products: Array<IProduct>; // Products in the cart
}