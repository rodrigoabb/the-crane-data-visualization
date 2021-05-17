import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { useGetAllPosts } from '../../hooks/posts/useGetAllPosts';
import  BarChart from '../../components/charts/bar-chart/bar-chart.component';
import  HorizontalBarChart from '../../components/charts/horizontal-bar-chart/horizontal-bar-chart.component';
import OrdinalLegend from '../../components/charts/ordinal-legend/ordinal-legend.component';

import { IPost } from '../../common/interfaces/post.interface';
import { ITopic } from '../../common/interfaces/topics.interface';
import { sortArrayByKey, generateRandomHexColours } from '../../common/utils/helperFunctions';

import './home.page.scss'


// GLOBAL VALUES

const POSTS_REQUESTED_QTY_DEFAULT = 800;
const CHART_BACKGROUND_COLOUR = '#5e81ff';

const Home: React.FC = () => {

  const [ postQtyToRequest, setPostQtyToRequest ] = useState<number>(POSTS_REQUESTED_QTY_DEFAULT);
  const [ posts, setPosts ] = useState<IPost[]>([]);
  const [ finishedAnalyzing, setFinishedAnalyzing ] = useState(false);
  const [ postsByMonth, setPostsByMonth ] = useState<Array<any>>([]);
  const [ postsByTopic, setPostsByTopic ] = useState<Array<any>>([]);
  const [ topTopicsByMonth, setTopTopicsByMonth ] = useState<Array<any>>([]);
  const [ topicsByAuthor, setTopicsByAuthor ] = useState<Array<any>>([]);
  const [ minMaxUnix, setMinMaxUnix ] = useState<Array<any>>([0,0]);
  const [ topics, setTopics ] = useState<string[]>([]);
  const [ topicColours, setTopicColours ] = useState<string[]>([]);
  const { data: postsData, loading: postsLoading, error: postsError } = useGetAllPosts(postQtyToRequest);



  // Local helper functions

  const analyzeData = (postsArray: IPost[]) => {
    let minUnix = '';
    let maxUnix = '';

    // Get Analyzed Period
    for (let i = 0; i < postsArray.length; i += 1) {
      if (i === 0) {
        minUnix = postsArray[i].createdAt;
        maxUnix = postsArray[i].createdAt;
      } else {
        if (postsArray[i].createdAt < minUnix) {
          minUnix = postsArray[i].createdAt;
        }
        if (postsArray[i].createdAt > maxUnix) {
          maxUnix = postsArray[i].createdAt;
        }
      }
    }
    setMinMaxUnix([Number(minUnix) / 1000, Number(maxUnix) / 1000]);

    // Get Topics (assuming every post will have all topics in 'likelyTopics' attribue)
    const topicsArray = postsArray[0].likelyTopics.map(topicObj => topicObj.label);
    setTopics(topicsArray);

    const topicColours = generateRandomHexColours(topicsArray.length);
    setTopicColours(topicColours);

    setFinishedAnalyzing(true);
  };

  const getPostsLikelyTopics = (post: IPost, amount: number) => {
    let topicsToReturn: ITopic[] = [];
    let likelyTopics: ITopic[] = post.likelyTopics;
    if (amount > 0 && amount <= likelyTopics.length) {
      // It seems they come already sorted by value, but if they don't, we can use this
      // const sortedTopics = sortArrayByKey(post.likelyTopics, 'likelihood', 'desc');
      // topicsToReturn = sortedTopics.slice(0, amount);
      topicsToReturn = likelyTopics.slice(0, amount);
    }
    return topicsToReturn;
  }

  const groupPostsByMonth = (posts: Array<any>) => {
    const groupedPost = posts.reduce((acc: any, post: IPost) => {
      const unixDate = Number(post.createdAt) / 1000;

      // Create a composed key: 'year-month'
      const unixMoment = moment.unix(unixDate);
      const yearMonth = `${unixMoment.year()}-${(unixMoment.month() + 1)}`;
      const startOfMonthUnix = unixMoment.startOf('month').unix();
      const postCopy = { ...post };
      postCopy.unix = startOfMonthUnix;

      // Add this key as a property to the result object
      if (!acc[yearMonth]) {
        acc[yearMonth] = [];
      }

      // Push the current date that belongs to the year-week calculated befor
      acc[yearMonth].push(postCopy);

      return acc;

    }, {});
    return groupedPost;
  }

  const groupPostsByAuthor = (posts: Array<any>) => {
    // Similar behaviour as groupPostsByMonth()
    const groupedPost = posts.reduce((acc: any, post: IPost) => {

      const postCopy = { ...post };
      const authorId = postCopy.author.id;
      if (!acc[authorId]) {
        acc[authorId] = [];
      }

      acc[authorId].push(postCopy);

      return acc;

    }, {});
    return groupedPost;
  };

  const getPostsByTopicFrequency = (posts: Array<any>) => {
      // Similar behaviour as groupPostsByMonth()
    const groupedPost = posts.reduce((acc: any, post: IPost) => {

      // Create a composed key: 'year-month'
      const likelyTopics: ITopic[] = getPostsLikelyTopics(post, 1);
      const topic: ITopic = likelyTopics[0];

      if (!acc[topic.label]) {
        acc[topic.label] = 1;
      } else {
        acc[topic.label] += 1;
      }

      return acc;

    }, {});
    return groupedPost;
  }

  const getPostsByMonth = (groupedPosts: any) => {
    const postsByMonth: Array<any> = [];
    Object.keys(groupedPosts).forEach((key: string) => {
      const element: any = {};
      const postsByGroup = groupedPosts[key];
      element.amount = postsByGroup.length;
      element.groupedBy = key;
      element.unix = postsByGroup[0].unix;
      postsByMonth.push(element);
    });

    const sortedPostsByMonth = sortArrayByKey(postsByMonth, 'unix');
    return sortedPostsByMonth;
  }

  const getPostsByTopic = (postsByTopicFrequency: any) => {
    const postsByTopic: Array<any> = [];
    Object.keys(postsByTopicFrequency).forEach((key: string) => {
      const element: any = {};
      element[key] = postsByTopicFrequency[key];
      element.groupedBy = key;
      postsByTopic.push(element);
    });

    return postsByTopic;
  }


  const getTopTopicsByAttribute = (groupedPosts: any, topTopics: number, groupedBy: string) => {

    // Get frequency of post topics by grouped category (month, author, etc...) - Returns object topicsByGroup
    const topicsByGroup: any = {};
    const baseTopicFrequency = getBaseTopicFrequency();
    Object.keys(groupedPosts).forEach((key: string) => {
      const postsByGroup = groupedPosts[key];
      const postsByTopic = { ...baseTopicFrequency };

      for (let i = 0; i < postsByGroup.length; i += 1) {
        const likelyTopics: ITopic[] = getPostsLikelyTopics(postsByGroup[i], 1);
        const topTopic: ITopic = likelyTopics[0];
        postsByTopic[topTopic.label] += 1;
      }

      let groupedByValue = '';
      if (groupedBy === 'author') {
        const { author } = postsByGroup[0];
        groupedByValue = `${author.firstName} ${author.lastName}`;
      } else if (groupedBy === 'month') {
        const { unix } = postsByGroup[0];
        postsByTopic.unix = unix;
        groupedByValue = key;
      }
      postsByTopic.groupedBy = groupedByValue;

      topicsByGroup[key] = postsByTopic;
    });

    // Get Top posts topics frequency by grouped catergory (month, author, etc...) - Returns array topTopicsByGroup
    let topTopicsByGroup: Array<any> = [];

    Object.keys(topicsByGroup).forEach((group) => {
      const topicsByGroupArray: Array<any> = [];
      let sortable: Array<any> = [];
      let nonSortable: Array<any> = [];

      const groupedObj = topicsByGroup[group];
      Object.keys(groupedObj).forEach((key: string | number) => {
        topicsByGroupArray.push([key, groupedObj[key]]);
      });

      topicsByGroupArray.forEach((pair: Array<any>) => {
        if (pair[0] !== 'unix' && pair[0] !== 'groupedBy') {
          sortable.push(pair);
        } else {
          nonSortable.push(pair);
        }
      });
      sortable.sort((a, b) => {
        return b[1] - a[1];
      });
      const topTopicsArray = [...sortable.slice(0, topTopics), ...nonSortable];

      const element: any = {};
      element.groupedBy = group;
      topTopicsArray.forEach((pairTopicValue: Array<any>) => {
        element[pairTopicValue[0]] = pairTopicValue[1];
      });
      topTopicsByGroup.push(element);
    });

    let sortedTopTopicsByGroup: Array<any> = topTopicsByGroup;

    if (groupedBy === 'month') {
      // Sort array by timestamp
      sortedTopTopicsByGroup = sortArrayByKey(topTopicsByGroup, 'unix');
    }

    return sortedTopTopicsByGroup;
  };

  const getBaseTopicFrequency = () => {
    const POSTS_BY_TOPIC: any = {};
    topics.forEach(topic => {
      POSTS_BY_TOPIC[topic] = 0;
    });
    return POSTS_BY_TOPIC;
  };

  useEffect(() => {
    if(postsData) {
      setPosts(postsData.allPosts);
    }
  }, [postsData]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      analyzeData(posts);
    }

  }, [posts]);

  useEffect(() => {
    if (finishedAnalyzing) {
      const groupedPostsByMonth = groupPostsByMonth(posts);

      const postsByMonthArray = getPostsByMonth(groupedPostsByMonth);
      setPostsByMonth(postsByMonthArray);

      const topTopicsByMonth = getTopTopicsByAttribute(groupedPostsByMonth, 3, 'month');
      setTopTopicsByMonth(topTopicsByMonth);

      const groupedAuthor = groupPostsByAuthor(posts);
      const topTopicsByAuthor = getTopTopicsByAttribute(groupedAuthor, 3, 'author');
      setTopicsByAuthor(topTopicsByAuthor);

      const postsByTopicFrequency = getPostsByTopicFrequency(posts);
      const postsByTopicArray = getPostsByTopic(postsByTopicFrequency);
      setPostsByTopic(postsByTopicArray);
    }
  }, [finishedAnalyzing]);


  if (postsLoading || !finishedAnalyzing) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  if (postsError) {
    return (
      <div>
        Error: { postsError }
      </div>
    );
  }

  return (
    <div className="home">
      <div className="page-title">
        <h1>Data Visualization</h1>
      </div>

      <div className="detailed-text">
        <p>Posts analyzed for this study: <b>{ posts.length }</b></p>
        <p>Period analyzed: <b>{ moment.unix(minMaxUnix[0]).format("DD/MM/YYYY") } - { moment.unix(minMaxUnix[1]).format("DD/MM/YYYY") }</b></p>
      </div>

      <hr className="dashed" />

      <div className="page-subtitle">
        <h2>General Stats</h2>
      </div>

      <div className="chart-container">
        <div className="chart-title">
          <h3>Posts by month</h3>
        </div>
        <div className="descripton">
          Shows number of posts for each month over the analyzed period
        </div>
        <div className="chart">
          <BarChart
            width={ 800 }
            height={ 400 }
            data={ postsByMonth }
            keys={ ['amount'] }
            showLeftAxis={ true }
            colours= { ['#fff200'] }
            backgroundColor={ CHART_BACKGROUND_COLOUR }
            nonValueAttributes={ ['groupedBy', 'unix', 'author']}
          />
        </div>
      </div>

      <hr className="dashed" />

      <div className="page-subtitle">
        <h2>Posts by Topics</h2>
      </div>

      <div className="legend-container">
        <OrdinalLegend title="Topics" keys={ topics } colours={ topicColours } />
      </div>

      <div className="chart-container">
        <div className="chart-title">
          <h3>Posts by topics</h3>
        </div>
        <div className="descripton">
          Shows number of posts by topic over the analyzed period
        </div>
        <div className="chart">
          <BarChart
            width={ 800 }
            height={ 400 }
            data={ postsByTopic }
            keys={ topics }
            showLeftAxis={ true }
            colours= { topicColours }
            backgroundColor={ CHART_BACKGROUND_COLOUR }
            nonValueAttributes={ ['groupedBy', 'unix', 'author']}
          />
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">
          <h3>Top topics by month</h3>
        </div>
        <div className="descripton">
          Shows the TOP-3 topics for each month over the analyzed period
        </div>
        <div className="chart">
          <BarChart
            width={ 800 }
            height={ 400 }
            data={ topTopicsByMonth }
            keys={ topics }
            colours= { topicColours }
            backgroundColor={ CHART_BACKGROUND_COLOUR }
            nonValueAttributes={ ['groupedBy', 'unix', 'author']}
          />
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">
          <h3>Top topics by user</h3>
        </div>
        <div className="descripton">
          Shows the TOP-3 topics for each user over the analyzed period
        </div>
        <div className="chart">
          <HorizontalBarChart
            width={ 800 }
            height={ 400 }
            data={ topicsByAuthor }
            keys={ topics }
            colours= { topicColours }
            backgroundColor={ CHART_BACKGROUND_COLOUR }
            nonValueAttributes={ ['groupedBy', 'unix', 'author']}
          />
        </div>
      </div>

      <hr className="dashed" />

    </div>
  );
};

export default Home;
