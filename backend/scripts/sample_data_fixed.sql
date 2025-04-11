-- Script para cargar datos de prueba en la base de datos InvSysIT
USE InvSysIT;
GO

-- Insertar Departamentos adicionales si no existen
IF NOT EXISTS (SELECT * FROM Departments WHERE name = 'Ventas')
    INSERT INTO Departments (name) VALUES ('Ventas');
IF NOT EXISTS (SELECT * FROM Departments WHERE name = 'Recursos Humanos')
    INSERT INTO Departments (name) VALUES ('Recursos Humanos');
IF NOT EXISTS (SELECT * FROM Departments WHERE name = 'Finanzas')
    INSERT INTO Departments (name) VALUES ('Finanzas');
IF NOT EXISTS (SELECT * FROM Departments WHERE name = 'Operaciones')
    INSERT INTO Departments (name) VALUES ('Operaciones');

-- Insertar Sucursales
IF NOT EXISTS (SELECT * FROM Branches WHERE name = 'Oficina Central')
    INSERT INTO Branches (name, address) VALUES ('Oficina Central', 'Av. Principal 123, Ciudad');
IF NOT EXISTS (SELECT * FROM Branches WHERE name = 'Sucursal Norte')
    INSERT INTO Branches (name, address) VALUES ('Sucursal Norte', 'Calle Norte 456, Ciudad');
IF NOT EXISTS (SELECT * FROM Branches WHERE name = 'Sucursal Sur')
    INSERT INTO Branches (name, address) VALUES ('Sucursal Sur', 'Calle Sur 789, Ciudad');

-- Insertar Usuarios de prueba (contraseña: Test123!)
DECLARE @password NVARCHAR(255) = '$2a$10$1hP9Wm5TdVKFnWMhvBQcPO3LIz9bU5LCTLFUQaGPsS3Y26tWrZQym';
DECLARE @departmentIT INT, @departmentRRHH INT, @departmentVentas INT, @departmentFinanzas INT;

SELECT @departmentIT = id FROM Departments WHERE name = 'IT';
SELECT @departmentRRHH = id FROM Departments WHERE name = 'Recursos Humanos';
SELECT @departmentVentas = id FROM Departments WHERE name = 'Ventas';
SELECT @departmentFinanzas = id FROM Departments WHERE name = 'Finanzas';

-- Supervisor de IT
IF NOT EXISTS (SELECT * FROM Users WHERE email = 'supervisor@invsys.com')
    EXEC sp_CreateUser 
        @name = 'Supervisor IT',
        @email = 'supervisor@invsys.com',
        @password = @password,
        @role = 'admin',
        @departmentId = @departmentIT;

-- Usuario regular de IT
IF NOT EXISTS (SELECT * FROM Users WHERE email = 'soporte@invsys.com')
    EXEC sp_CreateUser 
        @name = 'Soporte Técnico',
        @email = 'soporte@invsys.com',
        @password = @password,
        @role = 'user',
        @departmentId = @departmentIT;

-- Usuario de RRHH
IF NOT EXISTS (SELECT * FROM Users WHERE email = 'rrhh@invsys.com')
    EXEC sp_CreateUser 
        @name = 'Recursos Humanos',
        @email = 'rrhh@invsys.com',
        @password = @password,
        @role = 'user',
        @departmentId = @departmentRRHH;

-- Usuario de Ventas
IF NOT EXISTS (SELECT * FROM Users WHERE email = 'ventas@invsys.com')
    EXEC sp_CreateUser 
        @name = 'Ejecutivo Ventas',
        @email = 'ventas@invsys.com',
        @password = @password,
        @role = 'user',
        @departmentId = @departmentVentas;

-- Usuario de Finanzas
IF NOT EXISTS (SELECT * FROM Users WHERE email = 'finanzas@invsys.com')
    EXEC sp_CreateUser 
        @name = 'Analista Finanzas',
        @email = 'finanzas@invsys.com',
        @password = @password,
        @role = 'user',
        @departmentId = @departmentFinanzas;

-- Insertar Categorías principales
DECLARE @hardwareId INT, @softwareId INT, @mobilesId INT, @consumablesId INT;

-- Hardware
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Hardware' AND parentId IS NULL)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Hardware',
        @description = 'Equipos informáticos físicos',
        @parentId = NULL,
        @newCategoryId = @hardwareId OUTPUT;
END
ELSE
    SELECT @hardwareId = id FROM Categories WHERE name = 'Hardware' AND parentId IS NULL;

