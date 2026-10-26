const json = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data.errores && data.errores.join(', ')) || data.error || 'Error de red');
  return data;
};
const send = (method, url, body) =>
  fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(json);

export const api = {
  meta: () => fetch('/api/meta').then(json),
  list: (f) => fetch('/api/incidents?' + new URLSearchParams(Object.entries(f).filter(([, v]) => v))).then(json),
  get: (id) => fetch(`/api/incidents/${id}`).then(json),
  create: (b) => send('POST', '/api/incidents', b),
  assign: (id, tecnico) => send('PATCH', `/api/incidents/${id}/assign`, { tecnico }),
  status: (id, estado) => send('PATCH', `/api/incidents/${id}/status`, { estado }),
  comment: (id, autor, texto) => send('POST', `/api/incidents/${id}/comments`, { autor, texto }),
  dashboard: () => fetch('/api/dashboard').then(json),
};
