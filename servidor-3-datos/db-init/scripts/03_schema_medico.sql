-- =============================================================
--  03_schema_medico.sql
--  Esquema completo para la base de datos: db_medico
--  Módulo: Ficha Médica e Historial Clínico
-- =============================================================

\connect db_medico

-- -------------------------------------------------------------
--  TABLA: pacientes
--  Copia autónoma del registro de pacientes para el módulo médico
--  (patrón estándar de microservicios: cada servicio tiene su propia BD)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pacientes (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    cedula          VARCHAR(20)  NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    telefono        VARCHAR(20),
    correo          VARCHAR(150),
    tipo_sangre     VARCHAR(5),                   -- Ej: 'O+', 'A-', 'AB+'
    alergias        TEXT,                          -- Listado de alergias conocidas
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
--  TABLA: medicos
--  Registro de médicos del centro de salud
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medicos (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    especialidad    VARCHAR(100) NOT NULL,
    cedula_prof     VARCHAR(50)  NOT NULL UNIQUE, -- Número de cédula profesional
    correo          VARCHAR(150),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
--  TABLA: fichas_medicas
--  Ficha principal del paciente (una por paciente)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fichas_medicas (
    id              SERIAL PRIMARY KEY,
    paciente_id     INTEGER NOT NULL UNIQUE REFERENCES pacientes(id) ON DELETE CASCADE,
    antecedentes    TEXT,                          -- Antecedentes médicos personales
    antecedentes_fam TEXT,                         -- Antecedentes familiares
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
--  TABLA: consultas
--  Cada visita médica genera un registro de consulta
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultas (
    id              SERIAL PRIMARY KEY,
    paciente_id     INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    medico_id       INTEGER NOT NULL REFERENCES medicos(id) ON DELETE RESTRICT,
    fecha_consulta  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Signos vitales
    presion_arterial VARCHAR(20),                  -- Ej: '120/80'
    temperatura      NUMERIC(4,1),                 -- En Celsius
    frecuencia_cardiaca INTEGER,                   -- lpm
    peso             NUMERIC(5,2),                 -- kg
    altura           NUMERIC(4,2),                 -- metros

    -- Información clínica
    motivo_consulta  TEXT NOT NULL,
    sintomas         TEXT,
    diagnostico      TEXT,
    tratamiento      TEXT,
    observaciones    TEXT,

    -- Estado del seguimiento
    requiere_seguimiento BOOLEAN DEFAULT FALSE,
    fecha_siguiente_cita DATE
);

CREATE INDEX IF NOT EXISTS idx_consultas_paciente ON consultas (paciente_id);
CREATE INDEX IF NOT EXISTS idx_consultas_fecha ON consultas (fecha_consulta);

-- -------------------------------------------------------------
--  TABLA: medicamentos_recetados
--  Medicamentos recetados en cada consulta
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medicamentos_recetados (
    id              SERIAL PRIMARY KEY,
    consulta_id     INTEGER NOT NULL REFERENCES consultas(id) ON DELETE CASCADE,
    nombre          VARCHAR(150) NOT NULL,         -- Nombre del medicamento
    dosis           VARCHAR(100) NOT NULL,         -- Ej: '500mg'
    frecuencia      VARCHAR(100) NOT NULL,         -- Ej: 'Cada 8 horas'
    duracion        VARCHAR(100),                  -- Ej: '7 días'
    instrucciones   TEXT                           -- Instrucciones especiales
);

-- -------------------------------------------------------------
--  TABLA: examenes_solicitados
--  Exámenes de laboratorio o imagen solicitados en una consulta
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS examenes_solicitados (
    id              SERIAL PRIMARY KEY,
    consulta_id     INTEGER NOT NULL REFERENCES consultas(id) ON DELETE CASCADE,
    tipo_examen     VARCHAR(150) NOT NULL,         -- Ej: 'Hemograma completo', 'Rayos X tórax'
    indicaciones    TEXT,
    resultado       TEXT,                          -- Se llena cuando llega el resultado
    fecha_resultado DATE,
    estado          VARCHAR(20) DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente', 'completado', 'cancelado'))
);

-- -------------------------------------------------------------
--  DATOS DE DEMOSTRACIÓN (SEED)
-- -------------------------------------------------------------
INSERT INTO pacientes (nombre, apellido, cedula, fecha_nacimiento, telefono, tipo_sangre, alergias) VALUES
    ('Carlos',   'Mendoza',  '1234567890', '1985-03-15', '0991234567', 'O+',  'Ninguna conocida'),
    ('María',    'González', '0987654321', '1992-07-22', '0987654321', 'A+',  'Penicilina'),
    ('Jorge',    'Ramírez',  '1122334455', '1978-11-08', '0976543210', 'B-',  'Ibuprofeno, Polen'),
    ('Ana',      'Torres',   '5544332211', '2000-05-30', '0965432109', 'AB+', 'Ninguna conocida'),
    ('Luis',     'Castillo', '9988776655', '1965-01-20', '0954321098', 'O-',  'Mariscos')
ON CONFLICT (cedula) DO NOTHING;

INSERT INTO medicos (nombre, apellido, especialidad, cedula_prof, correo) VALUES
    ('Dr. Roberto', 'Vargas',    'Medicina General',  'MED-001', 'r.vargas@clinica.com'),
    ('Dra. Sofia',  'Paredes',   'Pediatría',         'MED-002', 's.paredes@clinica.com'),
    ('Dr. Andrés',  'Morales',   'Cardiología',       'MED-003', 'a.morales@clinica.com')
ON CONFLICT (cedula_prof) DO NOTHING;

INSERT INTO fichas_medicas (paciente_id, antecedentes, antecedentes_fam) VALUES
    (1, 'Hipertensión diagnosticada en 2020. Sin cirugías previas.',  'Padre con diabetes tipo 2. Madre con hipertensión.'),
    (2, 'Sin antecedentes patológicos de importancia.',               'Sin antecedentes familiares relevantes.'),
    (3, 'Asma bronquial desde la infancia. Operado de apendicitis.', 'Hermano con asma. Abuelo con cáncer de pulmón.'),
    (4, 'Sin antecedentes.',                                          'Sin antecedentes.'),
    (5, 'Diabetes tipo 2 diagnosticada 2018. Colesterol alto.',       'Padre y madre con diabetes.')
ON CONFLICT DO NOTHING;

INSERT INTO consultas (paciente_id, medico_id, motivo_consulta, sintomas, diagnostico, tratamiento, presion_arterial, temperatura, frecuencia_cardiaca, peso, altura) VALUES
    (1, 1, 'Control de presión arterial',
     'Dolor de cabeza leve, mareos ocasionales',
     'Hipertensión arterial controlada',
     'Continuar con Losartán 50mg. Dieta baja en sodio. Control en 3 meses.',
     '140/90', 36.5, 78, 82.5, 1.75),
    (2, 1, 'Gripe y fiebre',
     'Fiebre 38.5°C, tos seca, congestión nasal, malestar general',
     'Infección viral de vías respiratorias superiores',
     'Reposo. Paracetamol 500mg cada 8 horas. Abundantes líquidos.',
     '110/70', 38.5, 92, 65.0, 1.62);

INSERT INTO medicamentos_recetados (consulta_id, nombre, dosis, frecuencia, duracion, instrucciones) VALUES
    (1, 'Losartán',     '50mg',  'Una vez al día (mañana)', NULL,    'Tomar con o sin comida'),
    (2, 'Paracetamol',  '500mg', 'Cada 8 horas',            '5 días', 'Tomar si la fiebre supera 38°C'),
    (2, 'Loratadina',   '10mg',  'Una vez al día (noche)',  '5 días', 'Para la congestión nasal');

INSERT INTO examenes_solicitados (consulta_id, tipo_examen, indicaciones, estado) VALUES
    (1, 'Hemograma completo',    'Ayuno de 8 horas',          'pendiente'),
    (1, 'Perfil lipídico',       'Ayuno de 12 horas',         'pendiente'),
    (2, 'Prueba COVID-19 rápida', 'Sin ayuno necesario',      'completado');
