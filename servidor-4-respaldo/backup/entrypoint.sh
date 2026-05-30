#!/bin/bash
# =============================================================
#  entrypoint.sh — Arranca cron y ejecuta un respaldo inicial
# =============================================================

set -e

echo ">>> [Servidor 4] Iniciando servicio de respaldo automatizado..."

# Ejecutar un respaldo inmediato al arrancar para verificar conectividad
echo ">>> Ejecutando respaldo inicial..."
/usr/local/bin/backup.sh || echo ">>> ADVERTENCIA: Respaldo inicial falló. ¿El Servidor 3 está levantado?"

echo ">>> Iniciando demonio cron..."
service cron start

echo ">>> Cron activo. Próximo respaldo en ${BACKUP_INTERVAL_MINUTES} minutos."
echo ">>> Logs disponibles en: /backups/backup.log"

# Mantener el contenedor activo y mostrar el log en tiempo real
tail -f /backups/backup.log
