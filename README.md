# Sistema de Inventario IT 2.0

Aplicación web robusta para la gestión de inventario y control de activos fijos del sector de Soporte IT. El sistema gestiona activos desde su recepción hasta asignación, reparación y baja, diseñado para ser utilizado por un equipo de 8-10 personas.

## Características Principales

### Gestión de Usuarios y Permisos
- Sistema de autenticación con usuarios/contraseñas
- Roles de administrador y usuario estándar
- Registro de actividad con fecha, hora y usuario

### Gestión de Inventario
- Categorización jerárquica de activos (Computadoras, Celulares, Periféricos, etc.)
- Registro de entradas de stock con cantidades o números de serie
- Registro de salidas con destino (empleado, departamento, etc.)
- Seguimiento especial para notebooks y celulares

### Seguimiento de Movimientos
- Tabla de movimientos con filtros por tipo, categoría, fecha y búsqueda
- Visualización de entradas y salidas en un solo lugar
- Detalles completos de cada movimiento

### Reportes y Alertas
- Alertas para niveles bajos de stock
- Dashboard con información clave de un vistazo

## Tecnologías Utilizadas

### Frontend
- React.js
- Styled Components para el diseño de la interfaz
- React Router para la navegación

### Backend
- Node.js
- Express para el servidor API
- Microsoft SQL Server para la base de datos

## Estructura del Proyecto

- **backend/**: API REST para la lógica del servidor
- **frontend/**: Interfaz de usuario React
- **docs/**: Documentación del proyecto

## Cómo Ejecutar el Proyecto

### Requisitos Previos
- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior)

### Para Iniciar el Frontend
```bash
cd frontend
npm install
npm start
```

### Para Iniciar el Backend
```bash
cd backend
npm install
npm start
```

## Nuevas Funcionalidades Implementadas

### Página de Movimientos de Inventario
- Visualización centralizada de todas las entradas y salidas
- Filtros avanzados para buscar movimientos específicos
- Acceso detallado a la información de cada movimiento

### Formulario de Salida de Inventario
- Registro de asignaciones de equipos a empleados
- Validación para números de serie de productos específicos
- Campos especiales para notebooks y celulares

## Próximos Desarrollos

1. Implementación de gestión de devoluciones
2. Sistema de gestión de reparaciones
3. Mejoras en los reportes exportables
4. Integración con sistemas externos

## Contacto

Para más información sobre este proyecto, contactar a:
Soporte IT - Extensión 1234
