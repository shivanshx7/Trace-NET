import { Prisma, PrismaClient } from '@prisma/client';
import { INITIAL_ACTORS, INITIAL_INFRASTRUCTURE, INITIAL_LINKAGES, INITIAL_REPORTS, DEFAULT_SETTINGS } from '../src/data/sampleData.ts';

const prisma = new PrismaClient();
const asJson = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value));

async function main() {
  await prisma.$transaction(async tx => {
    for (const actor of INITIAL_ACTORS) await tx.threatActor.upsert({ where: { id: actor.id }, create: { id: actor.id, handle: actor.handle, category: actor.category, confidenceScore: actor.confidenceScore, data: asJson(actor) }, update: {} });
    for (const item of INITIAL_INFRASTRUCTURE) await tx.infrastructure.upsert({ where: { id: item.id }, create: { id: item.id, actorId: item.actorId || null, onionAddress: item.onionAddress, data: asJson(item) }, update: {} });
    for (const link of INITIAL_LINKAGES) await tx.actorLinkage.upsert({ where: { id: link.id }, create: { id: link.id, sourceActorId: link.sourceActorId, targetActorId: link.targetActorId, linkageType: link.linkageType, confidence: link.confidence, data: asJson(link) }, update: {} });
    for (const report of INITIAL_REPORTS) await tx.auditReport.upsert({ where: { id: report.id }, create: { id: report.id, data: asJson(report) }, update: {} });
    await tx.appSettings.upsert({ where: { id: 1 }, create: { id: 1, data: asJson(DEFAULT_SETTINGS) }, update: { data: asJson(DEFAULT_SETTINGS) } });
  });
  console.log('TraceNet sample data seeded into PostgreSQL.');
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
