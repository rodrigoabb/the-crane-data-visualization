import { ApolloClient, InMemoryCache } from '@apollo/client';
import config from './config';
/*
  Config object has this structure (example values):

  config = {
    API_URL: 'http://localhost:3001/graphql',
  };
*/

const client = new ApolloClient({
  uri: config.API_URL,
  cache: new InMemoryCache(),
});

export default client;
