import { defineRelations } from "drizzle-orm";
import { sessions, users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";
import { contents, postContents } from "./contents";
import { categories, postCategories } from "./categories";
import { emails, subscriptions } from "./emails";

export const usersRelations = defineRelations({users, posts, comments, sessions, contents, postContents, categories, postCategories, emails, subscriptions}, (r) => ({
    posts: {
        author: r.one.users({
            from: r.posts.authorId,
            to: r.users.id
        }),
        comments: r.many.comments(),
        contents: r.many.postContents(),
        categories: r.many.categories({
            from: r.posts.id.through(r.postCategories.postId),
            to: r.categories.id.through(r.postCategories.categoryId)
        })
    },
    users: {
        posts: r.many.posts(),
        session: r.one.sessions()
    },
    sessions: {
        users: r.one.users({
            from: r.sessions.userId,
            to: r.users.id
        })
    },
    comments: {
        post: r.one.posts({
            from: r.comments.postId,
            to: r.posts.id
        })
    },
    postContents: {
        type: r.one.contents({
            from: r.postContents.contentId,
            to: r.contents.id
        }),
        post: r.one.posts({
            from: r.postContents.postId,
            to: r.posts.id
        })
    },
    contents: {
        usage: r.many.postContents()
    },
    categories: {
        posts: r.many.posts(),
        emails: r.many.emails({
            from: r.categories.id.through(r.subscriptions.categoryId),
            to: r.emails.id.through(r.subscriptions.emailId)
        })
    },
    emails: {
        categories: r.many.categories()
    }
}));