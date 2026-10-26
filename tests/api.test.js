const request = require('supertest');
const { createApp } = require('../backend/src/app');
const { createMemoryRepo } = require('../backend/src/repo');

const base = { titulo: 'No hay internet', descripcion: 'Piso 2 sin red', categoria: 'RED', prioridad: 'CRITICA', usuario: 'maria' };

describe('API de incidentes', () => {
  let app;
  beforeEach(() => {
    app = createApp(createMemoryRepo());
  });

  test('health responde ok', async () => {
    const r = await request(app).get('/health');
    expect(r.body.status).toBe('ok');
  });

  test('crea y consulta un incidente', async () => {
    const c = await request(app).post('/api/incidents').send(base);
    expect(c.status).toBe(201);
    expect(c.body.estado).toBe('NUEVO');
    const g = await request(app).get(`/api/incidents/${c.body.id}`);
    expect(g.status).toBe(200);
    expect(g.body.bitacora).toHaveLength(1);
  });

  test('rechaza datos inválidos', async () => {
    const r = await request(app).post('/api/incidents').send({ titulo: '' });
    expect(r.status).toBe(400);
    expect(r.body.errores.length).toBeGreaterThan(0);
  });

  test('404 si no existe', async () => {
    expect((await request(app).get('/api/incidents/999')).status).toBe(404);
  });

  test('filtros por estado, prioridad, categoría y técnico', async () => {
    await request(app).post('/api/incidents').send(base);
    const b = await request(app).post('/api/incidents').send({ ...base, categoria: 'SOFTWARE', prioridad: 'BAJA' });
    await request(app).patch(`/api/incidents/${b.body.id}/assign`).send({ tecnico: 'luis' });
    expect((await request(app).get('/api/incidents?categoria=RED')).body).toHaveLength(1);
    expect((await request(app).get('/api/incidents?prioridad=BAJA')).body).toHaveLength(1);
    expect((await request(app).get('/api/incidents?estado=ASIGNADO')).body).toHaveLength(1);
    expect((await request(app).get('/api/incidents?tecnico=luis')).body).toHaveLength(1);
  });

  test('flujo completo de estados', async () => {
    const { body } = await request(app).post('/api/incidents').send(base);
    const id = body.id;
    const a = await request(app).patch(`/api/incidents/${id}/assign`).send({ tecnico: 'luis' });
    expect(a.body.estado).toBe('ASIGNADO');
    for (const estado of ['EN_PROCESO', 'RESUELTO', 'CERRADO']) {
      const r = await request(app).patch(`/api/incidents/${id}/status`).send({ estado });
      expect(r.status).toBe(200);
      expect(r.body.estado).toBe(estado);
    }
    expect((await request(app).patch(`/api/incidents/${id}/assign`).send({ tecnico: 'otro' })).status).toBe(409);
  });

  test('transición inválida devuelve 409', async () => {
    const { body } = await request(app).post('/api/incidents').send(base);
    const r = await request(app).patch(`/api/incidents/${body.id}/status`).send({ estado: 'CERRADO' });
    expect(r.status).toBe(409);
  });

  test('comentarios quedan en la bitácora', async () => {
    const { body } = await request(app).post('/api/incidents').send(base);
    const c = await request(app).post(`/api/incidents/${body.id}/comments`).send({ autor: 'luis', texto: 'Revisando switch' });
    expect(c.status).toBe(201);
    const g = await request(app).get(`/api/incidents/${body.id}`);
    expect(g.body.bitacora.map((e) => e.tipo)).toEqual(['SISTEMA', 'COMENTARIO']);
    expect((await request(app).post(`/api/incidents/${body.id}/comments`).send({})).status).toBe(400);
  });

  test('dashboard', async () => {
    await request(app).post('/api/incidents').send(base);
    const d = await request(app).get('/api/dashboard');
    expect(d.body).toMatchObject({ total: 1, abiertos: 1, cerrados: 0, criticos: 1 });
  });
});
