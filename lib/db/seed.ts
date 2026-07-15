import { db } from "./index";
import { createUser } from "./mutations/users";
import { categories } from "./schema/categories";
import { contents } from "./schema/contents";

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

createAdminAccount();
contentTypes();
