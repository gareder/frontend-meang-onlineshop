import { Component, OnInit } from '@angular/core';
import { ICarouselItem } from '@mugan86/ng-shop-ui/lib/interfaces/carousel-item.interface';
import carouselItems from '@data/carousel.json';
import { ProductsService } from '@core/services/products.service';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  items: ICarouselItem[] = [];
  productsList;
  listOne;
  listTwo;
  listThree;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getByLastUnitsOffers(1, 6, ACTIVE_FILTERS.ACTIVE, true, -1, 15).subscribe((result: IProduct[]) => {
      result.map((item: IProduct) => {
        this.items.push({
          id: item.id,
          title: item.name,
          description: item.description,
          background: item.img,
          url: ''
        });
      });
    });
    this.productsService.getByLastUnitsOffers(1, 4, ACTIVE_FILTERS.ACTIVE, true, 35, -1).subscribe(result => {
      this.listTwo = result;
    });
    this.productsService.getByPlatform(1, 4, ACTIVE_FILTERS.ACTIVE, '4', true).subscribe(result => {
      this.listOne = result;
    });
    this.productsService.getByPlatform(1, 4, ACTIVE_FILTERS.ACTIVE, '18', true).subscribe(result => {
      this.listOne = result;
    });
  }

}
