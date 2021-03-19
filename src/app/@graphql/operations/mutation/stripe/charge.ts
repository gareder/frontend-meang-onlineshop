import { CHARGE_FRAGMENT } from '@graphql/operations/fragment/stripe/charge';
import gql from 'graphql-tag';

export const CREATE_PAY_ORDER = gql`
  mutation payOrder($payment: ChargeInput!, $stockChange: [ShopProductStockInput!]!) {
    chargeOrder(payment: $payment, stockChange: $stockChange) {
      status
      message
      charge {
        ...ChargeObject
      }
    }
  }
  ${CHARGE_FRAGMENT}
`;
