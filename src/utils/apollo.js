import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  split,
} from '@apollo/client';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {createClient} from 'graphql-ws';
import {RetryLink} from '@apollo/client/link/retry';
import {getMainDefinition} from '@apollo/client/utilities';
import {onError} from '@apollo/client/link/error';
import {catchError} from './catchError';
import Config from 'react-native-config';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const retryLink = new RetryLink({
  delay: {
    initial: 2000,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 2,
    retryIf: error => !!error,
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: Config.GRAPHQL_API_SUBSCRIPTION_ROOT + '/graphql',
  }),
);

const httpLink = new HttpLink({uri: Config.GRAPHQL_API_ROOT + '/graphql'});

const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authLink = new ApolloLink((operation, forward) => {
  const context = operation.getContext();
  const token = GoogleSignin?.getCurrentUser()?.idToken;
  if (token && !context.skipAuthorization) {
    operation.setContext(({headers = {}}) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        // 'x-hasura-role': 'CANDIDATE',
      },
    }));
  }

  return forward(operation);
});

const errorLink = onError(({operation, graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({message, extensions}) =>
      catchError({
        title: 'GraphQL error',
        error: Error(
          `Message: ${message}, extensions: ${JSON.stringify(
            extensions,
          )}, operationName: ${
            operation.operationName
          }, variables: ${JSON.stringify(operation.variables)}`,
        ),
        skipToast: true,
      }),
    );
  }
  if (networkError) {
    catchError({
      title: 'Network error',
      error: networkError,
      skipToast: true,
    });
  }
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: from([errorLink, retryLink, authLink, splitLink]),
  cache,
  name: Config.APP_NAME,
  version: Config.VERSION || 'local',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export const removeClient = async () => {
  await client.resetStore();
  await client.clearStore();
  return client.stop();
};

export default client;
