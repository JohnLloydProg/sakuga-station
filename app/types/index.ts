
interface Author {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface Category {
    id: string;
    name: string;
}

interface ClientPost {
    id: string;
    title: string;
    slug: string;
    author: Author;
    body: string;
    thumbnail: string;
    categories: Category[];
    publishedAt: Date;
}

interface ClientContent {
    id: string;
    type: string;
    payload: string;
    index: number;
}

interface ClientCompletePost {
    id: string;
    title: string;
    slug: string;
    author: Author;
    body: string;
    thumbnail: string;
    categories: Category[];
    publishedAt: Date;
    contents: ClientContent[]
}

interface ClientComment {
    id: string;
    authorName: string;
    body: string;
    createdAt: Date;   
}
