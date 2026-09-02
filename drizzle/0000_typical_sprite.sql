CREATE TABLE "concepto_pago" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"precio_unitario" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cuenta_semanal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empleada_id" uuid NOT NULL,
	"fecha_inicio" date NOT NULL,
	"fecha_fin" date NOT NULL,
	"total" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "empleada" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "trabajo_realizado" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empleada_id" uuid NOT NULL,
	"concepto_id" uuid,
	"precio_historico" integer NOT NULL,
	"cantidad" integer NOT NULL,
	"fecha" date NOT NULL,
	"cuenta_semanal_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cuenta_semanal" ADD CONSTRAINT "cuenta_semanal_empleada_id_empleada_id_fk" FOREIGN KEY ("empleada_id") REFERENCES "public"."empleada"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trabajo_realizado" ADD CONSTRAINT "trabajo_realizado_empleada_id_empleada_id_fk" FOREIGN KEY ("empleada_id") REFERENCES "public"."empleada"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trabajo_realizado" ADD CONSTRAINT "trabajo_realizado_concepto_id_concepto_pago_id_fk" FOREIGN KEY ("concepto_id") REFERENCES "public"."concepto_pago"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trabajo_realizado" ADD CONSTRAINT "trabajo_realizado_cuenta_semanal_id_cuenta_semanal_id_fk" FOREIGN KEY ("cuenta_semanal_id") REFERENCES "public"."cuenta_semanal"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_trabajo_cuenta" ON "trabajo_realizado" USING btree ("cuenta_semanal_id");