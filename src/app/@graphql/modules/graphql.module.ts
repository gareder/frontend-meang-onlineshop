import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';


@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphqlModule {
  constructor(public apollo: Apollo, public httpLink: HttpLink) {
    // Catching the query/network errors
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log('GraphQL Errors', graphQLErrors);
      }
      if (networkError) {
        console.log('Netowkr Errors', networkError);
      }
    });
    const uri = 'http://localhost:8080/graphql';
    const link = ApolloLink.from([
      errorLink,
      httpLink.create({ uri })
    ]);
    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
