import {PGlite} from "@electric-sql/pglite";

let db_instance = null;

export async function initDb() {
    if (!db_instance) {
        db_instance = (async () => {
            const db = await PGlite.create({
                // static method returns a ready instance
                dataDir: "idb://patient-db",
            });

            // 2) Create the patients table with constraints
            await db.exec(`
                CREATE TABLE IF NOT EXISTS patients (
                id             SERIAL PRIMARY KEY,
                fullname       TEXT    NOT NULL,
                age            INTEGER CHECK (age > 0),
                contact        TEXT    NOT NULL CHECK (length(contact) = 10),
                disease        TEXT    NOT NULL,
                gender         TEXT    NOT NULL CHECK (gender IN ('male','female','other')),
                created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `);
            return db;
        })();
    }

    return db_instance;
}
