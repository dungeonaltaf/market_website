export interface Post {
  id: string;
  title: string;
  content: string;
  price: number;
  imagePath: string;
  comments: Array<{comment:string,commentator:string}>;
  author_name: string;
  author_phone: string;
}
