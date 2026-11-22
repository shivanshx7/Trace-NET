CREATE TABLE "threat_actors" (
  "id" TEXT NOT NULL,
  "handle" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "confidence_score" INTEGER NOT NULL DEFAULT 50,
  "data" JSONB NOT NULL,
  CONSTRAINT "threat_actors_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "threat_actors_handle_key" ON "threat_actors"("handle");

CREATE TABLE "infrastructure" (
  "id" TEXT NOT NULL,
  "actor_id" TEXT,
  "onion_address" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  CONSTRAINT "infrastructure_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "infrastructure_actor_id_idx" ON "infrastructure"("actor_id");
ALTER TABLE "infrastructure" ADD CONSTRAINT "infrastructure_actor_id_fkey"
  FOREIGN KEY ("actor_id") REFERENCES "threat_actors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "linkages" (
  "id" TEXT NOT NULL,
  "source_actor_id" TEXT NOT NULL,
  "target_actor_id" TEXT NOT NULL,
  "linkage_type" TEXT NOT NULL,
  "confidence" DOUBLE PRECISION NOT NULL,
  "data" JSONB NOT NULL,
  CONSTRAINT "linkages_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "linkages_source_actor_id_idx" ON "linkages"("source_actor_id");
CREATE INDEX "linkages_target_actor_id_idx" ON "linkages"("target_actor_id");
ALTER TABLE "linkages" ADD CONSTRAINT "linkages_source_actor_id_fkey"
  FOREIGN KEY ("source_actor_id") REFERENCES "threat_actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "linkages" ADD CONSTRAINT "linkages_target_actor_id_fkey"
  FOREIGN KEY ("target_actor_id") REFERENCES "threat_actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "audit_reports" (
  "id" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  CONSTRAINT "audit_reports_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "app_settings" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "data" JSONB NOT NULL,
  CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);
