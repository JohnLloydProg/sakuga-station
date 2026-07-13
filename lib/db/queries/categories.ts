import { db } from "../index";

export async function getCategories(): Promise<Category[]> {
	try {
		const categories = await db.query.categories.findMany();

		console.log(`Returned ${categories.length} categories`);

		return categories;
	} catch (error) {
		console.log("Error while getting categories:", error);
		return [];
	}
}
