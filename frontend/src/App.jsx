import React, { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

const vacio = { titulo: '', descripcion: '', categoria: 'SOFTWARE', prioridad: 'MEDIA', usuario: '' };

function Dashboard({ data }) {
  if (!data) return null;
  const lista = (obj) => Object.entries(obj).map(([k, v]) => <li key={k}>{k}: {v}</li>);
  return (
    <section className="cards">
      <div className="card"><b>{data.abiertos}</b><span>Abiertos</span></div>
      <div className="card"><b>{data.cerrados}</b><span>Cerrados</span></div>
      <div className="card crit"><b>{data.criticos}</b><span>Críticos</span></div>
      <div className="card"><span>Por categoría</span><ul>{lista(data.porCategoria)}</ul></div>
      <div className="card"><span>Por técnico</span><ul>{lista(data.porTecnico)}</ul></div>
    </section>
  );
}

function Formulario({ meta, onCreated, onError }) {
  const [f, setF] = useState(vacio);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.create(f);
      setF(vacio);
      onCreated();
    } catch (err) {
      onError(err.message);
    }
  };
  return (
    <form onSubmit={submit} className="panel">
      <h2>Nuevo incidente</h2>
      <input placeholder="Título" value={f.titulo} onChange={set('titulo')} />
      <textarea placeholder="Descripción" value={f.descripcion} onChange={set('descripcion')} />
      <input placeholder="Usuario que reporta" value={f.usuario} onChange={set('usuario')} />
      <select value={f.categoria} onChange={set('categoria')}>{meta.categorias.map((c) => <option key={c}>{c}</option>)}</select>
      <select value={f.prioridad} onChange={set('prioridad')}>{meta.prioridades.map((c) => <option key={c}>{c}</option>)}</select>
      <button type="submit">Crear</button>
    </form>
  );
}

function Detalle({ id, meta, onChanged, onError }) {
  const [inc, setInc] = useState(null);
  const [tecnico, setTecnico] = useState('');
  const [autor, setAutor] = useState('');
  const [texto, setTexto] = useState('');
  const cargar = useCallback(() => api.get(id).then(setInc).catch((e) => onError(e.message)), [id, onError]);
  useEffect(() => { cargar(); }, [cargar]);
  if (!inc) return null;
  const run = (p) => p.then(() => { cargar(); onChanged(); }).catch((e) => onError(e.message));
  return (
    <div className="panel">
      <h2>#{inc.id} {inc.titulo}</h2>
      <p>{inc.descripcion}</p>
      <p><b>{inc.estado}</b> · {inc.prioridad} · {inc.categoria} · {inc.usuario} · técnico: {inc.tecnico || '—'}</p>
      <div className="row">
        <input placeholder="Técnico" value={tecnico} onChange={(e) => setTecnico(e.target.value)} />
        <button onClick={() => run(api.assign(inc.id, tecnico))}>Asignar</button>
        <select value="" onChange={(e) => e.target.value && run(api.status(inc.id, e.target.value))}>
          <option value="">Cambiar estado…</option>
          {meta.estados.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <h3>Bitácora</h3>
      <ul className="log">
        {inc.bitacora.map((b) => <li key={b.id}><small>{new Date(b.fecha).toLocaleString()}</small> <b>{b.autor}</b> [{b.tipo}] {b.texto}</li>)}
      </ul>
      <div className="row">
        <input placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
        <input placeholder="Comentario" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <button onClick={() => run(api.comment(inc.id, autor, texto).then(() => setTexto('')))}>Comentar</button>
      </div>
    </div>
  );
}

export default function App() {
  const [meta, setMeta] = useState(null);
  const [incidentes, setIncidentes] = useState([]);
  const [dash, setDash] = useState(null);
  const [filtros, setFiltros] = useState({ estado: '', prioridad: '', categoria: '', tecnico: '' });
  const [sel, setSel] = useState(null);
  const [error, setError] = useState('');

  const refrescar = useCallback(() => {
    api.list(filtros).then(setIncidentes).catch((e) => setError(e.message));
    api.dashboard().then(setDash).catch((e) => setError(e.message));
  }, [filtros]);

  useEffect(() => { api.meta().then(setMeta).catch((e) => setError(e.message)); }, []);
  useEffect(() => { refrescar(); }, [refrescar]);

  if (!meta) return <p>Cargando… {error}</p>;
  const setF = (k) => (e) => setFiltros({ ...filtros, [k]: e.target.value });
  const opciones = (arr) => [<option key="" value="">Todos</option>, ...arr.map((x) => <option key={x}>{x}</option>)];

  return (
    <main>
      <h1>IT Incident Hub</h1>
      {error && <p className="error" onClick={() => setError('')}>{error}</p>}
      <Dashboard data={dash} />
      <Formulario meta={meta} onCreated={refrescar} onError={setError} />
      <section className="panel">
        <h2>Incidentes</h2>
        <div className="row">
          <select value={filtros.estado} onChange={setF('estado')}>{opciones(meta.estados)}</select>
          <select value={filtros.prioridad} onChange={setF('prioridad')}>{opciones(meta.prioridades)}</select>
          <select value={filtros.categoria} onChange={setF('categoria')}>{opciones(meta.categorias)}</select>
          <input placeholder="Técnico" value={filtros.tecnico} onChange={setF('tecnico')} />
        </div>
        <table>
          <thead><tr><th>#</th><th>Título</th><th>Estado</th><th>Prioridad</th><th>Categoría</th><th>Técnico</th></tr></thead>
          <tbody>
            {incidentes.map((i) => (
              <tr key={i.id} onClick={() => setSel(i.id)} className={sel === i.id ? 'sel' : ''}>
                <td>{i.id}</td><td>{i.titulo}</td><td>{i.estado}</td><td>{i.prioridad}</td><td>{i.categoria}</td><td>{i.tecnico || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {sel && <Detalle id={sel} meta={meta} onChanged={refrescar} onError={setError} />}
    </main>
  );
}
