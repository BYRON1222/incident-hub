# Deuda técnica

| ID | Deuda | Impacto | Estado | Work Item |
|---|---|---|---|---|
| D1 | CORS abierto a cualquier origen (`cors()` sin configuración) | Seguridad | **Resolver (semana 2)** | AB#_ |
| D2 | `GET /api/incidents` sin paginación | Rendimiento con muchos datos | **Resolver (semana 3)** | AB#_ |
| D3 | Sin autenticación: usuario y técnico son texto libre | Seguridad / integridad | Pendiente (v1.1) | AB#_ |
| D4 | Sin pruebas automatizadas del frontend | Calidad | Pendiente (v1.1) | AB#_ |
| D5 | Dependencias de desarrollo con vulnerabilidades (uuid vía jest-junit, esbuild vía vite) | Seguridad (solo dev) | Pendiente / aceptada, ver `dependencies.md` | AB#_ |
| D6 | Dashboard calculado en memoria sobre toda la lista (no con SQL agregado) | Rendimiento | Pendiente (v1.1) | AB#_ |
| D7 | Esquema SQL sin herramienta de migraciones | Mantenibilidad | Pendiente (v1.1) | AB#_ |

Cada deuda se registra como Work Item (tag `deuda-tecnica`) y las resueltas se enlazan con su PR (AB#ID).
