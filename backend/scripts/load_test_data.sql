-- Script para cargar datos de prueba básicos en la base de datos InvSysIT
USE InvSysIT;
GO

-- 1. Insertar Departamentos
PRINT 'Insertando departamentos...';
IF NOT EXISTS (SELECT * FROM Departments WHERE name = 'Ventas')
    INSERT INTO Departments (name) VALUES ('Ventas');
IF NOT EXISTS (SELECT * FROM Departments WHERE name = 'Recursos Humanos')
    INSERT INTO Departments (name) VALUES ('Recursos Humanos');
IF NOT EXISTS (SELECT * FROM Departments WHERE name = 'Finanzas')
    INSERT INTO Departments (name) VALUES ('Finanzas');
IF NOT EXISTS (SELECT * FROM Departments WHERE name = 'Operaciones')
    INSERT INTO Departments (name) VALUES ('Operaciones');
GO

-- 2. Insertar Sucursales
PRINT 'Insertando sucursales...';
IF NOT EXISTS (SELECT * FROM Branches WHERE name = 'Oficina Central')
    INSERT INTO Branches (name, address) VALUES ('Oficina Central', 'Av. Principal 123, Ciudad');
IF NOT EXISTS (SELECT * FROM Branches WHERE name = 'Sucursal Norte')
    INSERT INTO Branches (name, address) VALUES ('Sucursal Norte', 'Calle Norte 456, Ciudad');
IF NOT EXISTS (SELECT * FROM Branches WHERE name = 'Sucursal Sur')
    INSERT INTO Branches (name, address) VALUES ('Sucursal Sur', 'Calle Sur 789, Ciudad');
GO

-- 3. Insertar Categorías y Subcategorías
PRINT 'Insertando categorías...';

-- Crear categoría Hardware
DECLARE @hardwareId INT;
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Hardware' AND parentId IS NULL)
BEGIN
    INSERT INTO Categories (name, description, parentId, active)
    VALUES ('Hardware', 'Equipos informáticos físicos', NULL, 1);
    SET @hardwareId = SCOPE_IDENTITY();
END
ELSE
    SELECT @hardwareId = id FROM Categories WHERE name = 'Hardware' AND parentId IS NULL;

-- Crear categoría Software
DECLARE @softwareId INT;
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Software' AND parentId IS NULL)
BEGIN
    INSERT INTO Categories (name, description, parentId, active)
    VALUES ('Software', 'Programas y aplicaciones', NULL, 1);
    SET @softwareId = SCOPE_IDENTITY();
END
ELSE
    SELECT @softwareId = id FROM Categories WHERE name = 'Software' AND parentId IS NULL;

-- Crear categoría Dispositivos Móviles
DECLARE @mobilesId INT;
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Dispositivos Móviles' AND parentId IS NULL)
BEGIN
    INSERT INTO Categories (name, description, parentId, active)
    VALUES ('Dispositivos Móviles', 'Smartphones, tablets y dispositivos portátiles', NULL, 1);
    SET @mobilesId = SCOPE_IDENTITY();
END
ELSE
    SELECT @mobilesId = id FROM Categories WHERE name = 'Dispositivos Móviles' AND parentId IS NULL;

-- Crear categoría Consumibles
DECLARE @consumablesId INT;
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Consumibles' AND parentId IS NULL)
BEGIN
    INSERT INTO Categories (name, description, parentId, active)
    VALUES ('Consumibles', 'Materiales que se consumen con el uso', NULL, 1);
    SET @consumablesId = SCOPE_IDENTITY();
END
ELSE
    SELECT @consumablesId = id FROM Categories WHERE name = 'Consumibles' AND parentId IS NULL;

-- Crear subcategoría de Hardware: Notebooks
DECLARE @notebooksId INT;
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Notebooks' AND parentId = @hardwareId)
BEGIN
    INSERT INTO Categories (name, description, parentId, active)
    VALUES ('Notebooks', 'Computadoras portátiles', @hardwareId, 1);
    SET @notebooksId = SCOPE_IDENTITY();
END
ELSE
    SELECT @notebooksId = id FROM Categories WHERE name = 'Notebooks' AND parentId = @hardwareId;

-- Crear subcategoría de Hardware: PCs de Escritorio
DECLARE @desktopsId INT;
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Computadoras de Escritorio' AND parentId = @hardwareId)
BEGIN
    INSERT INTO Categories (name, description, parentId, active)
    VALUES ('Computadoras de Escritorio', 'Computadoras fijas para oficina', @hardwareId, 1);
    SET @desktopsId = SCOPE_IDENTITY();
END
ELSE
    SELECT @desktopsId = id FROM Categories WHERE name = 'Computadoras de Escritorio' AND parentId = @hardwareId;

-- Crear subcategoría de Dispositivos Móviles: Smartphones
DECLARE @phonesId INT;
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Smartphones' AND parentId = @mobilesId)
BEGIN
    INSERT INTO Categories (name, description, parentId, active)
    VALUES ('Smartphones', 'Teléfonos inteligentes', @mobilesId, 1);
    SET @phonesId = SCOPE_IDENTITY();
END
ELSE
    SELECT @phonesId = id FROM Categories WHERE name = 'Smartphones' AND parentId = @mobilesId;

-- Crear subcategoría de Consumibles: Toners
DECLARE @tonersId INT;
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Toners y Cartuchos' AND parentId = @consumablesId)
BEGIN
    INSERT INTO Categories (name, description, parentId, active)
    VALUES ('Toners y Cartuchos', 'Consumibles para impresoras', @consumablesId, 1);
    SET @tonersId = SCOPE_IDENTITY();
