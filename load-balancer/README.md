# Redundancia interna del balanceador global

Este directorio levanta tres contenedores:

- `global_load_balancer_edge`: entrada unica en `http://localhost`
- `global_load_balancer_primary`: balanceador primario interno
- `global_load_balancer_backup`: balanceador de respaldo interno

El usuario siempre entra por:

```text
http://localhost
```

`edge` reenvia normalmente hacia `primary`. Si `primary` cae, `edge` reintenta contra `backup` automaticamente sin cambiar de puerto.

## Levantar balanceadores

```bash
cd load-balancer
docker-compose up -d
```

## Probar salud

```bash
curl http://localhost/health
curl http://localhost:8088/health
curl http://localhost:8080/health
```

`http://localhost/health` valida el balanceador de entrada `edge`.

`http://localhost:8088/health` valida directamente el balanceador `primary` para pruebas.

`http://localhost:8080/health` valida directamente el balanceador `backup` para pruebas.

## Probar failover interno

1. Confirma que funciona la entrada principal:

   ```bash
   curl http://localhost/health
   ```

2. Deten el balanceador primario interno:

   ```bash
   docker stop global_load_balancer_primary
   ```

3. Prueba la misma URL:

   ```bash
   curl http://localhost/health
   ```

4. Entra a la app sin cambiar de puerto:

   ```text
   http://localhost
   ```

5. Recupera el primario:

   ```bash
   docker start global_load_balancer_primary
   ```

Nota: si una conexion HTTP/WebSocket ya estaba abierta contra `primary`, esa conexion puntual puede cortarse. Las nuevas peticiones por `http://localhost` pasan por `backup` automaticamente.
