DROP TABLE "sessions";--> statement-breakpoint
ALTER TABLE "carts" DROP CONSTRAINT "carts_session_id_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "session_id_key";--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN IF EXISTS "session_id";