END
ELSE
    SELECT @tonersId = id FROM Categories WHERE name = 'Toners y Cartuchos' AND parentId = @consumablesId;

GO

-- 4. Insertar Productos básicos
PRINT 'Insertando productos...';

-- Notebook Dell (Activo)
DECLARE @dellNotebookId INT;
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Notebook Dell Latitude 5420')
BEGIN
    INSERT INTO Products (name, description, categoryId, type, stockQuantity, stockThreshold, unitPrice, status, specifications)
    VALUES ('Notebook Dell Latitude 5420', 
           'Notebook empresarial de 14 pulgadas', 
           (SELECT id FROM Categories WHERE name = 'Notebooks'), 
           'asset', 
           15, 
           5, 
           1200.00, 
           'active', 
           '{"processor":"Intel Core i5-1135G7","ram":"16 GB","storage":"512 GB SSD","screen":"14 pulgadas FHD"}');
    SET @dellNotebookId = SCOPE_IDENTITY();
END
ELSE
    SELECT @dellNotebookId = id FROM Products WHERE name = 'Notebook Dell Latitude 5420';

-- Samsung Galaxy (Activo)
DECLARE @samsungId INT;
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Samsung Galaxy S22')
BEGIN
    INSERT INTO Products (name, description, categoryId, type, stockQuantity, stockThreshold, unitPrice, status, specifications)
    VALUES ('Samsung Galaxy S22', 
           'Smartphone de gama alta', 
           (SELECT id FROM Categories WHERE name = 'Smartphones'), 
           'asset', 
           12, 
           3, 
           850.00, 
           'active', 
           '{"processor":"Exynos 2200","ram":"8 GB","storage":"128 GB","screen":"6.1 pulgadas Dynamic AMOLED 2X"}');
    SET @samsungId = SCOPE_IDENTITY();
END
ELSE
    SELECT @samsungId = id FROM Products WHERE name = 'Samsung Galaxy S22';

-- Toner HP (Consumible)
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Toner HP 26A')
BEGIN
    INSERT INTO Products (name, description, categoryId, type, stockQuantity, stockThreshold, unitPrice, status, specifications)
    VALUES ('Toner HP 26A', 
           'Toner para impresoras HP LaserJet Pro M402/M426', 
           (SELECT id FROM Categories WHERE name = 'Toners y Cartuchos'), 
           'consumable', 
           25, 
           8, 
           95.00, 
           'active', 
           '{"model":"CF226A","yield":"3100 páginas","compatibility":"HP LaserJet Pro M402, M426"}');
END

-- 5. Insertar AssetDetails (seriales específicos)
PRINT 'Insertando detalles de activos...';

-- Seriales para Notebook Dell
IF NOT EXISTS (SELECT * FROM AssetDetails WHERE serialNumber = 'DL5420-001')
BEGIN
    INSERT INTO AssetDetails (productId, serialNumber, purchaseDate, warrantyExpiration, status, notes)
    VALUES (@dellNotebookId, 'DL5420-001', DATEADD(month, -6, GETDATE()), DATEADD(year, 3, DATEADD(month, -6, GETDATE())), 'available', 'Equipo nuevo');
END

IF NOT EXISTS (SELECT * FROM AssetDetails WHERE serialNumber = 'DL5420-002')
BEGIN
    INSERT INTO AssetDetails (productId, serialNumber, purchaseDate, warrantyExpiration, status, notes)
    VALUES (@dellNotebookId, 'DL5420-002', DATEADD(month, -6, GETDATE()), DATEADD(year, 3, DATEADD(month, -6, GETDATE())), 'available', 'Equipo nuevo');
END

-- Seriales para Samsung Galaxy
IF NOT EXISTS (SELECT * FROM AssetDetails WHERE serialNumber = 'SG22-001')
BEGIN
    INSERT INTO AssetDetails (productId, serialNumber, purchaseDate, warrantyExpiration, status, notes)
    VALUES (@samsungId, 'SG22-001', DATEADD(month, -3, GETDATE()), DATEADD(year, 2, DATEADD(month, -3, GETDATE())), 'available', 'Equipo nuevo');
END

-- 6. Insertar usuarios de prueba
PRINT 'Insertando usuarios de prueba...';

-- Hash para contraseña "Test123!"
DECLARE @testPassword NVARCHAR(255) = '$2a$10$1hP9Wm5TdVKFnWMhvBQcPO3LIz9bU5LCTLFUQaGPsS3Y26tWrZQym';

-- Usuario de Ventas
DECLARE @departmentVentas INT = (SELECT id FROM Departments WHERE name = 'Ventas');
IF NOT EXISTS (SELECT * FROM Users WHERE email = 'ventas@invsys.com')
BEGIN
    INSERT INTO Users (name, email, password, role, departmentId, active)
    VALUES ('Ejecutivo Ventas', 'ventas@invsys.com', @testPassword, 'user', @departmentVentas, 1);
END

-- Usuario de Finanzas
DECLARE @departmentFinanzas INT = (SELECT id FROM Departments WHERE name = 'Finanzas');
IF NOT EXISTS (SELECT * FROM Users WHERE email = 'finanzas@invsys.com')
BEGIN
    INSERT INTO Users (name, email, password, role, departmentId, active)
    VALUES ('Analista Finanzas', 'finanzas@invsys.com', @testPassword, 'user', @departmentFinanzas, 1);
END

PRINT 'Datos de prueba cargados exitosamente.';
GO
