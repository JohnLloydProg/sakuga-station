import { db } from "../db/index";
import { Content } from "../db/schema/contents";


export async function getContentTypes():Promise<Content[]> {
    try {
        const contentTypes = await db.query.contents.findMany();

        console.log(`Returned ${contentTypes.length} content types`);

        return contentTypes;
    }catch (error) {
        console.log("Error while getting content types:", error);
        return [];
    }
}
