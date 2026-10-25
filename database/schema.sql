CREATE TABLE IF NOT EXISTS incidents (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria   VARCHAR(20) NOT NULL CHECK (categoria IN ('HARDWARE','SOFTWARE','RED','ACCESOS','OTRO')),
  prioridad   VARCHAR(10) NOT NULL CHECK (prioridad IN ('BAJA','MEDIA','ALTA','CRITICA')),
  usuario     VARCHAR(100) NOT NULL,
  fecha       TIMESTAMPTZ NOT NULL DEFAULT now(),
  estado      VARCHAR(12) NOT NULL DEFAULT 'NUEVO' CHECK (estado IN ('NUEVO','ASIGNADO','EN_PROCESO','RESUELTO','CERRADO')),
  tecnico     VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS bitacora (
  id          SERIAL PRIMARY KEY,
  incident_id INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  autor       VARCHAR(100) NOT NULL,
  texto       TEXT NOT NULL,
  tipo        VARCHAR(12) NOT NULL DEFAULT 'COMENTARIO' CHECK (tipo IN ('COMENTARIO','SISTEMA')),
  fecha       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_incidents_estado ON incidents(estado);
CREATE INDEX IF NOT EXISTS idx_bitacora_incident ON bitacora(incident_id);
