const { puedeTransicionar, validarNuevo, calcularDashboard } = require('../backend/src/domain');

describe('dominio', () => {
  test('transiciones válidas e inválidas', () => {
    expect(puedeTransicionar('NUEVO', 'ASIGNADO')).toBe(true);
    expect(puedeTransicionar('NUEVO', 'CERRADO')).toBe(false);
    expect(puedeTransicionar('CERRADO', 'NUEVO')).toBe(false);
  });

  test('validarNuevo detecta campos faltantes', () => {
    expect(validarNuevo({}).length).toBe(5);
    expect(validarNuevo({ titulo: 'a', descripcion: 'b', usuario: 'c', categoria: 'RED', prioridad: 'ALTA' })).toEqual([]);
  });

  test('calcularDashboard agrupa correctamente', () => {
    const d = calcularDashboard([
      { estado: 'NUEVO', prioridad: 'CRITICA', categoria: 'RED', tecnico: null },
      { estado: 'CERRADO', prioridad: 'BAJA', categoria: 'RED', tecnico: 'ana' },
    ]);
    expect(d).toMatchObject({ total: 2, abiertos: 1, cerrados: 1, criticos: 1 });
    expect(d.porCategoria.RED).toBe(2);
    expect(d.porTecnico.SIN_ASIGNAR).toBe(1);
  });
});
