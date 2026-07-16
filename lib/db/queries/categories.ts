import { connection } from "next/server";
import { db } from "../index";

export async function getCategories(): Promise<Category[]> {
	await connection();
	try {
		const categories = await db.query.categories.findMany();

		console.log(`Returned ${categories.length} categories`);

		return categories;
	} catch (error) {
		console.log("Error while getting categories:", error);
		return [];
	}
}
