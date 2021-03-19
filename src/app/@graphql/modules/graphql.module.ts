import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';


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
    const urlLink = ApolloLink.from([
      errorLink,
      httpLink.create({ uri })
    ]);
    const subscriptionLink = new WebSocketLink({
      uri: 'ws://localhost:8080/graphql',
      options: {
        reconnect: true
      }
    });
    const link = split(
      ({query}) => {
        const { kind, operation }: any = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      subscriptionLink,
      urlLink
    );
    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
