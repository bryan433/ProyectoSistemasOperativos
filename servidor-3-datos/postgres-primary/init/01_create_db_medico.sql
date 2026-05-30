-- =============================================================
--  01_create_db_medico.sql
--  Crea la segunda base de datos lógica dentro del mismo motor.
--  (La primera, db_pagos_atencion, la crea Docker automáticamente
--   con la variable POSTGRES_DB)
--
--  Los scripts en docker-entrypoint-initdb.d/ se ejecutan como
--  el superusuario definido en POSTGRES_USER.
-- =============================================================

\connect postgres

CREATE DATABASE db_medico OWNER admin_salud;
