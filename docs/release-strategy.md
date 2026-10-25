# Estrategia de release

## Versionado (SemVer)
| Versión | Contenido |
|---|---|
| v0.1.0 | API de incidentes + esquema BD (fin semana 1) |
| v0.2.0 | Frontend, filtros, dashboard, bitácora |
| v0.3.0 | Pipeline CI, agente autohospedado, GitHub Actions |
| v0.4.0 | Seguridad, dependencias y deuda técnica resuelta |
| v0.9.0-rc.1 | Release candidate desplegada en QA |
| v1.0.0 | Versión final aprobada en PROD |

## Ambientes y controles
| Ambiente | Disparador | Control |
|---|---|---|
| DEV | Cada merge a `main` | Automático + smoke test |
| QA | Tag `v*` | Aprobación de un usuario distinto al autor + smoke test |
| PROD | Después de QA | Aprobación manual + checklist abajo |

Los ambientes son *Environments* de Azure DevOps (`incident-hub-dev`, `-qa`, `-prod`).

## Checklist previo a PROD
- [ ] Pipeline verde en el tag
- [ ] Smoke test de QA exitoso
- [ ] `npm audit --omit=dev` sin high/critical
- [ ] CHANGELOG y release notes actualizados
- [ ] Sin PR abiertos bloqueantes

## Rollback
Re-ejecutar el pipeline sobre el tag anterior estable (por ejemplo `v0.4.0`) y aprobar su despliegue.
