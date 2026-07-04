# 🗄️ Capa de Datos — Servidor 3 y Servidor 4

Este directorio contiene la arquitectura completa de base de datos del sistema de gestión del centro de salud.

---

## Estructura

```
servidor-3-datos/
├── docker-compose.yml              ← Levanta primario + réplica
├── postgres-primary/
│   ├── Dockerfile
│   ├── postgresql.conf             ← Habilita Streaming Replication
│   ├── pg_hba.conf                 ← Control de acceso
│   ├── entrypoint.sh               ← Crea usuario de replicación
│   └── init/
│       ├── 01_create_db_medico.sql       ← Crea db_medico
│       ├── 02_schema_pagos_atencion.sql  ← Tablas + datos demo
│       └── 03_schema_medico.sql          ← Tablas + datos demo
└── postgres-replica/
    ├── Dockerfile
    └── entrypoint-replica.sh       ← Clona el primario con pg_basebackup

servidor-4-respaldo/
├── docker-compose.yml
├── backups/                        ← Archivos .sql generados (ignorados en git)
└── backup/
    ├── Dockerfile
    ├── backup.sh                   ← Script pg_dump
    ├── entrypoint.sh
    └── crontab.txt                 ← Cada hora por defecto
```

---

## Bases de Datos

| Base de datos | Puerto | Módulo |
|---|---|---|
| `db_pagos_atencion` | 5432 (primario) / 5433 (réplica) | API Pagos y Ticket |
| `db_medico` | 5432 (primario) / 5433 (réplica) | API Ficha Médica |

### `db_pagos_atencion` — Tablas
| Tabla | Descripción |
|---|---|
| `pacientes` | Registro de pacientes |
| `tickets` | Turnos de atención (estados: esperando → llamado → atendido) |
| `pagos` | Cobros por atención médica |

### `db_medico` — Tablas
| Tabla | Descripción |
|---|---|
| `pacientes` | Registro de pacientes (autónomo del módulo) |
| `medicos` | Registro de médicos del centro |
| `fichas_medicas` | Ficha clínica base del paciente |
| `consultas` | Cada visita médica (signos vitales, diagnóstico, tratamiento) |
| `medicamentos_recetados` | Recetas asociadas a cada consulta |
| `examenes_solicitados` | Órdenes de laboratorio/imagen |

---

## ▶️ Cómo Levantar

### Paso 1 — Servidor 3 (obligatorio primero)
```bash
cd servidor-3-datos
docker-compose up -d
```
Esperar ~10 segundos a que el primario esté saludable. La réplica se sincroniza automáticamente.

**Verificar estado:**
```bash
docker-compose ps
docker logs c11_postgres_primary
docker logs c12_postgres_replica
```

**Conectarse al primario (lectura/escritura):**
```bash
docker exec -it c11_postgres_primary psql -U admin_salud -d db_pagos_atencion
docker exec -it c11_postgres_primary psql -U admin_salud -d db_medico
```

**Conectarse a la réplica (solo lectura):**
```bash
docker exec -it c12_postgres_replica psql -U admin_salud -d db_pagos_atencion
```

**Verificar que la réplica está sincronizada:**
```sql
-- En el PRIMARIO:
SELECT client_addr, state, sent_lsn, replay_lsn FROM pg_stat_replication;
```

### Paso 2 — Servidor 4 (respaldo)
```bash
cd servidor-4-respaldo
docker-compose up -d
```
El primer respaldo se ejecuta inmediatamente. Los archivos `.sql` aparecen en `servidor-4-respaldo/backups/`.

---

## 🔌 Cadenas de Conexión para las APIs (Prisma)

Las APIs del Servidor 1 y 2 deben usar estas URLs en su `.env`:

```env
# API Pagos y Ticket
DATABASE_URL="postgresql://admin_salud:SaludSegura2025!@<IP_SERVIDOR_3>:5432/db_pagos_atencion"

# API Ficha Médica
DATABASE_URL="postgresql://admin_salud:SaludSegura2025!@<IP_SERVIDOR_3>:5432/db_medico"
```

> **En demo local (una sola máquina):** reemplazar `<IP_SERVIDOR_3>` por `localhost`  
> **En demo multi-máquina:** reemplazar por la IP local del computador que corre el Servidor 3

---

## 🔐 Credenciales

| Rol | Usuario | Contraseña |
|---|---|---|
| Superusuario APIs | `admin_salud` | `SaludSegura2025!` |
| Replicación (interno) | `replicador` | `ReplPass2025!` |

> ⚠️ Cambiar estas contraseñas si el proyecto se despliega fuera del entorno local.

---

## 📦 Datos de Demostración incluidos

Al levantar por primera vez, las bases de datos se poblan automáticamente con:
- **5 pacientes** de ejemplo
- **3 médicos** (Medicina General, Pediatría, Cardiología)
- **5 tickets** de atención (en varios estados)
- **2 pagos** registrados
- **2 consultas médicas** completas con recetas y órdenes de examen