-- Software
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Software' AND parentId IS NULL)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Software',
        @description = 'Programas y aplicaciones',
        @parentId = NULL,
        @newCategoryId = @softwareId OUTPUT;
END
ELSE
    SELECT @softwareId = id FROM Categories WHERE name = 'Software' AND parentId IS NULL;

-- Dispositivos Móviles
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Dispositivos Móviles' AND parentId IS NULL)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Dispositivos Móviles',
        @description = 'Smartphones, tablets y dispositivos portátiles',
        @parentId = NULL,
        @newCategoryId = @mobilesId OUTPUT;
END
ELSE
    SELECT @mobilesId = id FROM Categories WHERE name = 'Dispositivos Móviles' AND parentId IS NULL;

-- Consumibles
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Consumibles' AND parentId IS NULL)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Consumibles',
        @description = 'Materiales que se consumen con el uso',
        @parentId = NULL,
        @newCategoryId = @consumablesId OUTPUT;
END
ELSE
    SELECT @consumablesId = id FROM Categories WHERE name = 'Consumibles' AND parentId IS NULL;

-- Insertar Subcategorías
DECLARE @notebooksId INT, @desktopsId INT, @monitorsId INT, @phonesId INT, @tablesId INT;
DECLARE @officeId INT, @antivirusId INT, @tonerCartridgesId INT, @cablesId INT;

-- Subcategorías de Hardware
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Notebooks' AND parentId = @hardwareId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Notebooks',
        @description = 'Computadoras portátiles',
        @parentId = @hardwareId,
        @newCategoryId = @notebooksId OUTPUT;
END
ELSE
    SELECT @notebooksId = id FROM Categories WHERE name = 'Notebooks' AND parentId = @hardwareId;

IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Computadoras de Escritorio' AND parentId = @hardwareId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Computadoras de Escritorio',
        @description = 'Computadoras fijas para oficina',
        @parentId = @hardwareId,
        @newCategoryId = @desktopsId OUTPUT;
END
ELSE
    SELECT @desktopsId = id FROM Categories WHERE name = 'Computadoras de Escritorio' AND parentId = @hardwareId;

IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Monitores' AND parentId = @hardwareId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Monitores',
        @description = 'Pantallas para computadoras',
        @parentId = @hardwareId,
        @newCategoryId = @monitorsId OUTPUT;
END
ELSE
    SELECT @monitorsId = id FROM Categories WHERE name = 'Monitores' AND parentId = @hardwareId;

-- Subcategorías de Dispositivos Móviles
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Smartphones' AND parentId = @mobilesId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Smartphones',
        @description = 'Teléfonos inteligentes',
        @parentId = @mobilesId,
        @newCategoryId = @phonesId OUTPUT;
END
ELSE
    SELECT @phonesId = id FROM Categories WHERE name = 'Smartphones' AND parentId = @mobilesId;

IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Tablets' AND parentId = @mobilesId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Tablets',
        @description = 'Dispositivos tablet',
        @parentId = @mobilesId,
        @newCategoryId = @tablesId OUTPUT;
END
ELSE
    SELECT @tablesId = id FROM Categories WHERE name = 'Tablets' AND parentId = @mobilesId;

-- Subcategorías de Software
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Office' AND parentId = @softwareId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Office',
        @description = 'Suites ofimáticas',
        @parentId = @softwareId,
        @newCategoryId = @officeId OUTPUT;
END
ELSE
    SELECT @officeId = id FROM Categories WHERE name = 'Office' AND parentId = @softwareId;

IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Antivirus' AND parentId = @softwareId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Antivirus',
        @description = 'Software de seguridad',
        @parentId = @softwareId,
        @newCategoryId = @antivirusId OUTPUT;
END
ELSE
    SELECT @antivirusId = id FROM Categories WHERE name = 'Antivirus' AND parentId = @softwareId;

-- Subcategorías de Consumibles
IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Toners y Cartuchos' AND parentId = @consumablesId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Toners y Cartuchos',
        @description = 'Consumibles para impresoras',
        @parentId = @consumablesId,
        @newCategoryId = @tonerCartridgesId OUTPUT;
END
ELSE
    SELECT @tonerCartridgesId = id FROM Categories WHERE name = 'Toners y Cartuchos' AND parentId = @consumablesId;

IF NOT EXISTS (SELECT * FROM Categories WHERE name = 'Cables y Adaptadores' AND parentId = @consumablesId)
BEGIN
    EXEC sp_CreateCategory 
        @name = 'Cables y Adaptadores',
        @description = 'Cables de conexión y adaptadores',
        @parentId = @consumablesId,
        @newCategoryId = @cablesId OUTPUT;
