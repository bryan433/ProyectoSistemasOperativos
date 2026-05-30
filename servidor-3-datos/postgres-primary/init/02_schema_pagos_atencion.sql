-- =============================================================
--  02_schema_pagos_atencion.sql
--  Esquema completo para la base de datos: db_pagos_atencion
--  Módulo: Pagos y Tickets de Atención
-- =============================================================

\connect db_pagos_atencion

-- -------------------------------------------------------------
--  TABLA: pacientes
--  Registro de pacientes que visitan el centro de salud
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pacientes (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    cedula          VARCHAR(20)  NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    telefono        VARCHAR(20),
    correo          VARCHAR(150),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
--  TABLA: tickets
--  Turno de atención asignado a cada paciente cuando llega
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tickets (
    id              SERIAL PRIMARY KEY,
    paciente_id     INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    numero_turno    INTEGER NOT NULL,             -- Número visible en pantalla (ej: 42)
    estado          VARCHAR(20) NOT NULL DEFAULT 'esperando'
                    CHECK (estado IN ('esperando', 'llamado', 'atendido', 'cancelado')),
    fecha_creacion  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_llamado   TIMESTAMP WITH TIME ZONE,     -- Cuando el médico lo llamó
    fecha_atencion  TIMESTAMP WITH TIME ZONE      -- Cuando se marcó como atendido
);

-- Índice para consultas del día
CREATE INDEX IF NOT EXISTS idx_tickets_fecha ON tickets (fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets (estado);

-- -------------------------------------------------------------
--  TABLA: pagos
--  Registro de pagos por atención médica
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pagos (
    id              SERIAL PRIMARY KEY,
    paciente_id     INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    ticket_id       INTEGER REFERENCES tickets(id) ON DELETE SET NULL,
    monto           NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
    concepto        VARCHAR(255) NOT NULL,         -- Ej: "Consulta general", "Examen de sangre"
    metodo_pago     VARCHAR(50) DEFAULT 'efectivo'
                    CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
    estado          VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente', 'pagado', 'anulado')),
    fecha_pago      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notas           TEXT
);

CREATE INDEX IF NOT EXISTS idx_pagos_paciente ON pagos (paciente_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos (fecha_pago);

-- -------------------------------------------------------------
--  DATOS DE DEMOSTRACIÓN (SEED)
-- -------------------------------------------------------------
INSERT INTO pacientes (nombre, apellido, cedula, fecha_nacimiento, telefono, correo) VALUES
    ('Carlos',   'Mendoza',   '1234567890', '1985-03-15', '0991234567', 'carlos.mendoza@email.com'),
    ('María',    'González',  '0987654321', '1992-07-22', '0987654321', 'maria.gonzalez@email.com'),
    ('Jorge',    'Ramírez',   '1122334455', '1978-11-08', '0976543210', 'jorge.ramirez@email.com'),
    ('Ana',      'Torres',    '5544332211', '2000-05-30', '0965432109', 'ana.torres@email.com'),
    ('Luis',     'Castillo',  '9988776655', '1965-01-20', '0954321098', 'luis.castillo@email.com')
ON CONFLICT (cedula) DO NOTHING;

INSERT INTO tickets (paciente_id, numero_turno, estado) VALUES
    (1, 1, 'atendido'),
    (2, 2, 'llamado'),
    (3, 3, 'esperando'),
    (4, 4, 'esperando'),
    (5, 5, 'esperando')
ON CONFLICT DO NOTHING;

INSERT INTO pagos (paciente_id, ticket_id, monto, concepto, metodo_pago, estado) VALUES
    (1, 1, 25.00, 'Consulta general',       'efectivo',     'pagado'),
    (2, 2, 45.50, 'Consulta especializada', 'tarjeta',      'pendiente'),
    (3, NULL,     15.00, 'Examen de laboratorio', 'transferencia', 'pendiente')
ON CONFLICT DO NOTHING;
