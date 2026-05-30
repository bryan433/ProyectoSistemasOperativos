#!/bin/bash
# =============================================================
#  backup.sh — Script principal de respaldo
#  Realiza pg_dump de cada base de datos configurada
#  y guarda los volcados en /backups con timestamp.
# =============================================================

set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
LOG_FILE="/backups/backup.log"

# Asegurar que el directorio existe
mkdir -p "$BACKUP_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "Iniciando proceso de respaldo"
log "Host BD: ${DB_HOST}:${DB_PORT}"
log "=========================================="

export PGPASSWORD="$DB_PASSWORD"

# Iterar sobre cada base de datos definida en DB_NAMES (separadas por coma)
IFS=',' read -ra DATABASES <<< "$DB_NAMES"

for DB_NAME in "${DATABASES[@]}"; do
    DB_NAME=$(echo "$DB_NAME" | tr -d ' ')  # Eliminar espacios
    ARCHIVO="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql"

    log "Iniciando respaldo de: $DB_NAME -> $(basename $ARCHIVO)"

    if pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --no-password \
        -F p \
        -f "$ARCHIVO"; then

        TAMANIO=$(du -sh "$ARCHIVO" | cut -f1)
        log "  ✓ Respaldo exitoso: $(basename $ARCHIVO) (${TAMANIO})"
    else
        log "  ✗ ERROR al respaldar: $DB_NAME"
    fi
done

# --- Limpieza: mantener solo los últimos 24 respaldos por base de datos ---
log "Limpiando respaldos antiguos (conservando últimos 24)..."
for DB_NAME in "${DATABASES[@]}"; do
    DB_NAME=$(echo "$DB_NAME" | tr -d ' ')
    # Listar archivos ordenados por fecha (más recientes primero) y eliminar los sobrantes
    ls -t "$BACKUP_DIR/${DB_NAME}_"*.sql 2>/dev/null | tail -n +25 | xargs -r rm --
    TOTAL=$(ls "$BACKUP_DIR/${DB_NAME}_"*.sql 2>/dev/null | wc -l)
    log "  $DB_NAME: ${TOTAL} respaldo(s) almacenado(s)"
done

# --- Copiar al volumen del host si está montado ---
if [ -d "/backups-local" ]; then
    log "Sincronizando respaldos con la carpeta local del host..."
    cp -f "$BACKUP_DIR"/*.sql /backups-local/ 2>/dev/null || true
    cp -f "$LOG_FILE" /backups-local/ 2>/dev/null || true
fi

log "Proceso de respaldo completado."
log ""
