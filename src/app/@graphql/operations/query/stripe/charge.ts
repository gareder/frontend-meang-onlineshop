import { CHARGE_FRAGMENT } from '@graphql/operations/fragment/stripe/charge';
import gql from 'graphql-tag';

export const CHARGES_CUSTOMERS_LIST = gql`
query chargesByCustomer($customer: ID!, $limit: Int, $startingAfter: ID, $endingBefore: ID){
  chargesByCustomer(customer: $customer, limit: $limit, startingAfter: $startingAfter, endingBefore: $endingBefore) {
    status
    hasMore
    message
    charges {
      ...ChargeObject
    }
  }
}
${ CHARGE_FRAGMENT }
`;
