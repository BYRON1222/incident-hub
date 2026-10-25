# Seguridad y secretos

- Ningún secreto en el repositorio: `.env`, claves y tokens están en `.gitignore`; el repo solo trae `.env.example` con valores de relleno.
- Azure Pipelines: `DATABASE_URL` vive en el variable group `incident-hub-secrets` (marcado como secreto con el candado). Se inyecta solo en los pasos que lo necesitan vía `env:`.
- GitHub Actions: la clave de la base de datos de CI es el secreto de repositorio `CI_DB_PASSWORD`.
- PAT del agente: se escribe solo en `./config.sh` en la máquina del agente; no se versiona ni se captura.
- Revisión de dependencias: `npm audit` en cada pipeline (falla con severidad high/critical en dependencias de producción) y `dependency-review-action` en PR de GitHub.
- Política de ramas en `main`: PR + revisor distinto del autor.
- Si un secreto se filtra: revocar y rotar primero, después limpiar el historial.
