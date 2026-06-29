# 🚀 Guía Rápida de Ejecución

Sigue estos pasos en orden para levantar todo el proyecto:

### Paso 1: Levantar Capa de Datos (PostgreSQL HA)
```bash
cd servidor-3-datos
docker-compose up -d --build
```
*(Espera unos 30 segundos para que se creen las bases de datos de forma automática).*

### Paso 2: Levantar Servidor de Respaldos
```bash
cd ../servidor-4-respaldo
docker-compose up -d
```

### Paso 3: Levantar Servidor Principal (Backend/Frontend)
```bash
cd ../servidor-1-principal
docker-compose up -d
```

### Paso 4: Levantar Servidor Réplica
```bash
cd ../servidor-2-replica
docker-compose up -d
```

### Paso 5: Levantar Balanceador de Carga Global
```bash
cd ../load-balancer
docker-compose up -d
```

---

## ✅ Cómo probar que funciona

1. **Frontend:** Entra a `http://localhost:5173` o `http://localhost:8081`
2. **Panel de Base de Datos:** Entra a `http://localhost:7000` para ver el balanceador (HAProxy).

## 💥 Cómo probar el Failover (Alta Disponibilidad)
1. Detén el nodo principal de datos simulando una caída:
   ```bash
   cd servidor-3-datos
   docker stop c11_patroni1
   ```
2. Ve al panel `http://localhost:7000`. Verás cómo automáticamente el tráfico se mueve a `patroni2`.
3. Para recuperarlo, simplemente vuelve a encenderlo:
   ```bash
   docker start c11_patroni1
   ```
