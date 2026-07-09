import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { emails, subscriptions } from "../db/schema/emails";


export async function subscribe(categoryId:string, address:string) {
    try {
        let email = await db.query.emails.findFirst({where: {address:address}});
        if (!email) {
            email = (await db.insert(emails).values({address: address}).returning()).at(0);
            if (!email) return;
        }
        await db.insert(subscriptions).values({categoryId:categoryId, emailId:email.id})
        console.log(`Successfully subscribed to category ${categoryId}`);
    }catch(error) {
        console.log("Error while subscribing:", error);
    }
}

export async function unsubscribe(categoryId:string, address:string) {
    try {
        const email = await db.query.emails.findFirst({where: {address:address}});
        if (!email) return;

        await db.delete(subscriptions).where(and(eq(subscriptions.categoryId, categoryId), eq(subscriptions.emailId, email.id)));

        console.log(`Unsubcribed email ${address} to category ${categoryId}`);
    }catch(error) {
        console.log("Error while unsubsribing:", error);
    }
}
