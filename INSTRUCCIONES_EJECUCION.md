### Paso 1

```bash
cd servidor-3-datos
docker-compose up -d --build
```

### Paso 2

```bash
cd ../servidor-4-respaldo
docker-compose up -d
```

### Paso 3

```bash
cd ../servidor-1-principal
docker-compose up -d
```

### Paso 4

```bash
cd ../servidor-2-replica
docker-compose up -d
```

### Paso 5:

```bash
cd ../load-balancer
docker-compose up -d
```

### Prueba del funcionamiento

1. **Frontend:** `http://localhost:5173` o `http://localhost:8081`
2. **Panel de Base de Datos:** `http://localhost:7000` para ver el balanceador (HAProxy).
3. Detén el nodo principal de datos simulando una caída:
   ```bash
   cd servidor-3-datos
   docker stop c11_patroni1
   ```
4. `http://localhost:7000` -> Verás cómo automáticamente el tráfico se mueve a `patroni2`.
5. Para recuperarlo, simplemente vuelve a encenderlo:
   ```bash
   docker start c11_patroni1
   ```
