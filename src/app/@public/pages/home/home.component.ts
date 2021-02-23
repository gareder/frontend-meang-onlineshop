import { Component, OnInit } from '@angular/core';
import { ICarouselItem } from '@mugan86/ng-shop-ui/lib/interfaces/carousel-item.interface';
import { ProductsService } from '@core/services/products.service';
import { loadData, closeAlert } from '@shared/alerts/alerts';


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
  loading: boolean;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loading = true;
    loadData('Loading', 'Please wait');
    this.productsService.getHomePage().subscribe(data => {
      this.listOne = data.pc;
      this.listTwo = data.topPrice;
      this.listThree = data.ps4;
      this.items = this.manageCarousel(data.carousel);
      closeAlert();
      this.loading = false;
    });
  }

  private manageCarousel(list) {
    const itemsValue: Array<ICarouselItem> = [];
    list.shopProducts.map(item => {
      itemsValue.push({
        id: item.id,
        title: item.product.name,
        description: item.platform.name,
        background: item.product.img,
        url: `/games/details/${item.id}`
      });
    });
    return itemsValue;
  }

}
