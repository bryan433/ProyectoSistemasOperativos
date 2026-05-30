#!/bin/bash
# =============================================================
#  entrypoint-replica.sh
#  Configura y arranca el servidor PostgreSQL en modo STANDBY
#  usando pg_basebackup para clonar el primario.
# =============================================================

set -e

PGDATA="/var/lib/postgresql/data"

echo ">>> [Replica] Esperando que el primario esté disponible en ${PRIMARY_HOST}:${PRIMARY_PORT}..."
until pg_isready -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -U "$REPLICATION_USER"; do
    echo ">>> [Replica] Primario no disponible aún. Reintentando en 2 segundos..."
    sleep 2
done
echo ">>> [Replica] Primario disponible."

# Solo clonar si el directorio de datos está vacío
if [ -z "$(ls -A "$PGDATA" 2>/dev/null)" ]; then
    echo ">>> [Replica] Clonando datos del primario con pg_basebackup..."
    PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
        -h "$PRIMARY_HOST" \
        -p "$PRIMARY_PORT" \
        -U "$REPLICATION_USER" \
        -D "$PGDATA" \
        -Fp \
        -Xs \
        -P \
        -R    # Crea automáticamente standby.signal y primary_conninfo en postgresql.auto.conf

    echo ">>> [Replica] Clonación completada."
    chown -R postgres:postgres "$PGDATA"
    chmod 700 "$PGDATA"
else
    echo ">>> [Replica] Datos existentes encontrados. Usando configuración existente."
fi

echo ">>> [Replica] Iniciando PostgreSQL en modo Standby..."
exec gosu postgres postgres -D "$PGDATA" -c hot_standby=on
