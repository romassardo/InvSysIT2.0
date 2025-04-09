# Proyecto: Aplicación Web de Inventario y Activos IT

## Rol y Contexto Principal

Desarrollo full-stack utilizando:
- Node.js (backend)
- React (frontend)
- JavaScript (ES6+)
- SQL Server (base de datos)
- Experiencia en diseño UI/UX para aplicaciones de gestión interna

## Objetivo del Proyecto

Desarrollar una aplicación web robusta y fácil de usar para la gestión de inventario y control de activos fijos del sector de Soporte IT. Este sector gestiona los activos desde su recepción hasta su asignación, reparación y eventual baja. La aplicación será utilizada internamente por un equipo de 8-10 personas.

## Requisitos Funcionales

### 1. Gestión de Usuarios y Permisos

- Sistema de autenticación basado en usuarios y contraseñas
- Roles de usuario:
  - Usuario estándar (8-10 personas del equipo)
  - Administrador (permisos totales sobre la aplicación)
- Registro de actividad:
  - Cada acción crítica debe registrar usuario y fecha/hora
  - Información visible en historiales y detalles del activo
- Funcionalidades de perfil:
  - Ver perfil personal
  - Cambio de contraseña
  - Posible sección de "Recordatorios" o "Tareas Pendientes"

### 2. Gestión de Activos y Catálogo

#### Categorización

Sistema de categorización jerárquica:
1. **Computadoras**: Desktops, Notebooks, Raspberry Pi
2. **Celulares**: (Sin subcategorías)
3. **Periféricos**: Teclados, Mouse, Kit Teclado/Mouse, Auriculares, Webcams, Monitores, Televisores, etc.
4. **Consumibles**: Cables (diversos tipos), Pilas, Toner, Drum (Unidad de Imagen), Cargadores (Celular, Notebook), etc.
5. **Componentes**: Memorias RAM, Discos Externos, Discos SSD/NVMe, Placas Sending, Placas de Video, Motherboards, Adaptadores USB Varios, etc.

#### Catálogo de Productos

- Módulo específico para Administradores
- Gestión de tipos de productos (alta, edición)
- Definición de marca, modelo, descripción y categoría/subcategoría

#### Entrada de Stock (Alta)

- Formulario para registro de nuevos activos
- Selección de productos del catálogo predefinido
- Registro de:
  - Cantidad (para consumibles o periféricos idénticos)
  - Números de serie individuales (para activos serializables)
  - Fecha de recepción
- Operaciones en lote para múltiples unidades o activos diferentes

#### Salida de Stock (Asignación)

- Formulario para registro de salida/asignación
- Destinos posibles: Empleado específico, Sucursal, Sector, Obra Nueva
- Seguimientos especiales:
  - **Notebooks**: Registro obligatorio de contraseña de encriptación (Bitlocker)
  - **Celulares**: Registro obligatorio de Número de Teléfono, Cuenta Gmail, Contraseña Gmail, Código de Verificación 2 Pasos WhatsApp
- Historial de asignaciones para cada activo serializable
- Operaciones en lote para múltiples asignaciones

### 3. Gestión de Reparaciones

- Formulario para envío a reparación con:
  - Fecha de envío
  - Proveedor/Lugar de reparación
  - Descripción detallada del problema/falla
- Cambio de estado a "En Reparación"
- Actualización al regreso:
  - **Reparado**: Retorno al stock general (fecha y descripción de reparación)
  - **Sin Reparación / Baja**: Marcado como irreparable (fecha y motivo)
- Historial completo de reparaciones por activo

### 4. Gestión de Consumibles

- Umbrales de stock mínimo para cada tipo de consumible
- Alertas cuando la cantidad disponible cae por debajo del umbral

### 5. Búsqueda y Filtrado

- Búsqueda potente en todas las vistas de listado
- Criterios: Número de serie, Categoría, Subcategoría, Marca, Modelo, Estado, Empleado asignado, Sucursal/Sector
- Filtros combinables

### 6. Reportes

- Reportes personalizables:
  - Listado completo de activos
  - Activos por categoría/subcategoría
  - Activos asignados por empleado/sucursal/sector
  - Activos en reparación
  - Activos dados de baja (en un período)
  - Historial de activo específico
  - Niveles de stock de consumibles
- Descarga en formatos PDF, CSV y Excel

### 7. Dashboard Principal

- Pantalla de inicio con información clave:
  - Widgets con estadísticas generales
  - Listado/Alerta de consumibles bajo mínimo
  - Accesos directos a acciones comunes
  - Gráficos simples (si es viable)

## Requisitos No Funcionales

### 1. Tecnología

- **Backend**: Node.js
- **Frontend**: React
- **Lenguaje**: JavaScript (ES6+)
- **Base de Datos**: Microsoft SQL Server
- Librerías estándar para funcionalidades clave

### 2. Diseño Visual (UI)

- Adherencia estricta a guía de estilo proporcionada en documento aparte
- Interfaz intuitiva, limpia y fácil de navegar
- Priorizar funcionalidad y claridad

### 3. Seguridad

- Autenticación segura y protección de rutas
- Implementación de mejores prácticas posibles considerando el requisito de almacenar contraseñas visibles
- Prevención de vulnerabilidades comunes (XSS, CSRF, SQL Injection)

### 4. Usabilidad

- Diseño responsivo (adaptable a diferentes tamaños de pantalla)
- Validación clara en formularios
- Mensajes de error y éxito claros

### 5. Mantenibilidad

- Código limpio, bien comentado y estructurado
- Seguimiento de buenas prácticas de desarrollo

## Entregables Esperados

- Código fuente completo (backend y frontend)
- Scripts SQL para creación de base de datos y tablas
- Instrucciones para configuración y despliegue