END
ELSE
    SELECT @cablesId = id FROM Categories WHERE name = 'Cables y Adaptadores' AND parentId = @consumablesId;

-- Insertar Productos - Activos
DECLARE @productId INT, @productId2 INT, @productId3 INT, @productId4 INT, @productId5 INT;
DECLARE @productId6 INT, @productId7 INT, @productId8 INT;

-- Notebook Dell
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Notebook Dell Latitude 5420')
BEGIN
    EXEC sp_CreateProduct
        @name = 'Notebook Dell Latitude 5420',
        @description = 'Notebook empresarial de 14 pulgadas',
        @categoryId = @notebooksId,
        @type = 'asset',
        @stockQuantity = 15,
        @stockThreshold = 5,
        @unitPrice = 1200.00,
        @status = 'active',
        @specifications = '{"processor":"Intel Core i5-1135G7","ram":"16 GB","storage":"512 GB SSD","screen":"14 pulgadas FHD"}',
        @newProductId = @productId OUTPUT;
END
ELSE
    SELECT @productId = id FROM Products WHERE name = 'Notebook Dell Latitude 5420';

-- Notebook HP
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Notebook HP ProBook 450 G8')
BEGIN
    EXEC sp_CreateProduct
        @name = 'Notebook HP ProBook 450 G8',
        @description = 'Notebook empresarial de 15.6 pulgadas',
        @categoryId = @notebooksId,
        @type = 'asset',
        @stockQuantity = 10,
        @stockThreshold = 3,
        @unitPrice = 1100.00,
        @status = 'active',
        @specifications = '{"processor":"Intel Core i7-1165G7","ram":"16 GB","storage":"512 GB SSD","screen":"15.6 pulgadas FHD"}',
        @newProductId = @productId2 OUTPUT;
END
ELSE
    SELECT @productId2 = id FROM Products WHERE name = 'Notebook HP ProBook 450 G8';

-- Desktop Dell
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Desktop Dell OptiPlex 7090')
BEGIN
    EXEC sp_CreateProduct
        @name = 'Desktop Dell OptiPlex 7090',
        @description = 'Computadora de escritorio empresarial',
        @categoryId = @desktopsId,
        @type = 'asset',
        @stockQuantity = 8,
        @stockThreshold = 2,
        @unitPrice = 950.00,
        @status = 'active',
        @specifications = '{"processor":"Intel Core i7-10700","ram":"16 GB","storage":"1 TB SSD","formFactor":"Small Form Factor"}',
        @newProductId = @productId3 OUTPUT;
END
ELSE
    SELECT @productId3 = id FROM Products WHERE name = 'Desktop Dell OptiPlex 7090';

-- Monitor Dell
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Monitor Dell P2422H')
BEGIN
    EXEC sp_CreateProduct
        @name = 'Monitor Dell P2422H',
        @description = 'Monitor profesional de 24 pulgadas',
        @categoryId = @monitorsId,
        @type = 'asset',
        @stockQuantity = 20,
        @stockThreshold = 5,
        @unitPrice = 280.00,
        @status = 'active',
        @specifications = '{"size":"24 pulgadas","resolution":"1920x1080","panelType":"IPS","ports":"HDMI, DisplayPort, VGA"}',
        @newProductId = @productId4 OUTPUT;
END
ELSE
    SELECT @productId4 = id FROM Products WHERE name = 'Monitor Dell P2422H';

-- Smartphone Samsung
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Samsung Galaxy S22')
BEGIN
    EXEC sp_CreateProduct
        @name = 'Samsung Galaxy S22',
        @description = 'Smartphone de gama alta',
        @categoryId = @phonesId,
        @type = 'asset',
        @stockQuantity = 12,
        @stockThreshold = 3,
        @unitPrice = 850.00,
        @status = 'active',
        @specifications = '{"processor":"Exynos 2200","ram":"8 GB","storage":"128 GB","screen":"6.1 pulgadas Dynamic AMOLED 2X"}',
        @newProductId = @productId5 OUTPUT;
END
ELSE
    SELECT @productId5 = id FROM Products WHERE name = 'Samsung Galaxy S22';

-- Productos - Consumibles

