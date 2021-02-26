import { Injectable } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { Subject } from 'rxjs/internal/Subject';
import { ICart } from '../components/shopping-cart/shopping-cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  products: Array<IProduct> = [];
  cart: ICart = {
    total: 0,
    subtotal: 0,
    products: this.products
  };
  // To manage the products with notifications when an action is made such as clearing
  itemsVar = new Subject<ICart>();
  itemsVar$ = this.itemsVar.asObservable();

  constructor() { }

  // Initializing the cart to store the info
  initilize() {
    const storeData = JSON.parse(localStorage.getItem('cart'));
    if (storeData !== null) {
      this.cart = storeData;
    }
    return this.cart;
  }

  updateItemsInCart(newValue: ICart) {
    this.itemsVar.next(newValue);
  }

  manageProduct(product: IProduct) {
    // Get products in cart
    const productTotal = this.cart.products.length;
    // Check if there are products
    if (productTotal === 0) {
      console.log('Adding first product');
      this.cart.products.push(product);
    } else {
      // If there's a product
      let actionUpdateOk = false;
      for (let i = 0; i < productTotal; i++) {
        // Check if the product matches any on the list
        if (product.id === this.cart.products[i].id) {
          console.log('Product exists');
          if (product.qty === 0) {
            console.log('Delete selected product');
            // Remove product
            this.cart.products.splice(i, 1);
          } else {
            // Update with the new info
            this.cart.products[i] = product;
          }
          actionUpdateOk = true;
          i = productTotal;
        }
      }
      if (!actionUpdateOk) {
        this.cart.products.push(product);
      }
    }
    this.checkoutTotal();
  }

  // Adding all the info before checkingout
  checkoutTotal() {
    let subTotal = 0;
    let total = 0;
    this.cart.products.map((product: IProduct) => {
      subTotal += product.qty;
      total += (product.qty * product.price);
    });
    this.cart.total = total;
    this.cart.subtotal = subTotal;
    console.log(this.cart, 'Calculado');
    this.setInfo();
  }

  clear() {
    this.products = [];
    this.cart = {
      total: 0,
      subtotal: 0,
      products: this.products
    };
    this.setInfo();
    console.log('Deleting info');
    return this.cart;
  }

  private setInfo() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateItemsInCart(this.cart);
  }

  openNav() {
   document.getElementById('mySidenav').style.width = '600px';
   document.getElementById('overlay').style.display = 'block';
   document.getElementById('app').style.overflow = 'hidden';
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('app').style.overflow = 'auto';
  }
}
