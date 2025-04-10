-- Procedimientos almacenados para productos (activos y consumibles)
USE InvSysIT;
GO

-- Obtener todos los productos
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllProducts')
    DROP PROCEDURE sp_GetAllProducts;
GO

CREATE PROCEDURE sp_GetAllProducts
AS
BEGIN
    SELECT p.id, p.name, p.description, p.model, p.brand, p.categoryId, c.name AS categoryName, 
           p.type, p.currentStock, p.minimumStock, p.active, p.createdAt, p.updatedAt
    FROM Products p
    LEFT JOIN Categories c ON p.categoryId = c.id
    ORDER BY p.name;
END
GO

-- Obtener producto por ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetProductById')
    DROP PROCEDURE sp_GetProductById;
GO

CREATE PROCEDURE sp_GetProductById
    @productId INT
AS
BEGIN
    SELECT p.id, p.name, p.description, p.model, p.brand, p.categoryId, c.name AS categoryName, 
           p.type, p.currentStock, p.minimumStock, p.active, p.createdAt, p.updatedAt
    FROM Products p
    LEFT JOIN Categories c ON p.categoryId = c.id
    WHERE p.id = @productId;
END
GO

-- Obtener productos por tipo (activo o consumible)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetProductsByType')
    DROP PROCEDURE sp_GetProductsByType;
GO

CREATE PROCEDURE sp_GetProductsByType
    @type NVARCHAR(20)
AS
BEGIN
    SELECT p.id, p.name, p.description, p.model, p.brand, p.categoryId, c.name AS categoryName, 
           p.type, p.currentStock, p.minimumStock, p.active, p.createdAt, p.updatedAt
    FROM Products p
    LEFT JOIN Categories c ON p.categoryId = c.id
    WHERE p.type = @type AND p.active = 1
    ORDER BY p.name;
END
GO

-- Obtener productos por categoría
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetProductsByCategory')
    DROP PROCEDURE sp_GetProductsByCategory;
GO

CREATE PROCEDURE sp_GetProductsByCategory
    @categoryId INT
AS
BEGIN
    SELECT p.id, p.name, p.description, p.model, p.brand, p.categoryId, c.name AS categoryName, 
           p.type, p.currentStock, p.minimumStock, p.active, p.createdAt, p.updatedAt
    FROM Products p
    LEFT JOIN Categories c ON p.categoryId = c.id
    WHERE p.categoryId = @categoryId AND p.active = 1
    ORDER BY p.name;
END
GO

-- Crear nuevo producto
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateProduct')
    DROP PROCEDURE sp_CreateProduct;
GO

CREATE PROCEDURE sp_CreateProduct
    @name NVARCHAR(100),
    @description NVARCHAR(255),
    @model NVARCHAR(100),
    @brand NVARCHAR(100),
    @categoryId INT,
    @type NVARCHAR(20),
    @currentStock INT,
    @minimumStock INT
AS
BEGIN
    INSERT INTO Products (name, description, model, brand, categoryId, type, currentStock, minimumStock)
    VALUES (@name, @description, @model, @brand, @categoryId, @type, @currentStock, @minimumStock);
    
    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- Actualizar producto
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateProduct')
    DROP PROCEDURE sp_UpdateProduct;
GO

CREATE PROCEDURE sp_UpdateProduct
    @productId INT,
    @name NVARCHAR(100),
    @description NVARCHAR(255),
    @model NVARCHAR(100),
    @brand NVARCHAR(100),
    @categoryId INT,
    @type NVARCHAR(20),
    @minimumStock INT,
    @active BIT
AS
BEGIN
    UPDATE Products
    SET name = @name,
        description = @description,
        model = @model,
        brand = @brand,
        categoryId = @categoryId,
        type = @type,
        minimumStock = @minimumStock,
        active = @active,
        updatedAt = GETDATE()
    WHERE id = @productId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Actualizar stock de producto
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateProductStock')
    DROP PROCEDURE sp_UpdateProductStock;
GO

CREATE PROCEDURE sp_UpdateProductStock
    @productId INT,
    @quantity INT
