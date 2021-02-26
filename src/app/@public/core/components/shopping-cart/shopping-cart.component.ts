import { Component, OnInit } from '@angular/core';
import { CartService } from '@shop/core/services/cart.service';
import { ICart } from './shopping-cart.interface';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { CURRENCY_SELECT } from '@core/constants/config';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  cart: ICart;
  currencySelect = CURRENCY_SELECT;

  constructor(private cartService: CartService) {
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cart = data;
      }
    });
  }

  ngOnInit(): void {
    this.cart = this.cartService.initilize();
    console.log(this.cart);
  }

  clear() {
    this.cartService.clear();
  }

  closeNav() {
    this.cartService.closeNav();
  }

  clearItem(product: IProduct) {
    this.manageProductUnitInfo(0, product);
  }

  checkout() {
    console.log(this.cart);
  }

  changeValue(qty: number, product: IProduct) {
    this.manageProductUnitInfo(qty, product);
  }

  manageProductUnitInfo(qty: number, product: IProduct) {
    product.qty = qty;
    this.cartService.manageProduct(product);
  }

}
