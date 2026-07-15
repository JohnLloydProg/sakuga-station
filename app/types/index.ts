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
	reads: number;
	body: string | null;
	thumbnail: string | null;
	categories: Category[];
	publishedAt: Date | null;
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
	reads: number;
	body: string | null;
	thumbnail: string | null;
	commentApproval: boolean;
	categories: Category[];
	publishedAt: Date | null;
	contents: ClientContent[];
}

interface ClientComment {
	id: string;
	authorName: string;
	body: string;
	createdAt: Date;
}
