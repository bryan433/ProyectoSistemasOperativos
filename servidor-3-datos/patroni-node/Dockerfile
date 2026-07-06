FROM postgres:15

# Instalar Python, pip y entorno virtual para aislar dependencias de Patroni
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Crear y usar un entorno virtual para instalar Patroni con soporte para etcd y psycopg2
RUN python3 -m venv /opt/patroni-venv
RUN /opt/patroni-venv/bin/pip install --upgrade pip
RUN /opt/patroni-venv/bin/pip install patroni[etcd] psycopg2-binary

# Copiar configuración y entrypoint
COPY patroni.yml.template /etc/patroni.yml.template
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && sed -i 's/\r$//' /entrypoint.sh
RUN chown postgres:postgres /etc/patroni.yml.template

# Ejecutar como usuario postgres para manejar la BD
USER postgres

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/opt/patroni-venv/bin/patroni", "/tmp/patroni.yml"]
