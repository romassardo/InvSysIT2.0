// Script de inicialización para configurar la base de datos y luego iniciar el servidor
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Array con los nombres de los scripts SQL en orden de ejecución
const sqlScripts = [
    'create_database.sql',
    'sp_users.sql',
    'sp_categories.sql',
    'sp_products.sql',
    'sp_inventory_movements.sql',
    'sp_notifications.sql',
    'sp_reports.sql',
    'sp_repairs.sql',
    'create_repairs_table.sql',
    'load_test_data_fixed.sql'
];

// Función para ejecutar un script SQL
async function executeScript(scriptPath) {
    console.log(`Ejecutando script: ${scriptPath}`);
    
    try {
        // Leer contenido del script
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        // Configurar conexión a SQL Server con autenticación de usuario
        const config = {
            server: process.env.DB_SERVER,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            options: {
                trustServerCertificate: true,
                enableArithAbort: true,
                encrypt: false,
                trustedConnection: false
            }
        };
        
        // Para el primer script, que crea la base de datos, no especificamos la base de datos
        if (path.basename(scriptPath) !== 'create_database.sql') {
            config.database = process.env.DB_NAME;
        }
        
        // Conectar a SQL Server
        const pool = await sql.connect(config);
        
        // Separar el script en comandos individuales por GO
        const commands = scriptContent.split(/^\s*GO\s*$/mi);
        
        // Ejecutar cada comando
        for (const command of commands) {
            if (command.trim()) {
                await pool.request().query(command);
            }
        }
        
        console.log(`Script ${scriptPath} ejecutado correctamente`);
        pool.close();
    } catch (error) {
        console.error(`Error al ejecutar script ${scriptPath}:`, error.message);
        // Continuamos con el siguiente script a pesar de errores
    }
}

async function initializeDatabase() {
    console.log('Iniciando configuración de la base de datos...');
    
    // Ejecutar scripts en orden
    for (const scriptName of sqlScripts) {
        const scriptPath = path.join(__dirname, 'scripts', scriptName);
        
        // Verificar si el script existe
        if (fs.existsSync(scriptPath)) {
            await executeScript(scriptPath);
        } else {
            console.warn(`Script ${scriptName} no encontrado en la carpeta de scripts`);
        }
    }
    
    console.log('Configuración de base de datos completada.');
}

// Función para iniciar el servidor
function startServer() {
    console.log('Iniciando servidor...');
    
    // Importar el servidor Express
    const app = require('./app');
    const { connectToDatabase } = require('./src/config/db.config');
    
    // Iniciar la conexión a la base de datos antes de iniciar el servidor
    connectToDatabase()
        .then(() => {
            // Configuración del puerto
            const PORT = process.env.PORT || 3000;
            
            // Iniciar el servidor
            app.listen(PORT, () => {
                console.log(`Servidor ejecutándose en el puerto ${PORT}`);
                console.log(`URL: http://localhost:${PORT}`);
                console.log('Sistema de Inventario IT listo para su uso');
            });
        })
        .catch(err => {
            console.error('Error al conectar con la base de datos:', err);
            process.exit(1);
        });
}

// Ejecutar inicialización y luego iniciar servidor
initializeDatabase()
    .then(() => {
        startServer();
    })
    .catch(err => {
        console.error('Error durante la inicialización:', err);
        process.exit(1);
    });
