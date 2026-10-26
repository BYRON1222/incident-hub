#!/usr/bin/env bash
# Levanta el artefacto desempaquetado y valida /health y creación de un incidente.
# Uso: ./devops/smoke-test.sh <directorio_desplegado> [puerto]
set -euo pipefail
DIR="${1:?directorio}"; PORT="${2:-3100}"
cd "$DIR/backend"
STORE=memory PORT="$PORT" node src/server.js &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
for _ in $(seq 1 20); do curl -fs "http://localhost:$PORT/health" >/dev/null && break; sleep 0.5; done
curl -fs "http://localhost:$PORT/health" | grep -q '"ok"'
curl -fs -X POST "http://localhost:$PORT/api/incidents" -H 'Content-Type: application/json' \
  -d '{"titulo":"smoke","descripcion":"prueba","categoria":"OTRO","prioridad":"BAJA","usuario":"pipeline"}' | grep -q '"NUEVO"'
echo "Smoke test OK en puerto $PORT"
