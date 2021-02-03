import gql from 'graphql-tag';
import { TAG_FRAGMENT } from '../fragment/tag';

export const ADD_TAG = gql`
  mutation insertTag($tag: String!) {
    addTag(tag: $tag) {
      status
      message
      tag {
        ...TagObject
      }
    }
  }
  ${ TAG_FRAGMENT }
`;

export const MODIFY_TAG = gql`
  mutation updateTag($id: ID!, $tag: String!) {
    updateTag(id: $id, tag: $tag) {
      status
      message
      tag {
        ...TagObject
      }
    }
  }
  ${ TAG_FRAGMENT }
`;

export const BLOCK_TAG = gql`
  mutation blockTag($id: ID!) {
    blockTag(id: $id) {
      status
      message
    }
  }
`;
