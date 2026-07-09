import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { postCategories } from "../db/schema/categories";


export async function addCategory(categoryId:string, postId:string) {
    try {
        await db.insert(postCategories).values({categoryId:categoryId, postId:postId})
        console.log(`Added category ${categoryId} to post ${postId}`);
    }catch(error) {
        console.log("Error while adding category:", error);
    }
}

export async function removeCategory(categoryId:string, postId:string) {
    try {
        await db.delete(postCategories).where(and(eq(postCategories.categoryId, categoryId), eq(postCategories.postId, postId)));

        console.log(`Removed category ${categoryId} to post ${postId}`);
    }catch(error) {
        console.log("Error while removing category:", error);
    }
}
