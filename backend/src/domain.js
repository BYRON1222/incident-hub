const ESTADOS = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
const CATEGORIAS = ['HARDWARE', 'SOFTWARE', 'RED', 'ACCESOS', 'OTRO'];

const TRANSICIONES = {
  NUEVO: ['ASIGNADO'],
  ASIGNADO: ['EN_PROCESO'],
  EN_PROCESO: ['RESUELTO'],
  RESUELTO: ['CERRADO', 'EN_PROCESO'],
  CERRADO: [],
};

function puedeTransicionar(desde, hacia) {
  return (TRANSICIONES[desde] || []).includes(hacia);
}

function validarNuevo(body = {}) {
  const errores = [];
  const texto = (v) => typeof v === 'string' && v.trim().length > 0;
  if (!texto(body.titulo)) errores.push('titulo es obligatorio');
  if (!texto(body.descripcion)) errores.push('descripcion es obligatoria');
  if (!texto(body.usuario)) errores.push('usuario es obligatorio');
  if (!CATEGORIAS.includes(body.categoria)) errores.push(`categoria debe ser una de: ${CATEGORIAS.join(', ')}`);
  if (!PRIORIDADES.includes(body.prioridad)) errores.push(`prioridad debe ser una de: ${PRIORIDADES.join(', ')}`);
  return errores;
}

function calcularDashboard(incidentes) {
  const contar = (campo) =>
    incidentes.reduce((acc, i) => {
      const clave = i[campo] || 'SIN_ASIGNAR';
      acc[clave] = (acc[clave] || 0) + 1;
      return acc;
    }, {});
  return {
    total: incidentes.length,
    abiertos: incidentes.filter((i) => i.estado !== 'CERRADO').length,
    cerrados: incidentes.filter((i) => i.estado === 'CERRADO').length,
    criticos: incidentes.filter((i) => i.prioridad === 'CRITICA' && i.estado !== 'CERRADO').length,
    porCategoria: contar('categoria'),
    porTecnico: contar('tecnico'),
  };
}

module.exports = { ESTADOS, PRIORIDADES, CATEGORIAS, puedeTransicionar, validarNuevo, calcularDashboard };
