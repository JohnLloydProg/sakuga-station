import { db } from "./index";
import { createPost } from "./mutations/posts";
import { createUser } from "./mutations/users";
import { getUserByEmailPassword } from "./queries/users";
import { categories } from "./schema/categories";
import { contents } from "./schema/contents";
import type { posts } from "./schema/posts";

const contentNames = ["Section", "Picture"];
const categoryNames = [
	"Romance",
	"Isekai",
	"Shounen",
	"Action",
	"Adventure",
	"Fantasy",
	"Slice of Life",
];

async function contentTypes() {
	for (const name of contentNames) {
		await db.insert(contents).values({ name: name });
	}

	for (const category of categoryNames) {
		await db.insert(categories).values({ name: category });
	}
}

async function createAdminAccount() {
	if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
	await createUser({
		email: process.env.ADMIN_EMAIL,
		firstName: "Admin",
		lastName: "Admin",
		password: process.env.ADMIN_PASSWORD,
		isAdmin: true,
	});
}

async function seedPosts() {
	if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return;
	const user = await getUserByEmailPassword(
		process.env.ADMIN_EMAIL,
		process.env.ADMIN_PASSWORD,
	);
	if (!user) return;

	const postData: (typeof posts.$inferInsert)[] = [
		{
			title:
				"What Happens After You Save the World? Why Frieren: Beyond Journey’s End is a Masterpiece of Melancholy",
			authorId: user.id,
			slug: crypto.randomUUID(),
			body: "Most fantasy stories end with the hero defeating the Demon King, the crowd cheering, and the credits rolling. But Frieren: Beyond Journey’s End asks a much quieter, more beautiful question: What happens next?",
		},
		{
			title:
				"Aliens, Ghosts, and Lost Organs: Why Dandadan is the Most Chaos-Fueled Ride in Anime Right Now",
			authorId: user.id,
			slug: crypto.randomUUID(),
			body: "If you've ever felt like modern anime is getting a bit too predictable, let Dandadan blast you into orbit. This show is a brilliant, neon-colored fever dream that refuses to let you catch your breath.",
		},
		{
			title:
				"Cooking Your Way Through a Crisis: How Delicious in Dungeon Perfects Fantasy Worldbuilding",
			authorId: user.id,
			slug: crypto.randomUUID(),
			body: "At first glance, Delicious in Dungeon (known in Japan as Dungeon Meshi) looks like a gag anime. After his sister is swallowed by a red dragon, a knight named Laios and his party head back into the depths to rescue her before she's fully digested. But because they lost all their supplies, they decide to live off the land—by cooking and eating the monsters they kill.",
		},
	];

	for (const data of postData) {
		await createPost(data);
	}
}

createAdminAccount();
contentTypes();
seedPosts();
