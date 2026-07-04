# Guia de ejecucion del proyecto

## Analisis del commit actual

El commit actual (`f877207 uno ramas`) agrega el modulo de laboratorio al sistema:

- Nuevo backend `backend-laboratorio` en servidor 1 y servidor 2.
- Nueva base de datos `db_laboratorio`.
- Nuevas tablas de laboratorio: `"Machine"`, `"Exam"` y `"ExamOrder"`.
- Nueva pagina de frontend `/laboratorio`.
- Nuevas rutas Nginx `/api/laboratorio/`.
- Nuevos puertos expuestos:
  - Servidor 1 laboratorio: `3005 -> 3003`
  - Servidor 2 laboratorio: `3006 -> 3003`

Observacion importante: `INSTRUCCIONES_EJECUCION.md` quedo con marcadores de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`). Esta guia reemplaza esos pasos de forma limpia.

## Ejecucion automatica en Windows

Desde la raiz del proyecto ejecuta:

```bat
ejecutar-proyecto.bat
```

El archivo levanta las capas en este orden:

1. `servidor-3-datos`
2. `servidor-4-respaldo`
3. `servidor-1-principal`
4. `servidor-2-replica`
5. `load-balancer`

## Ejecucion manual

Abre una terminal en la raiz del proyecto y ejecuta:

```bat
cd servidor-3-datos
docker-compose up -d --build
```

Espera unos 30 segundos para que Patroni, PostgreSQL y el inicializador creen las bases.

```bat
cd ..\servidor-4-respaldo
docker-compose up -d
```

```bat
cd ..\servidor-1-principal
docker-compose up -d --build
```

```bat
cd ..\servidor-2-replica
docker-compose up -d --build
```

```bat
cd ..\load-balancer
docker-compose up -d
```

## URLs principales

- App balanceada: `http://localhost`
- Frontend servidor 1 directo: `http://localhost:5173`
- Frontend servidor 2 directo: `http://localhost:5174`
- Firewall servidor 1: `http://localhost:8081`
- Firewall servidor 2: `http://localhost:8082`
- Balanceador primario directo: `http://localhost:8088`
- Balanceador respaldo directo: `http://localhost:8080`
- Panel HAProxy de base de datos: `http://localhost:7000`

## Frontend sin recargas automaticas

Los frontends Docker se sirven como build de produccion con Nginx, no con `npm run dev`.
Esto evita que Vite/HMR recargue la pagina mientras se llenan formularios.

Si modificas codigo del frontend, reconstruye el servidor correspondiente:

```bat
cd servidor-1-principal
docker-compose up -d --build frontend-unificado
```

```bat
cd servidor-2-replica
docker-compose up -d --build frontend-unificado
```

## Pruebas rapidas de salud

```bat
curl http://localhost/health
curl http://localhost:8088/health
curl http://localhost:8080/health
curl http://localhost:8081/health
curl http://localhost:8082/health
```

## Bases de datos

Credenciales:

- Host desde Windows: `localhost`
- Puerto desde Windows: `15432`
- Host dentro de Docker: `haproxy`
- Puerto dentro de Docker: `5432`
- Usuario: `admin_salud`
- Password: `SaludSegura2025!`

Bases disponibles:

- `db_pagos_atencion`
- `db_medico`
- `db_laboratorio`

## Entrar a las bases con psql instalado en Windows

PowerShell:

```powershell
$env:PGPASSWORD="SaludSegura2025!"
psql -h localhost -p 15432 -U admin_salud -d db_pagos_atencion
```

```powershell
$env:PGPASSWORD="SaludSegura2025!"
psql -h localhost -p 15432 -U admin_salud -d db_medico
```

```powershell
$env:PGPASSWORD="SaludSegura2025!"
psql -h localhost -p 15432 -U admin_salud -d db_laboratorio
```

CMD:

```bat
set PGPASSWORD=SaludSegura2025!
psql -h localhost -p 15432 -U admin_salud -d db_pagos_atencion
```

```bat
set PGPASSWORD=SaludSegura2025!
psql -h localhost -p 15432 -U admin_salud -d db_medico
```

```bat
set PGPASSWORD=SaludSegura2025!
psql -h localhost -p 15432 -U admin_salud -d db_laboratorio
```

Comandos utiles dentro de `psql`:

```sql
\l
\c db_laboratorio
\dt
SELECT * FROM "Machine";
SELECT * FROM "Exam";
SELECT * FROM "ExamOrder";
\q
```

## Entrar a las bases sin instalar psql en Windows

Usa un contenedor temporal de PostgreSQL conectado a la red de datos:

```bat
docker run --rm -it --network servidor-3-datos_red_datos -e PGPASSWORD=SaludSegura2025! postgres:15-alpine psql -h haproxy -p 5432 -U admin_salud -d db_pagos_atencion
```

```bat
docker run --rm -it --network servidor-3-datos_red_datos -e PGPASSWORD=SaludSegura2025! postgres:15-alpine psql -h haproxy -p 5432 -U admin_salud -d db_medico
```

```bat
docker run --rm -it --network servidor-3-datos_red_datos -e PGPASSWORD=SaludSegura2025! postgres:15-alpine psql -h haproxy -p 5432 -U admin_salud -d db_laboratorio
```

## Ver estado de contenedores

```bat
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## Reiniciar solo una capa

```bat
cd servidor-1-principal
docker-compose restart
```

```bat
cd servidor-2-replica
docker-compose restart
```

```bat
cd load-balancer
docker-compose restart
```

## Si `db_laboratorio` no aparece

Si ya tenias volumenes antiguos antes del nuevo commit, vuelve a ejecutar el inicializador:

```bat
cd servidor-3-datos
docker-compose up -d --build db-init
```

Si aun no aparece y necesitas reiniciar completamente las bases, primero respalda datos importantes. Luego puedes recrear volumenes de la capa de datos:

```bat
cd servidor-3-datos
docker-compose down -v
docker-compose up -d --build
```

Ese ultimo paso borra los datos persistidos de PostgreSQL de esta capa.
