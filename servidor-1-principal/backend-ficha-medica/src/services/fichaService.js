const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const obtenerTodasLasFichas = async () => {
    return await prisma.fichaMedica.findMany({
        include: { paciente: true }
    });
};

const obtenerFichaPorPaciente = async (pacienteId) => {
    return await prisma.fichaMedica.findUnique({
        where: { paciente_id: parseInt(pacienteId) },
        include: { paciente: true }
    });
};

const crearFichaMedica = async (pacienteId, antecedentes = '', antecedentesFam = '') => {
    // Si la ficha ya existe, Prisma lanzaría error por el UNIQUE de paciente_id
    // por lo tanto, usamos upsert o comprobamos primero, pero vamos con upsert
    // para asegurar que se crea o devuelve la existente.
    return await prisma.fichaMedica.upsert({
        where: { paciente_id: parseInt(pacienteId) },
        update: {},
        create: {
            paciente_id: parseInt(pacienteId),
            antecedentes: antecedentes,
            antecedentes_fam: antecedentesFam
        },
        include: { paciente: true }
    });
};

const crearConsulta = async (datos) => {
    const { 
        paciente_id, 
        medico_id, 
        motivo_consulta, 
        sintomas, 
        diagnostico, 
        tratamiento, 
        presion_arterial, 
        temperatura, 
        frecuencia_cardiaca, 
        peso, 
        altura,
        medicamentos, // Array opcional
        examenes // Array opcional
    } = datos;

    return await prisma.consulta.create({
        data: {
            paciente_id,
            medico_id,
            motivo_consulta,
            sintomas,
            diagnostico,
            tratamiento,
            presion_arterial,
            temperatura,
            frecuencia_cardiaca,
            peso,
            altura,
            medicamentos: medicamentos ? {
                create: medicamentos
            } : undefined,
            examenes: examenes ? {
                create: examenes
            } : undefined
        },
        include: {
            medicamentos: true,
            examenes: true
        }
    });
};

const obtenerConsultasPorPaciente = async (pacienteId) => {
    return await prisma.consulta.findMany({
        where: { paciente_id: parseInt(pacienteId) },
        include: { medico: true, medicamentos: true, examenes: true },
        orderBy: { fecha_consulta: 'desc' }
    });
};

module.exports = {
    obtenerTodasLasFichas,
    obtenerFichaPorPaciente,
    crearFichaMedica,
    crearConsulta,
    obtenerConsultasPorPaciente
};
