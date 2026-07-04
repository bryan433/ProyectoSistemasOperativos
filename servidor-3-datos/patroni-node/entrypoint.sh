#!/bin/bash
set -e

# Reemplazar variables de entorno en la plantilla YAML de Patroni
sed -e "s|\${PATRONI_NAME}|${PATRONI_NAME}|g" \
    -e "s|\${ETCD_HOST}|${ETCD_HOST}|g" \
    -e "s|\${PATRONI_POSTGRES_LISTEN}|${PATRONI_POSTGRES_LISTEN}|g" \
    -e "s|\${PATRONI_RESTAPI_LISTEN}|${PATRONI_RESTAPI_LISTEN}|g" \
    -e "s|\${POSTGRES_USER}|${POSTGRES_USER}|g" \
    -e "s|\${POSTGRES_PASSWORD}|${POSTGRES_PASSWORD}|g" \
    -e "s|\${REPLICATION_USER}|${REPLICATION_USER}|g" \
    -e "s|\${REPLICATION_PASSWORD}|${REPLICATION_PASSWORD}|g" \
    /etc/patroni.yml.template > /tmp/patroni.yml

# Arrancar el comando CMD que viene en el Dockerfile (Patroni)
exec "$@"
