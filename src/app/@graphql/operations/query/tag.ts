import gql from 'graphql-tag';
import { TAG_FRAGMENT } from '../fragment/tag';
import { RESULT_INFO_FRAGMENT } from '@graphql/operations/fragment/result-info';

export const TAG_LIST_QUERY = gql `
  query tagList($page: Int, $itemsPage: Int) {
    tags(page: $page, itemsPage: $itemsPage) {
      info {
        ...ResultInfoObject
      }
      status
      message
      tags {
        ...TagObject
      }
    }
  }
  # Fragments
  ${ TAG_FRAGMENT }
  ${ RESULT_INFO_FRAGMENT }
`;
