import { gql, useQuery, QueryResult } from '@apollo/client';

const GET_ALL_POSTS = gql`
  query GetAllPosts($count: Int) {
    allPosts(count: $count) {
      id
      title
      body
      published
      createdAt
      author {
        id
        firstName
        lastName
        email
        avatar
      }
      likelyTopics {
        label
        likelihood
      }
    }
  }
`;

export const useGetAllPosts = (count: number) : QueryResult => {
  const response = useQuery(GET_ALL_POSTS, {
    variables: {
      count,
    },
  });
  return response;
};
