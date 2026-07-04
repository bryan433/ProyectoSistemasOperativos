# Guia Rapida de Ejecucion

Sigue estos pasos en orden para levantar todo el proyecto:

### Paso 1: Levantar Capa de Datos PostgreSQL HA

```bash
cd servidor-3-datos
docker-compose up -d --build
```

Espera unos 30 segundos para que se creen las bases de datos de forma automatica.

### Paso 2: Levantar Servidor de Respaldos

```bash
cd ../servidor-4-respaldo
docker-compose up -d
```

### Paso 3: Levantar Servidor Principal

```bash
cd ../servidor-1-principal
docker-compose up -d
```

### Paso 4: Levantar Servidor Replica

```bash
cd ../servidor-2-replica
docker-compose up -d
```

### Paso 5: Levantar Balanceador Global con Redundancia Interna

```bash
cd ../load-balancer
docker-compose up -d
```

Esto levanta tres contenedores:

- Entrada unica: `global_load_balancer_edge` en `http://localhost`
- Primario interno: `global_load_balancer_primary`, accesible para pruebas en `http://localhost:8088`
- Respaldo interno: `global_load_balancer_backup`, accesible para pruebas en `http://localhost:8080`

## Como probar que funciona

1. Frontend directo servidor 1: `http://localhost:5173`
2. Firewall servidor 1: `http://localhost:8081`
3. Firewall servidor 2: `http://localhost:8082`
4. Balanceador global con failover interno: `http://localhost`
5. Balanceador primario directo, solo para prueba: `http://localhost:8088`
6. Balanceador de respaldo directo, solo para prueba: `http://localhost:8080`
7. Panel de base de datos HAProxy: `http://localhost:7000`

## Como probar la salud de los balanceadores

```bash
curl http://localhost/health
curl http://localhost:8088/health
curl http://localhost:8080/health
```

`http://localhost/health` valida la entrada unica `edge`.

`http://localhost:8088/health` valida directamente el primario para pruebas.

`http://localhost:8080/health` valida directamente el respaldo para pruebas.

## Como probar el failover de la base de datos

1. Deten el nodo principal de datos simulando una caida:

   ```bash
   cd servidor-3-datos
   docker stop c11_patroni1
   ```

2. Ve al panel `http://localhost:7000`. El trafico deberia moverse automaticamente a `patroni2`.

3. Para recuperarlo:

   ```bash
   docker start c11_patroni1
   ```

## Como probar el failover interno del balanceador de carga

1. Confirma que la entrada principal responde:

   ```bash
   curl http://localhost/health
   ```

2. Deten el balanceador primario interno:

   ```bash
   docker stop global_load_balancer_primary
   ```

3. Entra por la misma URL principal:

   ```text
   http://localhost
   ```

4. Tambien puedes probar:

   ```bash
   curl http://localhost/health
   ```

5. Para recuperar el primario:

   ```bash
   docker start global_load_balancer_primary
   ```

Nota: si una conexion HTTP/WebSocket ya estaba abierta contra el primario, esa conexion puntual puede cortarse. Las nuevas peticiones por `http://localhost` pasan al respaldo automaticamente.