AS
BEGIN
    UPDATE Products
    SET currentStock = currentStock + @quantity,
        updatedAt = GETDATE()
    WHERE id = @productId;
    
    SELECT currentStock FROM Products WHERE id = @productId;
END
GO

-- Búsqueda de productos
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_SearchProducts')
    DROP PROCEDURE sp_SearchProducts;
GO

CREATE PROCEDURE sp_SearchProducts
    @searchTerm NVARCHAR(100)
AS
BEGIN
    SELECT p.id, p.name, p.description, p.model, p.brand, p.categoryId, c.name AS categoryName, 
           p.type, p.currentStock, p.minimumStock, p.active, p.createdAt, p.updatedAt
    FROM Products p
    LEFT JOIN Categories c ON p.categoryId = c.id
    WHERE (p.name LIKE '%' + @searchTerm + '%'
           OR p.description LIKE '%' + @searchTerm + '%'
           OR p.model LIKE '%' + @searchTerm + '%'
           OR p.brand LIKE '%' + @searchTerm + '%'
           OR c.name LIKE '%' + @searchTerm + '%')
          AND p.active = 1
    ORDER BY p.name;
END
GO

-- Procedimientos para activos específicos

-- Obtener detalle de activo por ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAssetDetailById')
    DROP PROCEDURE sp_GetAssetDetailById;
GO

CREATE PROCEDURE sp_GetAssetDetailById
    @assetDetailId INT
AS
BEGIN
    SELECT a.id, a.productId, p.name AS productName, p.model, p.brand, a.serialNumber, a.assetTag,
           a.purchaseDate, a.warrantyExpiration, a.status, a.notes, a.encryptionPass, a.createdAt, a.updatedAt
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    WHERE a.id = @assetDetailId;
END
GO

-- Obtener todos los activos por producto
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAssetDetailsByProductId')
    DROP PROCEDURE sp_GetAssetDetailsByProductId;
GO

CREATE PROCEDURE sp_GetAssetDetailsByProductId
    @productId INT
AS
BEGIN
    SELECT a.id, a.productId, p.name AS productName, p.model, p.brand, a.serialNumber, a.assetTag,
           a.purchaseDate, a.warrantyExpiration, a.status, a.notes, a.encryptionPass, a.createdAt, a.updatedAt
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    WHERE a.productId = @productId
    ORDER BY a.assetTag, a.serialNumber;
END
GO

-- Obtener activos disponibles por producto
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAvailableAssetsByProductId')
    DROP PROCEDURE sp_GetAvailableAssetsByProductId;
GO

CREATE PROCEDURE sp_GetAvailableAssetsByProductId
    @productId INT
AS
BEGIN
    SELECT a.id, a.productId, p.name AS productName, p.model, p.brand, a.serialNumber, a.assetTag,
           a.purchaseDate, a.warrantyExpiration, a.status, a.notes, a.encryptionPass, a.createdAt, a.updatedAt
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    WHERE a.productId = @productId AND a.status = 'available'
    ORDER BY a.assetTag, a.serialNumber;
END
GO

-- Crear detalle de activo
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateAssetDetail')
    DROP PROCEDURE sp_CreateAssetDetail;
GO

CREATE PROCEDURE sp_CreateAssetDetail
    @productId INT,
    @serialNumber NVARCHAR(100),
    @assetTag NVARCHAR(100),
    @purchaseDate DATE,
    @warrantyExpiration DATE,
    @notes NVARCHAR(MAX),
    @encryptionPass NVARCHAR(255) = NULL
AS
BEGIN
    -- Verificar que no exista otro activo con el mismo número de serie
    IF EXISTS (SELECT 1 FROM AssetDetails WHERE serialNumber = @serialNumber AND serialNumber IS NOT NULL)
    BEGIN
        RAISERROR('Ya existe un activo con el mismo número de serie', 16, 1);
        RETURN;
    END

    -- Verificar que el producto exista y sea de tipo 'asset'
    IF NOT EXISTS (SELECT 1 FROM Products WHERE id = @productId AND type = 'asset')
    BEGIN
        RAISERROR('El producto no existe o no es un activo', 16, 1);
        RETURN;
    END

    BEGIN TRANSACTION;
    
    -- Insertar detalle de activo
    INSERT INTO AssetDetails (productId, serialNumber, assetTag, purchaseDate, warrantyExpiration, notes, encryptionPass)
    VALUES (@productId, @serialNumber, @assetTag, @purchaseDate, @warrantyExpiration, @notes, @encryptionPass);
    
    DECLARE @assetDetailId INT = SCOPE_IDENTITY();
    
    -- Actualizar stock del producto
    UPDATE Products
    SET currentStock = currentStock + 1,
        updatedAt = GETDATE()
    WHERE id = @productId;
    
    COMMIT;
    
    SELECT @assetDetailId AS id;
