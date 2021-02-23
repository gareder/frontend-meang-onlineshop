import gql from 'graphql-tag';

export const SHOP_PRODUCT_FRAGMENT = gql `
  fragment ShopProductObject on ShopProduct {
    id
    price
    stock
    product {
      name
      img
      rating {
        value
        count
      }
      screenshot @include(if: $relationScreens)
    }
    platform @include(if: $showPlatform) {
      id
      name
      slug
    }
    relationalProducts @include(if: $relationScreens) {
      id
      platform {
        name
      }
    }
  }
`;
