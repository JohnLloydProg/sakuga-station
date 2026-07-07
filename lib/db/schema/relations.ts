import { defineRelations } from "drizzle-orm";
import { sessions, users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";
import { contents, postContents } from "./contents";
import { categories, postCategories } from "./categories";
import { emails, subscriptions } from "./emails";

export const usersRelations = defineRelations({users, posts}, (r) => ({
    posts: {
        author: r.one.users({
            from: r.posts.authorId,
            to: r.users.id
        })
    },
    users: {
        posts: r.many.posts()
    }
}));

export const sessionsRelations = defineRelations({users, sessions}, (r) => ({
    sessions: {
        users: r.one.users({
            from: r.sessions.userId,
            to: r.users.id
        })
    },
    users: {
        session: r.one.sessions()
    }
}));

export const postCommentsRelations = defineRelations({posts, comments}, (r) => ({
    comments: {
        post: r.one.posts({
            from: r.comments.postId,
            to: r.posts.id
        })
    },
    posts: {
        comments: r.many.comments()
    }
}));

export const postContentsRelations = defineRelations({posts, postContents, contents}, (r) => ({
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
    posts: {
        contents: r.many.postContents()
    },
    contents: {
        usage: r.many.postContents()
    }
}));

export const postCategoriesRelations = defineRelations({posts, categories, postCategories}, (r) => ({
    posts: {
        categories: r.many.categories({
            from: r.posts.id.through(r.postCategories.postId),
            to: r.categories.id.through(r.postCategories.categoryId)
        })
    },
    categories: {
        posts: r.many.posts()
    }
}));

export const categoryEmailsRelations = defineRelations({categories, emails, subscriptions}, (r) => ({
    categories: {
        emails: r.many.emails({
            from: r.categories.id.through(r.subscriptions.categoryId),
            to: r.emails.id.through(r.subscriptions.emailId)
        })
    },
    emails: {
        categories: r.many.categories()
    }
}));