import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage if it exists
  // Try both adminToken (for admin) and token (for regular users)
  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const token = adminToken || userToken;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});

