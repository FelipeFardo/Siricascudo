ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cart_id_products_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "cart_items_cart_id_product_id_key";--> statement-breakpoint
ALTER TABLE "cart_items" ADD COLUMN "product_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cart_items_cart_id_product_id_key" ON "cart_items" USING btree ("cart_id","product_id");