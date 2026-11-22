import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.API_PORT || 3001);
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', async (_req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ ok: true, database: 'PostgreSQL', orm: 'Prisma' }); }
  catch { res.status(503).json({ ok: false, error: 'PostgreSQL connection failed' }); }
});

app.get('/api/state', async (_req, res) => {
  try {
    const [actors, infrastructure, linkages, reports, settings] = await Promise.all([
      prisma.threatActor.findMany({ orderBy: { id: 'asc' }, select: { data: true } }),
      prisma.infrastructure.findMany({ orderBy: { id: 'asc' }, select: { data: true } }),
      prisma.actorLinkage.findMany({ orderBy: { id: 'asc' }, select: { data: true } }),
      prisma.auditReport.findMany({ orderBy: { id: 'asc' }, select: { data: true } }),
      prisma.appSettings.findUnique({ where: { id: 1 }, select: { data: true } })
    ]);
    res.json({ actors: actors.map(r => r.data), infrastructure: infrastructure.map(r => r.data), linkages: linkages.map(r => r.data), reports: reports.map(r => r.data), settings: settings?.data });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Could not read PostgreSQL data' }); }
});

app.put('/api/state', async (req, res) => {
  const state = req.body;
  if (!state || !Array.isArray(state.actors) || !Array.isArray(state.infrastructure) || !Array.isArray(state.linkages) || !Array.isArray(state.reports)) return res.status(400).json({ error: 'Invalid database snapshot' });
  try {
    await prisma.$transaction(async tx => {
      await tx.infrastructure.deleteMany();
      await tx.actorLinkage.deleteMany();
      await tx.auditReport.deleteMany();
      await tx.threatActor.deleteMany();
      for (const actor of state.actors) await tx.threatActor.create({ data: { id: actor.id, handle: actor.handle, category: actor.category, confidenceScore: actor.confidenceScore ?? 50, data: actor } });
      for (const item of state.infrastructure) await tx.infrastructure.create({ data: { id: item.id, actorId: item.actorId || null, onionAddress: item.onionAddress, data: item } });
      for (const link of state.linkages) await tx.actorLinkage.create({ data: { id: link.id, sourceActorId: link.sourceActorId, targetActorId: link.targetActorId, linkageType: link.linkageType, confidence: link.confidence, data: link } });
      for (const report of state.reports) await tx.auditReport.create({ data: { id: report.id, data: report } });
      if (state.settings) await tx.appSettings.upsert({ where: { id: 1 }, create: { id: 1, data: state.settings }, update: { data: state.settings } });
    });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.code === 'P2003' ? 'A record references an actor that does not exist.' : error.code === 'P2002' ? 'A unique value already exists.' : 'Prisma transaction failed; no changes were saved.' });
  }
});

app.listen(port, () => console.log(`TraceNet Prisma API listening on http://localhost:${port}`));
process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
