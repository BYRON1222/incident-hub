# Análisis de dependencias

Comando: `npm audit` en `backend/` y `frontend/` (ejecutado el 2026-10-24). Producción (`--omit=dev`): **0 vulnerabilidades** en ambos.

| Paquete | Alcance | Severidad | Detalle | Decisión |
|---|---|---|---|---|
| uuid < 11.1.1 (vía jest-junit 16) | backend, solo dev/CI | Moderada | GHSA-w5hq-g745-h8pq: falta validación de límites del buffer en v3/v5/v6 | Actualizar a jest-junit 17 (breaking en dev) mediante Task trazable; no llega al artefacto |
| esbuild ≤ 0.24.2 (vía vite 5) | frontend, solo dev | Moderada | GHSA-67mh-4wv8-2f99: cualquier sitio puede enviar peticiones al servidor de desarrollo | Aceptada temporalmente: solo afecta `vite dev`, no el build ni el artefacto. No exponer el dev server fuera de localhost. Migrar a vite 6+/8 en v1.1 |
| vite (alta, transitiva de esbuild según `npm audit`) | frontend, solo dev | Alta (reportada) | Mismo origen que la anterior | Mismo tratamiento; el gate del pipeline usa `--omit=dev` |

Revisar de nuevo antes de cada release y actualizar esta tabla con la fecha.
