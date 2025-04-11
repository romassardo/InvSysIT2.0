// Punto de entrada principal para el servidor
const app = require('./app');
const { connectToDatabase } = require('./src/config/db.config');

// Iniciar la conexión a la base de datos antes de iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();
    
    // Configuración del puerto
    const PORT = process.env.PORT || 3000;

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log('Sistema de Inventario IT listo para su uso');
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();
