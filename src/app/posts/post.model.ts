export interface Post {
  id: string;
  title: string;
  content: string;
  price: number;
  comments: Array<{comment:string,commentator:string}>;
}
