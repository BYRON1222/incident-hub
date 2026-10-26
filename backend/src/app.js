const express = require('express');
const cors = require('cors');
const { createRepo } = require('./repo');
const { ESTADOS, PRIORIDADES, CATEGORIAS, puedeTransicionar, validarNuevo, calcularDashboard } = require('./domain');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function createApp(repo = createRepo()) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/api/meta', (_req, res) => res.json({ estados: ESTADOS, prioridades: PRIORIDADES, categorias: CATEGORIAS }));

  app.post('/api/incidents', wrap(async (req, res) => {
    const errores = validarNuevo(req.body);
    if (errores.length) return res.status(400).json({ errores });
    const { titulo, descripcion, categoria, prioridad, usuario } = req.body;
    const inc = await repo.create({ titulo: titulo.trim(), descripcion: descripcion.trim(), categoria, prioridad, usuario: usuario.trim() });
    await repo.addEntry(inc.id, { autor: inc.usuario, texto: 'Incidente creado', tipo: 'SISTEMA' });
    res.status(201).json(inc);
  }));

  app.get('/api/incidents', wrap(async (req, res) => {
    const { estado, prioridad, categoria, tecnico } = req.query;
    res.json(await repo.list({ estado, prioridad, categoria, tecnico }));
  }));

  app.get('/api/incidents/:id', wrap(async (req, res) => {
    const inc = await repo.get(Number(req.params.id));
    if (!inc) return res.status(404).json({ error: 'Incidente no encontrado' });
    res.json(inc);
  }));

  app.patch('/api/incidents/:id/assign', wrap(async (req, res) => {
    const id = Number(req.params.id);
    const tecnico = (req.body.tecnico || '').trim();
    if (!tecnico) return res.status(400).json({ errores: ['tecnico es obligatorio'] });
    const actual = await repo.get(id);
    if (!actual) return res.status(404).json({ error: 'Incidente no encontrado' });
    if (actual.estado === 'CERRADO') return res.status(409).json({ error: 'Un incidente cerrado no se puede reasignar' });
    const patch = { tecnico };
    if (actual.estado === 'NUEVO') patch.estado = 'ASIGNADO';
    const inc = await repo.update(id, patch);
    await repo.addEntry(id, { autor: tecnico, texto: `Asignado a ${tecnico}`, tipo: 'SISTEMA' });
    res.json(inc);
  }));

  app.patch('/api/incidents/:id/status', wrap(async (req, res) => {
    const id = Number(req.params.id);
    const { estado } = req.body;
    if (!ESTADOS.includes(estado)) return res.status(400).json({ errores: [`estado debe ser uno de: ${ESTADOS.join(', ')}`] });
    const actual = await repo.get(id);
    if (!actual) return res.status(404).json({ error: 'Incidente no encontrado' });
    if (!puedeTransicionar(actual.estado, estado)) {
      return res.status(409).json({ error: `Transición no permitida: ${actual.estado} -> ${estado}` });
    }
    const inc = await repo.update(id, { estado });
    await repo.addEntry(id, { autor: actual.tecnico || 'sistema', texto: `Estado: ${actual.estado} -> ${estado}`, tipo: 'SISTEMA' });
    res.json(inc);
  }));

  app.post('/api/incidents/:id/comments', wrap(async (req, res) => {
    const id = Number(req.params.id);
    const { autor, texto } = req.body;
    if (!autor || !texto || !String(texto).trim()) return res.status(400).json({ errores: ['autor y texto son obligatorios'] });
    if (!(await repo.get(id))) return res.status(404).json({ error: 'Incidente no encontrado' });
    res.status(201).json(await repo.addEntry(id, { autor, texto: String(texto).trim(), tipo: 'COMENTARIO' }));
  }));

  app.get('/api/dashboard', wrap(async (_req, res) => {
    res.json(calcularDashboard(await repo.list({})));
  }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  });

  return app;
}

module.exports = { createApp };
