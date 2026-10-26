#!/usr/bin/env bash
# Instala dependencias y descomprime el agente autohospedado en Fedora.
# Uso: ./devops/setup-agent-fedora.sh <URL_DEL_TAR_DEL_AGENTE>
# La URL sale de Azure DevOps > Project settings > Agent pools > Default > New agent > Linux x64
set -euo pipefail
URL="${1:?Falta la URL del agente}"
sudo dnf install -y git tar curl nodejs npm libicu openssl-libs krb5-libs zlib lttng-ust
mkdir -p "$HOME/azagent" && cd "$HOME/azagent"
curl -fsSL -o agent.tar.gz "$URL"
tar zxf agent.tar.gz
echo "Ahora ejecuta manualmente: cd ~/azagent && ./config.sh   (pide URL de la organización y tu PAT; NO los guardes en el repo)"
echo "Luego: ./run.sh   (o: sudo ./svc.sh install && sudo ./svc.sh start)"
