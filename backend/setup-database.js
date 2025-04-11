/**
 * Script para configurar la base de datos SQL Server
 * Este script ejecutará todos los archivos SQL necesarios para configurar 
 * correctamente la base de datos InvSysIT
 */

const fs = require('fs');
const path = require('path');
const { sql, connectToDatabase } = require('./src/config/db.config');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Directorios donde se encuentran los scripts SQL
const SCRIPTS_DIR = path.join(__dirname, 'scripts');

// Orden de ejecución de los scripts (ajustar según corresponda)
const SCRIPT_EXECUTION_ORDER = [
  // Primero creamos tablas
  'create_users_table.sql',
  'create_categories_table.sql',
  'create_products_table.sql',
  'create_inventory_table.sql',
  'create_assets_table.sql',
  'create_repairs_table.sql',
  'create_notifications_table.sql',
  
  // Luego procedimientos almacenados
  'sp_users.sql',
  'sp_categories.sql',
  'sp_products.sql',
  'sp_inventory.sql',
  'sp_assets.sql',
  'sp_repairs.sql',
  'sp_notifications.sql',
  
  // Finalmente datos iniciales
  'seed_data.sql'
];

/**
 * Ejecuta un archivo SQL
 * @param {string} filePath - Ruta al archivo SQL
 */
async function executeSqlFile(filePath) {
  try {
    console.log(`Ejecutando archivo: ${path.basename(filePath)}`);
    
    // Leer el contenido del archivo
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Ejecutar consulta con autenticación de Windows
    const result = await execPromise(
      `sqlcmd -S ${process.env.DB_SERVER} -E -d ${process.env.DB_NAME} -i "${filePath}"`
    );
    
    console.log(`✅ Archivo ejecutado correctamente: ${path.basename(filePath)}`);
    return result;
  } catch (err) {
    console.error(`❌ Error al ejecutar ${path.basename(filePath)}:`, err.message);
    throw err;
  }
}

/**
 * Función principal para ejecutar todos los scripts
 */
async function setupDatabase() {
  try {
    console.log('Iniciando configuración de la base de datos InvSysIT...');
    
    // Verificamos si la base de datos existe
    const dbCheckResult = await execPromise(
      `sqlcmd -S ${process.env.DB_SERVER} -E -Q "SELECT name FROM sys.databases WHERE name = '${process.env.DB_NAME}'"`
    );
    
    // Si la BD no existe, la creamos
    if (!dbCheckResult.stdout.includes(process.env.DB_NAME)) {
      console.log(`La base de datos ${process.env.DB_NAME} no existe. Creándola...`);
      await execPromise(
        `sqlcmd -S ${process.env.DB_SERVER} -E -Q "CREATE DATABASE ${process.env.DB_NAME}"`
      );
      console.log(`✅ Base de datos ${process.env.DB_NAME} creada correctamente`);
    } else {
      console.log(`La base de datos ${process.env.DB_NAME} ya existe`);
    }
    
    // Ejecutar scripts en orden
    for (const scriptName of SCRIPT_EXECUTION_ORDER) {
      const scriptPath = path.join(SCRIPTS_DIR, scriptName);
      
      // Verificar si existe el archivo
      if (fs.existsSync(scriptPath)) {
        await executeSqlFile(scriptPath);
      } else {
        console.log(`⚠️ Archivo no encontrado: ${scriptName}, continuando...`);
      }
    }
    
    console.log('✅ Configuración de la base de datos completada exitosamente');
  } catch (err) {
    console.error('❌ Error durante la configuración de la base de datos:', err);
  }
}

// Cargar variables de entorno
require('dotenv').config();

// Ejecutar la configuración
setupDatabase();
