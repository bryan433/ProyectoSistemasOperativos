#!/bin/bash
# =============================================================
#  entrypoint.sh — Script de inicialización del primario
#  Se ejecuta UNA SOLA VEZ cuando el volumen de datos está vacío.
#  Crea el usuario de replicación.
# =============================================================

set -e

echo ">>> [Primary] Creando usuario de replicación..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE ROLE ${REPLICATION_USER} WITH REPLICATION LOGIN PASSWORD '${REPLICATION_PASSWORD}';
EOSQL

echo ">>> [Primary] Usuario de replicación creado exitosamente."
