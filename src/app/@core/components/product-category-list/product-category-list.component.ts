import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { CartService } from '@shop/core/services/cart.service';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent {

  @Input() title = 'Category Title';
  @Input() productsList: Array<IProduct> = [];
  @Input() description = '';
  @Input() showDesc: boolean;

  constructor(private router: Router, private cartService: CartService) { }

  addToCart($event: IProduct) {
    // Usar la información del producto pasado para llevarlo al carrito de compra
    console.log('Add to cart');
    this.cartService.manageProduct($event);
  }

  showProductDetails($event: IProduct) {
    this.router.navigateByUrl(`/games/details/${+$event.id}`);
  }

}
