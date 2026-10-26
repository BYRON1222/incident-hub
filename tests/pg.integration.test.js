const { createPgRepo } = require('../backend/src/repo');

const suite = process.env.DATABASE_URL ? describe : describe.skip;

suite('repositorio PostgreSQL (requiere DATABASE_URL)', () => {
  let repo;
  beforeAll(() => {
    repo = createPgRepo();
  });
  afterAll(async () => {
    await repo.close();
  });

  test('crea, asigna y registra bitácora', async () => {
    const inc = await repo.create({ titulo: 't', descripcion: 'd', categoria: 'RED', prioridad: 'ALTA', usuario: 'u' });
    expect(inc.estado).toBe('NUEVO');
    const upd = await repo.update(inc.id, { tecnico: 'ana', estado: 'ASIGNADO' });
    expect(upd.tecnico).toBe('ana');
    await repo.addEntry(inc.id, { autor: 'ana', texto: 'hola', tipo: 'COMENTARIO' });
    const full = await repo.get(inc.id);
    expect(full.bitacora).toHaveLength(1);
    expect((await repo.list({ tecnico: 'ana' })).length).toBeGreaterThan(0);
  });
});
