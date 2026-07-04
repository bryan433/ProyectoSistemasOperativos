-- Conectarse a la base de datos
\c db_laboratorio;

CREATE TABLE "Machine" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "description" TEXT
);

CREATE TABLE "Exam" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "details" TEXT,
    "machineId" INTEGER REFERENCES "Machine"("id") ON DELETE CASCADE
);

-- Poblar datos iniciales
INSERT INTO "Machine" ("name", "type", "description") VALUES
('Máquina 1', 'Analizador Clínico', 'Realiza pruebas químicas y de inmunología de alto rendimiento.'),
('Máquina 2', 'Hematología', 'Analizador automatizado para conteos sanguíneos completos.'),
('Máquina 3', 'Microbiología', 'Sistema de identificación microbiana y pruebas de susceptibilidad a los antibióticos.'),
('Máquina 4', 'Química Integrada', 'Analizador químico diseñado para procesar una amplia gama de pruebas rutinarias.');

INSERT INTO "Exam" ("name", "details", "machineId") VALUES
('Perfil Lipídico', 'Colesterol, Triglicéridos, HDL, LDL', 1),
('Glucosa en sangre', 'Nivel de azúcar en ayunas', 1),
('Hemograma Completo', 'Conteo de glóbulos rojos, blancos y plaquetas', 2),
('Perfil de Coagulación', 'Tiempo de protrombina (TP) y TTP', 2),
('Urocultivo', 'Detección de bacterias en la orina', 3),
('Hemocultivo', 'Detección de microorganismos en la sangre', 3),
('Pruebas de función hepática', 'Bilirrubina, ALT, AST', 4),
('Electrolitos en suero', 'Sodio, Potasio, Cloro', 4);

CREATE TABLE "ExamOrder" (
    "id" SERIAL PRIMARY KEY,
    "patientName" VARCHAR(255) NOT NULL,
    "examId" INTEGER REFERENCES "Exam"("id") ON DELETE CASCADE,
    "status" VARCHAR(50) DEFAULT 'Pendiente',
    "result" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO "ExamOrder" ("patientName", "examId", "status", "result") VALUES
('Carlos Mendoza', 1, 'Pendiente', NULL),
('María González', 3, 'Completado', 'Leucocitos altos, posible infección.'),
('Jorge Ramírez', 8, 'Pendiente', NULL);