-- Toner HP
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Toner HP 26A')
BEGIN
    EXEC sp_CreateProduct
        @name = 'Toner HP 26A',
        @description = 'Toner para impresoras HP LaserJet Pro M402/M426',
        @categoryId = @tonerCartridgesId,
        @type = 'consumable',
        @stockQuantity = 25,
        @stockThreshold = 8,
        @unitPrice = 95.00,
        @status = 'active',
        @specifications = '{"model":"CF226A","yield":"3100 páginas","compatibility":"HP LaserJet Pro M402, M426"}',
        @newProductId = @productId6 OUTPUT;
END
ELSE
    SELECT @productId6 = id FROM Products WHERE name = 'Toner HP 26A';

-- Cable HDMI
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Cable HDMI 2m')
BEGIN
    EXEC sp_CreateProduct
        @name = 'Cable HDMI 2m',
        @description = 'Cable HDMI de alta velocidad 2 metros',
        @categoryId = @cablesId,
        @type = 'consumable',
        @stockQuantity = 30,
        @stockThreshold = 10,
        @unitPrice = 12.00,
        @status = 'active',
        @specifications = '{"length":"2 metros","version":"2.0","features":"4K, HDR, 18Gbps"}',
        @newProductId = @productId7 OUTPUT;
END
ELSE
    SELECT @productId7 = id FROM Products WHERE name = 'Cable HDMI 2m';

-- Licencia Microsoft Office
IF NOT EXISTS (SELECT * FROM Products WHERE name = 'Microsoft Office 365 Business')
BEGIN
    EXEC sp_CreateProduct
        @name = 'Microsoft Office 365 Business',
        @description = 'Licencia anual de Office 365 para empresas',
        @categoryId = @officeId,
        @type = 'consumable',
        @stockQuantity = 40,
        @stockThreshold = 10,
        @unitPrice = 150.00,
        @status = 'active',
        @specifications = '{"subscription":"Anual","apps":"Word, Excel, PowerPoint, Outlook, Teams","cloud":"1 TB OneDrive"}',
        @newProductId = @productId8 OUTPUT;
END
ELSE
    SELECT @productId8 = id FROM Products WHERE name = 'Microsoft Office 365 Business';

-- Insertar algunos AssetDetails (seriales específicos para activos)
DECLARE @assetDetailId1 INT, @assetDetailId2 INT, @assetDetailId3 INT;

-- Seriales para Notebooks Dell
IF NOT EXISTS (SELECT * FROM AssetDetails WHERE serialNumber = 'DL5420-001')
BEGIN
    INSERT INTO AssetDetails (productId, serialNumber, purchaseDate, warrantyExpiration, status, notes)
    VALUES (@productId, 'DL5420-001', DATEADD(month, -6, GETDATE()), DATEADD(year, 3, DATEADD(month, -6, GETDATE())), 'available', 'Equipo nuevo');
    SET @assetDetailId1 = SCOPE_IDENTITY();
END
ELSE
    SELECT @assetDetailId1 = id FROM AssetDetails WHERE serialNumber = 'DL5420-001';

IF NOT EXISTS (SELECT * FROM AssetDetails WHERE serialNumber = 'DL5420-002')
BEGIN
    INSERT INTO AssetDetails (productId, serialNumber, purchaseDate, warrantyExpiration, status, notes)
    VALUES (@productId, 'DL5420-002', DATEADD(month, -6, GETDATE()), DATEADD(year, 3, DATEADD(month, -6, GETDATE())), 'available', 'Equipo nuevo');
END

-- Seriales para Samsung Galaxy
IF NOT EXISTS (SELECT * FROM AssetDetails WHERE serialNumber = 'SG22-001')
BEGIN
    INSERT INTO AssetDetails (productId, serialNumber, purchaseDate, warrantyExpiration, status, notes)
    VALUES (@productId5, 'SG22-001', DATEADD(month, -3, GETDATE()), DATEADD(year, 2, DATEADD(month, -3, GETDATE())), 'available', 'Equipo nuevo');
    SET @assetDetailId2 = SCOPE_IDENTITY();
END
ELSE
    SELECT @assetDetailId2 = id FROM AssetDetails WHERE serialNumber = 'SG22-001';

IF NOT EXISTS (SELECT * FROM AssetDetails WHERE serialNumber = 'SG22-002')
BEGIN
    INSERT INTO AssetDetails (productId, serialNumber, purchaseDate, warrantyExpiration, status, notes)
    VALUES (@productId5, 'SG22-002', DATEADD(month, -3, GETDATE()), DATEADD(year, 2, DATEADD(month, -3, GETDATE())), 'available', 'Equipo nuevo');
    SET @assetDetailId3 = SCOPE_IDENTITY();
