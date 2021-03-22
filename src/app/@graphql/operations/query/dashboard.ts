import gql from 'graphql-tag';

export const DASHBOARD_STATS_ELEMENTS = gql`
  {
	users: totalElements(collection: "users")
	tags: totalElements(collection: "tags")
	shopProducts: totalElements(collection: "products_platforms")
	genres: totalElements(collection: "genres")
	platforms: totalElements(collection: "platforms")
	products: totalElements(collection: "products")
}
`;
