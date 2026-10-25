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
| Desarrollo / Product Owner | BYRON ERNESTO COXAJ MUNDO (BYRON1222) |
| Revisor de código (QA) | BYRON1222 (misma cuenta, ver nota) |
| Aprobador de releases (Ops) | BYRON1222 (misma cuenta, ver nota) |

## Enlaces
- Azure DevOps: https://dev.azure.com/bcoxajm/incident-hub
- Repositorios: Azure Repos https://dev.azure.com/bcoxajm/incident-hub/_git/incident-hub-semana1 · GitHub https://github.com/BYRON1222/incident-hub

## Nota sobre el equipo y las revisiones
Este proyecto estaba planeado para un equipo de 4 personas y se cambió a individual por indicación del docente. La organización de Azure DevOps pertenece al directorio de la UMG, que no permite invitar cuentas externas, por lo que se trabajó con una sola cuenta (BYRON1222 / bcoxajm@miumg.edu.gt).

Para conservar la trazabilidad:
- Cada cambio se hace en una rama `feature/*`, `fix/*`, `refactor/*` o `docs/*` y se integra por Pull Request con work item vinculado (AB#ID).
- Cada PR incluye comentarios de revisión y evidencia de validación (lint, pruebas, pipeline).
- La política de `main` exige 1 aprobación y se habilitó que el autor apruebe su propio PR por ser proyecto individual.
- Los commits de corrección posteriores a la revisión usan el autor "BYRON1222 (Revisor QA)".
