import gql from 'graphql-tag';
import { SHOP_PRODUCT_FRAGMENT } from '@graphql/operations/fragment/shop-product';

export const SHOP_LAST_UNITS_OFFERS = gql`
  query shopProductsOfferLast($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $random: Boolean, $topPrice: Float $lastUnits: Int) {
    shopProductsOffersLast(page: $page, itemsPage: $itemsPage, active: $active, random: $random, topPrice: $topPrice, lastUnits: $lastUnits) {
      status
      message
      shopProducts {
        ...ShopProductObject
      }
    }
  }
  ${SHOP_PRODUCT_FRAGMENT}
`;

export const SHOP_PRODUCT_BY_PLATFORM = gql`
  query shopProductPlatform($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $random: Boolean, $platform: ID!) {
    shopProductsPlatforms(page: $page, itemsPage: $itemsPage, active: $active, random: $random, platform: $platform) {
      status
      message
      shopProducts {
        ...ShopProductObject
      }
    }
  }
  ${SHOP_PRODUCT_FRAGMENT}
`;
