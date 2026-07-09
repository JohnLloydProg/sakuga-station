
import { db } from "../db/index";


export async function getCommentsByPost(postId:string) {
    try {
        const commentsList = await db.query.comments.findMany({
            columns: {
                id: true,
                authorName:true,
                body: true,
                createdAt: true,
            },
            where: {
                postId:postId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        console.log(`Found ${commentsList.length} comments for post ${postId}.`);

        return commentsList;
    } catch (error) {
        console.log(`Error fetching comments for post "${postId}":`, error);
        return [];
    }
}
