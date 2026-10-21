import { drizzle } from "drizzle-orm/neon-http";
import * as appSchema from "./schema";
import * as authSchema from "./auth-schema";

export const db = drizzle(process.env.DATABASE_URL!, {
    schema: { ...appSchema, ...authSchema },
});