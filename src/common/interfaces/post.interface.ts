import { IAuthor } from './author.interface';
import { ITopic } from './topics.interface';

export interface IPost {
  author: IAuthor,
  body: string,
  createdAt: string,
  id: string,
  likelyTopics: ITopic[],
  published: boolean,
  title: string,
  unix: number,
}
