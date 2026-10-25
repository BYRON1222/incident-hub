const FILTROS = ['estado', 'prioridad', 'categoria', 'tecnico'];

function createMemoryRepo() {
  let seq = 1;
  const incidentes = new Map();
  const entradas = [];
  return {
    async create(d) {
      const inc = { id: seq++, ...d, estado: 'NUEVO', tecnico: null, fecha: new Date().toISOString() };
      incidentes.set(inc.id, inc);
      return { ...inc };
    },
    async list(f = {}) {
      return [...incidentes.values()]
        .filter((i) => FILTROS.every((k) => !f[k] || i[k] === f[k]))
        .map((i) => ({ ...i }))
        .sort((a, b) => b.id - a.id);
    },
    async get(id) {
      const i = incidentes.get(id);
      if (!i) return null;
      return { ...i, bitacora: entradas.filter((e) => e.incident_id === id) };
    },
    async update(id, patch) {
      const i = incidentes.get(id);
      if (!i) return null;
      Object.assign(i, patch);
      return { ...i };
    },
    async addEntry(id, { autor, texto, tipo }) {
      const e = { id: entradas.length + 1, incident_id: id, autor, texto, tipo, fecha: new Date().toISOString() };
      entradas.push(e);
      return e;
    },
  };
}

function createPgRepo(connectionString = process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString });
  return {
    async create(d) {
      const { rows } = await pool.query(
        'INSERT INTO incidents (titulo, descripcion, categoria, prioridad, usuario) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [d.titulo, d.descripcion, d.categoria, d.prioridad, d.usuario]
      );
      return rows[0];
    },
    async list(f = {}) {
      const where = [];
      const vals = [];
      FILTROS.forEach((c) => {
        if (f[c]) {
          vals.push(f[c]);
          where.push(`${c} = $${vals.length}`);
        }
      });
      const sql = `SELECT * FROM incidents ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id DESC`;
      const { rows } = await pool.query(sql, vals);
      return rows;
    },
    async get(id) {
      const { rows } = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);
      if (!rows[0]) return null;
      const b = await pool.query('SELECT * FROM bitacora WHERE incident_id = $1 ORDER BY id', [id]);
      return { ...rows[0], bitacora: b.rows };
    },
    async update(id, patch) {
      const sets = [];
      const vals = [];
      ['estado', 'tecnico'].forEach((k) => {
        if (k in patch) {
          vals.push(patch[k]);
          sets.push(`${k} = $${vals.length}`);
        }
      });
      if (!sets.length) return null;
      vals.push(id);
      const { rows } = await pool.query(`UPDATE incidents SET ${sets.join(', ')} WHERE id = $${vals.length} RETURNING *`, vals);
      return rows[0] || null;
    },
    async addEntry(id, { autor, texto, tipo }) {
      const { rows } = await pool.query(
        'INSERT INTO bitacora (incident_id, autor, texto, tipo) VALUES ($1,$2,$3,$4) RETURNING *',
        [id, autor, texto, tipo]
      );
      return rows[0];
    },
    async close() {
      await pool.end();
    },
  };
}

function createRepo() {
  return process.env.STORE === 'memory' || !process.env.DATABASE_URL ? createMemoryRepo() : createPgRepo();
}

module.exports = { createMemoryRepo, createPgRepo, createRepo };
