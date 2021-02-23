import { Component, OnInit } from '@angular/core';
import products from '@data/products.json';
import { CURRENCIES_SYMBOL, CURRENCY_LIST } from '@mugan86/ng-shop-ui';
import { ProductsService } from '@core/services/products.service';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { loadData, closeAlert } from '@shared/alerts/alerts';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  product: IProduct;
  // products[Math.floor(Math.random() * products.length)];
  selectImage: string;
  currencySelect = CURRENCIES_SYMBOL[CURRENCY_LIST.EURO];
  screens = [];
  relationalProducts: Array<object> = [];
  randomItems: Array<IProduct> = [];
  loading: boolean;

  constructor(private productsService: ProductsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.loading = true;
      loadData('Loading', 'Please wait');
      this.loadDataValue(+params.id);
    });
  }

  changeValue(qty) {
    console.log(qty);
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
      this.selectImage = this.product.img;
      this.screens = result.screens;
      this.relationalProducts = result.relational;
      this.randomItems = result.random;
      this.loading = false;
      closeAlert();
    });
  }

}
