import React, { useState, useEffect } from 'react';

import { useGetAllPosts } from '../../hooks/posts/useGetAllPosts';

import './home.page.scss';

const Home: React.FC = () => {

  const requrestedPost: number = 20;

  const { data: postsData, loading: postsLoading, error: postsError } = useGetAllPosts(requrestedPost);

  useEffect(() => {
    if(postsData) {
      console.log('postsData: ', postsData);
    }
  }, [postsData])


  return (
    <div className="home">
      Home
    </div>
  );
};

export default Home;
