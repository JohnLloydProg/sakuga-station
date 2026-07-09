import { db } from "./index";
import { categories } from "./schema/categories";
import { contents } from "./schema/contents";


const contentNames = ["Header", "Picture", "Paragraph"];
const categoryNames = ["Romance", "Isekai", "Shounen"];
async function contentTypes() {
    for (const name of contentNames) {
        await db.insert(contents).values({name:name});
    }

    for (const category of categoryNames) {
        await db.insert(categories).values({name:category});
    }
}

contentTypes();
