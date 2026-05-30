FROM postgres:15

# Instalar cron
RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

# Copiar scripts
COPY backup.sh /usr/local/bin/backup.sh
COPY entrypoint.sh /entrypoint.sh
COPY crontab.txt /etc/cron.d/backup-cron

RUN chmod +x /usr/local/bin/backup.sh /entrypoint.sh
RUN chmod 0644 /etc/cron.d/backup-cron
RUN crontab /etc/cron.d/backup-cron

# Crear directorio de backups
RUN mkdir -p /backups

ENTRYPOINT ["/entrypoint.sh"]
