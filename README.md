# IT Incident Hub

Aplicación web para registrar, asignar y dar seguimiento a incidentes de TI, construida como proyecto integrador DevOps (Azure Boards → Repos → Pipelines → Release).

## Stack
React (Vite) · Node.js/Express · PostgreSQL · Azure DevOps · GitHub Actions

## Requisitos
- Node.js 20+, npm
- PostgreSQL 16 (o `podman-compose`, ver `devops/docker-compose.yml`)
- Git

## Instalación y ejecución (Fedora)
```bash
sudo dnf install -y git nodejs npm podman-compose postgresql

# Base de datos (opcional; sin DATABASE_URL la API usa memoria)
export POSTGRES_PASSWORD='elige-una-clave-local'
podman-compose -f devops/docker-compose.yml up -d
export DATABASE_URL="postgres://incident:${POSTGRES_PASSWORD}@localhost:5432/incidenthub"

# Backend (http://localhost:3000)
cd backend && npm ci && npm start

# Frontend (http://localhost:5173), en otra terminal
cd frontend && npm ci && npm run dev
```

## Pruebas
```bash
cd backend && npm run lint && npm test
```

## API
| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/incidents | Crear incidente |
| GET | /api/incidents?estado=&prioridad=&categoria=&tecnico= | Listar/filtrar |
| GET | /api/incidents/:id | Detalle con bitácora |
| PATCH | /api/incidents/:id/assign | Asignar técnico `{tecnico}` |
| PATCH | /api/incidents/:id/status | Cambiar estado `{estado}` |
| POST | /api/incidents/:id/comments | Comentario `{autor, texto}` |
| GET | /api/dashboard | Indicadores |

Estados: NUEVO → ASIGNADO → EN_PROCESO → RESUELTO → CERRADO.

## Documentación
`docs/`: architecture, branching, technical-debt, security, dependencies, release-strategy.

## Responsables
| Rol | Usuario |
|---|---|
| Desarrollo / Product Owner | _tu nombre_ |
| Revisor de código (QA) | _usuario 2_ |
| Aprobador de releases (Ops) | _usuario 3_ |

## Enlaces
- Azure DevOps: _URL_
- Repositorios: _semana 1_ · _semana 2_ · _semana 3_
