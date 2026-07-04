#!/bin/sh

echo ">>> Esperando a que el clúster de Patroni esté listo en $PGHOST:$PGPORT..."

# Esperar a que HAProxy pueda rutear al maestro y responda a ping
until pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER"; do
  echo "La base de datos aún no está lista. Reintentando en 3 segundos..."
  sleep 3
done

echo ">>> Clúster Patroni detectado. Ejecutando scripts de inicialización..."

export PGPASSWORD=$PGPASSWORD

# Crear la base de datos principal si no existe (ya que Patroni no usa POSTGRES_DB igual que el entrypoint normal)
echo ">>> Ejecutando: CREATE DATABASE db_pagos_atencion..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -c "CREATE DATABASE db_pagos_atencion OWNER admin_salud;" || echo "La DB db_pagos_atencion ya existe."

# Crear la segunda base de datos
echo ">>> Ejecutando: 01_create_db_medico.sql..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -f /scripts/01_create_db_medico.sql || echo "La DB db_medico ya existe."

# Poblar primera base de datos
echo ">>> Ejecutando: 02_schema_pagos_atencion.sql..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d db_pagos_atencion -f /scripts/02_schema_pagos_atencion.sql

# Poblar segunda base de datos
echo ">>> Ejecutando: 03_schema_medico.sql..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d db_medico -f /scripts/03_schema_medico.sql

# Crear la tercera base de datos (Laboratorio)
echo ">>> Ejecutando: 04_create_db_laboratorio.sql..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -f /scripts/04_create_db_laboratorio.sql || echo "La DB db_laboratorio ya existe."

# Poblar tercera base de datos
echo ">>> Ejecutando: 05_schema_laboratorio.sql..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d db_laboratorio -f /scripts/05_schema_laboratorio.sql

echo ">>> ¡Inicialización de base de datos finalizada con éxito!"
# Mantener el contenedor vivo o salir. Saldremos para que compose lo marque como 'exited' de forma limpia.
exit 0