END
ELSE
    SELECT @assetDetailId3 = id FROM AssetDetails WHERE serialNumber = 'SG22-002';

-- Registrar algunos movimientos de inventario
DECLARE @adminId INT, @techUserId INT, @financeUserId INT;

SELECT @adminId = id FROM Users WHERE email = 'admin@invsys.com';
SELECT @techUserId = id FROM Users WHERE email = 'soporte@invsys.com';
SELECT @financeUserId = id FROM Users WHERE email = 'finanzas@invsys.com';

-- Entrada de stock para Notebooks Dell
IF NOT EXISTS (SELECT TOP 1 * FROM InventoryMovements WHERE movementType = 'entry' AND productId = @productId)
BEGIN
    EXEC sp_RegisterInventoryEntry
        @productId = @productId,
        @quantity = 5,
        @userId = @adminId,
        @notes = 'Compra inicial de equipos';
END

-- Entrada de stock para Toners
IF NOT EXISTS (SELECT TOP 1 * FROM InventoryMovements WHERE movementType = 'entry' AND productId = @productId6)
BEGIN
    EXEC sp_RegisterInventoryEntry
        @productId = @productId6,
        @quantity = 10,
        @userId = @adminId,
        @notes = 'Reposición de inventario';
END

-- Asignar notebook a usuario de finanzas
IF NOT EXISTS (SELECT TOP 1 * FROM InventoryMovements WHERE movementType = 'assignment' AND assetDetailId = @assetDetailId1)
BEGIN
    EXEC sp_RegisterAssetAssignment
        @assetDetailId = @assetDetailId1,
        @assignedToId = @financeUserId,
        @assignedById = @adminId,
        @departmentId = (SELECT departmentId FROM Users WHERE id = @financeUserId),
        @branchId = 1, -- Oficina Central
        @encryptionPassword = 'SecurePass123',
        @notes = 'Asignación de equipo para trabajo remoto';
END

-- Asignar smartphone a usuario IT
IF NOT EXISTS (SELECT TOP 1 * FROM InventoryMovements WHERE movementType = 'assignment' AND assetDetailId = @assetDetailId2)
BEGIN
    EXEC sp_RegisterAssetAssignment
        @assetDetailId = @assetDetailId2,
        @assignedToId = @techUserId,
        @assignedById = @adminId,
        @departmentId = (SELECT departmentId FROM Users WHERE id = @techUserId),
        @branchId = 1, -- Oficina Central
        @encryptionPassword = 'SecurePass456',
        @notes = 'Teléfono para soporte técnico';
END

-- Salida de consumibles (toners)
IF NOT EXISTS (SELECT TOP 1 * FROM InventoryMovements WHERE movementType = 'out' AND productId = @productId6)
BEGIN
    EXEC sp_RegisterInventoryOut
        @productId = @productId6,
        @quantity = 2,
        @userId = @adminId,
        @destinationType = 'department',
        @departmentId = @departmentIT,
        @branchId = NULL,
        @notes = 'Toners para impresoras del departamento IT';
END

-- Crear algunas notificaciones
DECLARE @now DATETIME = GETDATE();

-- Notificación para administrador
IF NOT EXISTS (SELECT TOP 1 * FROM Notifications WHERE userId = @adminId)
BEGIN
    INSERT INTO Notifications (userId, message, type, isRead, createdAt)
    VALUES (@adminId, 'Bienvenido al sistema de Inventario IT', 'info', 0, @now);
END

-- Notificación para usuario técnico
IF NOT EXISTS (SELECT TOP 1 * FROM Notifications WHERE userId = @techUserId)
BEGIN
    INSERT INTO Notifications (userId, message, type, isRead, createdAt)
    VALUES (@techUserId, 'Tienes un nuevo dispositivo asignado', 'success', 0, @now);
END

-- Notificación para usuario de finanzas
IF NOT EXISTS (SELECT TOP 1 * FROM Notifications WHERE userId = @financeUserId)
BEGIN
    INSERT INTO Notifications (userId, message, type, isRead, createdAt)
    VALUES (@financeUserId, 'Tienes un nuevo notebook asignado', 'success', 0, @now);
    
    INSERT INTO Notifications (userId, message, type, isRead, createdAt)
    VALUES (@financeUserId, 'Por favor completa tu perfil de usuario', 'warning', 0, DATEADD(day, -1, @now));
END

PRINT 'Datos de prueba cargados exitosamente.';
GO