END
GO

-- Actualizar detalle de activo
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateAssetDetail')
    DROP PROCEDURE sp_UpdateAssetDetail;
GO

CREATE PROCEDURE sp_UpdateAssetDetail
    @assetDetailId INT,
    @serialNumber NVARCHAR(100),
    @assetTag NVARCHAR(100),
    @purchaseDate DATE,
    @warrantyExpiration DATE,
    @status NVARCHAR(20),
    @notes NVARCHAR(MAX),
    @encryptionPass NVARCHAR(255) = NULL
AS
BEGIN
    -- Verificar que no exista otro activo con el mismo número de serie
    IF EXISTS (SELECT 1 FROM AssetDetails WHERE serialNumber = @serialNumber AND id != @assetDetailId AND serialNumber IS NOT NULL)
    BEGIN
        RAISERROR('Ya existe un activo con el mismo número de serie', 16, 1);
        RETURN;
    END

    UPDATE AssetDetails
    SET serialNumber = @serialNumber,
        assetTag = @assetTag,
        purchaseDate = @purchaseDate,
        warrantyExpiration = @warrantyExpiration,
        status = @status,
        notes = @notes,
        encryptionPass = @encryptionPass,
        updatedAt = GETDATE()
    WHERE id = @assetDetailId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Actualizar estado de activo
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateAssetStatus')
    DROP PROCEDURE sp_UpdateAssetStatus;
GO

CREATE PROCEDURE sp_UpdateAssetStatus
    @assetDetailId INT,
    @status NVARCHAR(20)
AS
BEGIN
    UPDATE AssetDetails
    SET status = @status,
        updatedAt = GETDATE()
    WHERE id = @assetDetailId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Búsqueda de activos
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_SearchAssets')
    DROP PROCEDURE sp_SearchAssets;
GO

CREATE PROCEDURE sp_SearchAssets
    @searchTerm NVARCHAR(100)
AS
BEGIN
    SELECT a.id, a.productId, p.name AS productName, p.model, p.brand, c.name AS categoryName,
           a.serialNumber, a.assetTag, a.purchaseDate, a.warrantyExpiration, a.status, a.notes, 
           a.encryptionPass, a.createdAt, a.updatedAt
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    LEFT JOIN Categories c ON p.categoryId = c.id
    WHERE (p.name LIKE '%' + @searchTerm + '%'
           OR p.model LIKE '%' + @searchTerm + '%'
           OR p.brand LIKE '%' + @searchTerm + '%'
           OR a.serialNumber LIKE '%' + @searchTerm + '%'
           OR a.assetTag LIKE '%' + @searchTerm + '%')
    ORDER BY p.name, a.assetTag, a.serialNumber;
END
GO

-- Obtener laptops y celulares disponibles (para formulario de asignación)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAssignableAssets')
    DROP PROCEDURE sp_GetAssignableAssets;
GO

CREATE PROCEDURE sp_GetAssignableAssets
AS
BEGIN
    SELECT a.id, a.productId, p.name AS productName, p.model, p.brand, c.name AS categoryName,
           a.serialNumber, a.assetTag, a.status, a.encryptionPass
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    JOIN Categories c ON p.categoryId = c.id
    WHERE a.status = 'available'
      AND (c.name = 'Notebooks' OR c.name = 'Celulares' 
           OR c.name LIKE '%Notebook%' OR c.name LIKE '%Celular%'
           OR c.name LIKE '%Laptop%' OR c.name LIKE '%Mobile%')
    ORDER BY c.name, p.name, a.assetTag;
END
GO
