import { Component, OnInit } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { ProductsService } from '@core/services/products.service';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { IInfoPage } from '@core/interfaces/result-data.interface';
import { ActivatedRoute } from '@angular/router';
import { IGamePageInfo } from './games-page-info.interface';
import { GAMES_PAGES_INFO, TYPE_OPERATION } from './game.constants';
import { loadData, closeAlert } from '@shared/alerts/alerts';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  productsList: Array<IProduct> = [];
  selectPage;
  infoPage: IInfoPage = {
    page: 1,
    pages: 8,
    total: 160,
    itemsPage: 20
  };
  gamesPageInfo: IGamePageInfo;
  typeData: TYPE_OPERATION;
  loading: boolean;

  constructor(private productsService: ProductsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;
    loadData('Loading', 'Please wait');
    this.activatedRoute.params.subscribe(params => {
      const keyPage = `${params.type}/${params.filter}`;
      this.gamesPageInfo = GAMES_PAGES_INFO[keyPage];
      this.typeData = params.type;
      this.selectPage = 1;
      this.loadData();
    });
  }

  loadData() {
    if (this.typeData === TYPE_OPERATION.PLATFORMS) {
      this.productsService.getByPlatform(this.selectPage, this.infoPage.itemsPage, ACTIVE_FILTERS.ACTIVE, this.gamesPageInfo.platformsIds,
                                        false, true, true)
      .subscribe(data => {
        console.log(data.result);
        this.getResult(data);
      });
      return;
    }
    this.productsService.getByLastUnitsOffers(this.selectPage, this.infoPage.itemsPage, ACTIVE_FILTERS.ACTIVE,
                                              false, this.gamesPageInfo.topPrice, this.gamesPageInfo.stock, true, true)
    .subscribe(data => {
      this.getResult(data);
    });
  }

  private getResult(data) {
    this.productsList = data.result;
    this.infoPage = data.info;
    closeAlert();
    this.loading = false;
  }

}
