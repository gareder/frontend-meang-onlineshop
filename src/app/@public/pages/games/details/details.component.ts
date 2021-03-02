import { Component, OnInit } from '@angular/core';
import { ProductsService } from '@core/services/products.service';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { loadData, closeAlert } from '@shared/alerts/alerts';
import { CURRENCY_SELECT } from '@core/constants/config';
import { CartService } from '@shop/core/services/cart.service';
import { ICart } from '@shop/core/components/shopping-cart/shopping-cart.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  product: IProduct;
  selectImage: string;
  currencySelect = CURRENCY_SELECT;
  screens = [];
  relationalProducts: Array<object> = [];
  randomItems: Array<IProduct> = [];
  loading: boolean;

  constructor(private productsService: ProductsService, private activatedRoute: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.loading = true;
      loadData('Loading', 'Please wait');
      this.loadDataValue(+params.id);
    });
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      console.log(data);
      if (data.subtotal === 0) {
        this.product.qty = 1;
        return;
      }
      this.product.qty = this.findProduct(+this.product.id).qty;
    });
  }

  findProduct(id: number) {
    return this.cartService.cart.products.find(item => +item.id === id);
  }

  changeValue(qty) {
    this.product.qty = qty;
  }

  selectImgMain(i) {
    this.selectImage = this.screens[i];
  }

  selectOtherPlatform($event) {
    this.loadDataValue(+$event.target.value);
  }

  loadDataValue(id: number) {
    this.productsService.getItem(id).subscribe(result => {
      this.product = result.product;
      const saveProductInCart = this.findProduct(+this.product.id);
      console.log(saveProductInCart);
      this.product.qty = (saveProductInCart !== undefined) ? saveProductInCart.qty : this.product.qty;
      this.selectImage = this.product.img;
      this.screens = result.screens;
      this.relationalProducts = result.relational;
      this.randomItems = result.random;
      this.loading = false;
      closeAlert();
    });
  }

  addToCart() {
    this.cartService.manageProduct(this.product);
  }

}
