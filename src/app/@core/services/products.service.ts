import { Injectable } from '@angular/core';
import { ACTIVE_FILTERS } from '@core/constants/filters';
import { DETAILS_PAGE } from '@graphql/operations/query/details-page';
import { HOME_PAGE } from '@graphql/operations/query/home-page';
import { SHOP_LAST_UNITS_OFFERS, SHOP_PRODUCT_BY_PLATFORM, SHOP_PRODUCT_DETAILS, SHOP_PRODUCT_RANDOM_ITEMS } from '@graphql/operations/query/shop-product';
import { SUBSCRIPTIONS_PRODUCT_SELECT_STOCK } from '@graphql/operations/subscription/shop-product';
import { ApiService } from '@graphql/services/api.service';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/internal/operators/map';


@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getHomePage() {
    return this.get(HOME_PAGE, {showPlatform: true}).pipe(map((result: any) => {
      return {
        carousel: result.carousel,
        ps4: this.manageInfo(result.ps4.shopProducts, true),
        pc: this.manageInfo(result.pc.shopProducts, true),
        topPrice: this.manageInfo(result.topPrice35.shopProducts, true)
      };
    }));
  }

  getByPlatform(page: number = 1, itemsPage: number = 10, active: ACTIVE_FILTERS = ACTIVE_FILTERS.ACTIVE, platform: Array<string> = ['-1'],
                random: boolean = false, showInfo: boolean = false, showPlatform: boolean = false) {
    return this.get(SHOP_PRODUCT_BY_PLATFORM, {page, itemsPage, active, platform, random, showInfo, showPlatform})
    .pipe(map((result: any) => {
      const data = result.shopProductsPlatforms;
      return {
        info: data.info,
        result: this.manageInfo(data.shopProducts, true)
      };
    }));
  }

  getByLastUnitsOffers(page: number = 1, itemsPage: number = 10, active: ACTIVE_FILTERS = ACTIVE_FILTERS.ACTIVE,
                       random: boolean = false, topPrice: number = -1, lastUnits: number = -1, showInfo: boolean = false,
                       showPlatform: boolean = false) {
    return this.get(SHOP_LAST_UNITS_OFFERS, {page, itemsPage, active, random, topPrice, lastUnits, showInfo, showPlatform})
    .pipe(map((result: any) => {
      const data = result.shopProductsOffersLast;
      return {
        info: data.info,
        result: this.manageInfo(data.shopProducts, true)
      };
    }));
  }

  getItem(id: number) {
    return this.get(DETAILS_PAGE, {id}, {}, false).pipe(map((result: any) => {
      const details = result.details;
      const randomItems = result.randomItems;
      return {
        product: this.setInObject(details.shopProduct, true),
        screens: details.shopProduct.product.screenshot,
        relational: details.shopProduct.relationalProducts,
        random: this.manageInfo(randomItems.shopProducts, true)
      };
    }));
  }

  getRandomItems() {
    return this.get(SHOP_PRODUCT_RANDOM_ITEMS).pipe(map((result: any) => {
      console.log(result);
      const data = result.randomItems.shopProducts;
      return this.manageInfo(data, true);
    }));
  }

  private manageInfo(productList: any, showDescription: boolean = false) {
    const resultList: Array<IProduct> = [];
    productList.map((shopObject) => {
      resultList.push(this.setInObject(shopObject, showDescription));
    });
    return resultList;
  }

  private setInObject(shopObject, showDescription) {
    return {
      id: shopObject.id,
      img: shopObject.product.img,
      name: shopObject.product.name,
      rating: shopObject.product.rating,
      description: (shopObject.platform && showDescription) ? shopObject.platform.name : '',
      qty: 1,
      price: shopObject.price,
      stock: shopObject.stock
    };
  }

  stockUpdateListener(id: number) {
    return this.subscription(SUBSCRIPTIONS_PRODUCT_SELECT_STOCK, { id }).pipe(map((result: any) => {
      return result.selectProductStockUpdate;
    }));
  }

}
