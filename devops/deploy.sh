#!/usr/bin/env bash
# Despliegue simulado en el agente: desempaqueta el artefacto en una carpeta por ambiente y valida.
# Uso: ./devops/deploy.sh <artefacto.tgz> <ambiente> <puerto>
set -euo pipefail
ART="${1:?artefacto}"; ENV_NAME="${2:?ambiente}"; PORT="${3:-3100}"
TARGET="$HOME/incident-hub-deploy/$ENV_NAME"
rm -rf "$TARGET" && mkdir -p "$TARGET"
tar xzf "$ART" -C "$TARGET"
(cd "$TARGET/backend" && npm ci --omit=dev)
"$(dirname "$0")/smoke-test.sh" "$TARGET" "$PORT"
echo "Desplegado en $TARGET"
