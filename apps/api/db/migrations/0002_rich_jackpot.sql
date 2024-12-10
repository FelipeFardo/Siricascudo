DO $$ BEGIN
 CREATE TYPE "public"."order_pay_method" AS ENUM('money', 'card');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pay_method" "order_pay_method" DEFAULT 'money';