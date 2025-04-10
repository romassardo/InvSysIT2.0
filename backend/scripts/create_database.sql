-- Script para crear la base de datos y tablas para InvSysIT
USE master;
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'InvSysIT')
BEGIN
    CREATE DATABASE InvSysIT;
END
GO

USE InvSysIT;
GO

-- Tabla de Departamentos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Departments')
BEGIN
    CREATE TABLE Departments (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        active BIT NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Sucursales
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Branches')
BEGIN
    CREATE TABLE Branches (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        address NVARCHAR(255),
        active BIT NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(20) NOT NULL DEFAULT 'user', -- 'admin' o 'user'
        departmentId INT REFERENCES Departments(id),
        active BIT NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Categorías
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE Categories (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(255),
        parentId INT REFERENCES Categories(id), -- Auto-referencia para jerarquía
        active BIT NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Productos (tanto activos como consumibles)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        id INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(255),
        model NVARCHAR(100),
        brand NVARCHAR(100),
        categoryId INT REFERENCES Categories(id),
        type NVARCHAR(20) NOT NULL, -- 'asset' o 'consumable'
        currentStock INT NOT NULL DEFAULT 0,
        minimumStock INT DEFAULT 0,
        active BIT NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Detalles de Activos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AssetDetails')
BEGIN
    CREATE TABLE AssetDetails (
        id INT PRIMARY KEY IDENTITY(1,1),
        productId INT NOT NULL REFERENCES Products(id),
        serialNumber NVARCHAR(100) UNIQUE,
        assetTag NVARCHAR(100),
        purchaseDate DATE,
        warrantyExpiration DATE,
        status NVARCHAR(20) NOT NULL DEFAULT 'available', -- 'available', 'assigned', 'maintenance', 'retired'
        notes NVARCHAR(MAX),
        encryptionPass NVARCHAR(255), -- Campo específico para notebooks/celulares
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Movimientos de Inventario
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'InventoryMovements')
BEGIN
    CREATE TABLE InventoryMovements (
        id INT PRIMARY KEY IDENTITY(1,1),
        type NVARCHAR(20) NOT NULL, -- 'entry', 'exit', 'assignment'
        productId INT NOT NULL REFERENCES Products(id),
        assetDetailId INT REFERENCES AssetDetails(id), -- Solo para activos específicos
        quantity INT NOT NULL,
        sourceId INT, -- Para entradas: proveedor o ubicación origen
        destinationDepartmentId INT REFERENCES Departments(id), -- Para salidas/asignaciones
        destinationBranchId INT REFERENCES Branches(id), -- Para salidas/asignaciones
        assignedUserId INT REFERENCES Users(id), -- Para asignaciones
        movementDate DATETIME NOT NULL DEFAULT GETDATE(),
        notes NVARCHAR(MAX),
        createdBy INT NOT NULL REFERENCES Users(id),
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Notificaciones
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Notifications')
BEGIN
    CREATE TABLE Notifications (
        id INT PRIMARY KEY IDENTITY(1,1),
        userId INT NOT NULL REFERENCES Users(id),
        message NVARCHAR(255) NOT NULL,
        type NVARCHAR(20) NOT NULL, -- 'info', 'warning', 'success'
        isRead BIT NOT NULL DEFAULT 0,
        relatedItemId INT, -- ID de ítem relacionado (puede ser movimiento, producto, etc.)
        relatedItemType NVARCHAR(50), -- Tipo de ítem relacionado
        createdAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Insertar datos iniciales

-- Departamentos de ejemplo
IF NOT EXISTS (SELECT * FROM Departments)
BEGIN
    INSERT INTO Departments (name) VALUES 
    ('IT'),
    ('RRHH'),
    ('Finanzas'),
    ('Operaciones'),
    ('Marketing');
END
GO

-- Sucursales de ejemplo
IF NOT EXISTS (SELECT * FROM Branches)
BEGIN
    INSERT INTO Branches (name, address) VALUES 
    ('Sede Central', 'Av. Principal 123'),
    ('Sucursal Norte', 'Calle Norte 456'),
    ('Sucursal Sur', 'Calle Sur 789');
END
GO

-- Usuario Admin por defecto (contraseña: admin123)
IF NOT EXISTS (SELECT * FROM Users WHERE email = 'admin@invsysit.com')
BEGIN
    INSERT INTO Users (name, email, password, role, departmentId) VALUES 
    ('Administrador', 'admin@invsysit.com', '$2a$10$k5DpQ4QKR8lFLuZU9.ZOIefy/QmZ.57XQH1hPBD2NPNvGeU5y5IVi', 'admin', 1);
END
GO

-- Categorías iniciales
IF NOT EXISTS (SELECT * FROM Categories WHERE parentId IS NULL)
BEGIN
    -- Categorías principales
    INSERT INTO Categories (name, description, parentId) VALUES 
    ('Hardware', 'Equipamiento físico', NULL),
    ('Software', 'Aplicaciones y sistemas', NULL),
    ('Redes', 'Equipos de conectividad', NULL),
    ('Consumibles', 'Artículos de consumo regular', NULL);

    -- Subcategorías
    -- Hardware
    DECLARE @hardwareId INT = (SELECT id FROM Categories WHERE name = 'Hardware');
    INSERT INTO Categories (name, description, parentId) VALUES 
    ('Notebooks', 'Computadoras portátiles', @hardwareId),
    ('Desktops', 'Computadoras de escritorio', @hardwareId),
    ('Servidores', 'Equipos de servidor', @hardwareId),
    ('Celulares', 'Teléfonos móviles', @hardwareId),
    ('Periféricos', 'Mouse, teclados, etc.', @hardwareId);

    -- Software
    DECLARE @softwareId INT = (SELECT id FROM Categories WHERE name = 'Software');
    INSERT INTO Categories (name, description, parentId) VALUES 
    ('Sistemas Operativos', 'Windows, Linux, MacOS', @softwareId),
    ('Ofimática', 'Office, Google Workspace', @softwareId),
    ('Diseño', 'Adobe, Figma, etc.', @softwareId),
    ('Desarrollo', 'IDEs, herramientas de código', @softwareId);

    -- Redes
    DECLARE @redesId INT = (SELECT id FROM Categories WHERE name = 'Redes');
    INSERT INTO Categories (name, description, parentId) VALUES 
    ('Switches', 'Conmutadores de red', @redesId),
    ('Routers', 'Enrutadores', @redesId),
    ('Access Points', 'Puntos de acceso WiFi', @redesId),
    ('Cables', 'Cables de red', @redesId);

    -- Consumibles
    DECLARE @consumiblesId INT = (SELECT id FROM Categories WHERE name = 'Consumibles');
    INSERT INTO Categories (name, description, parentId) VALUES 
    ('Tóner', 'Cartuchos de tóner para impresoras', @consumiblesId),
    ('Papel', 'Hojas y papelería', @consumiblesId),
    ('Tinta', 'Cartuchos de tinta', @consumiblesId),
    ('Accesorios', 'Adaptadores, fundas, etc.', @consumiblesId);
END
GO
