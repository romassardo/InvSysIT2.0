-- Procedimientos almacenados para movimientos de inventario
USE InvSysIT;
GO

-- Registrar entrada de inventario
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_RegisterInventoryEntry')
    DROP PROCEDURE sp_RegisterInventoryEntry;
GO

CREATE PROCEDURE sp_RegisterInventoryEntry
    @productId INT,
    @quantity INT,
    @sourceId INT = NULL,
    @notes NVARCHAR(MAX) = NULL,
    @createdBy INT
AS
BEGIN
    DECLARE @productName NVARCHAR(100);
    
    -- Obtener el nombre del producto
    SELECT @productName = name FROM Products WHERE id = @productId;
    
    -- Verificar que el producto exista
    IF @productName IS NULL
    BEGIN
        RAISERROR('El producto no existe', 16, 1);
        RETURN;
    END

    BEGIN TRANSACTION;
    
    -- Registrar movimiento
    INSERT INTO InventoryMovements (type, productId, quantity, sourceId, notes, createdBy)
    VALUES ('entry', @productId, @quantity, @sourceId, @notes, @createdBy);
    
    DECLARE @movementId INT = SCOPE_IDENTITY();
    
    -- Actualizar stock
    UPDATE Products
    SET currentStock = currentStock + @quantity,
        updatedAt = GETDATE()
    WHERE id = @productId;
    
    -- Crear notificación para administradores
    INSERT INTO Notifications (userId, message, type, relatedItemId, relatedItemType)
    SELECT id, 'Nueva entrada de ' + CAST(@quantity AS NVARCHAR) + ' unidades de ' + @productName, 'info', @movementId, 'inventory_movement'
    FROM Users
    WHERE role = 'admin' AND active = 1;
    
    COMMIT;
    
    SELECT @movementId AS id;
END
GO

-- Registrar salida de inventario (para InventoryOutForm - todos los ítems excepto notebooks y celulares)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_RegisterInventoryOut')
    DROP PROCEDURE sp_RegisterInventoryOut;
GO

CREATE PROCEDURE sp_RegisterInventoryOut
    @productId INT,
    @quantity INT,
    @destinationDepartmentId INT = NULL,
    @destinationBranchId INT = NULL,
    @notes NVARCHAR(MAX) = NULL,
    @createdBy INT
AS
BEGIN
    DECLARE @productName NVARCHAR(100);
    DECLARE @currentStock INT;
    DECLARE @destinationName NVARCHAR(100);
    
    -- Obtener información del producto
    SELECT @productName = name, @currentStock = currentStock
    FROM Products WHERE id = @productId;
    
    -- Verificar que el producto exista
    IF @productName IS NULL
    BEGIN
        RAISERROR('El producto no existe', 16, 1);
        RETURN;
    END
    
    -- Verificar stock suficiente
    IF @currentStock < @quantity
    BEGIN
        RAISERROR('No hay suficiente stock disponible', 16, 1);
        RETURN;
    END
    
    -- Verificar que se especifique un destino
    IF @destinationDepartmentId IS NULL AND @destinationBranchId IS NULL
    BEGIN
        RAISERROR('Debe especificar un departamento o sucursal de destino', 16, 1);
        RETURN;
    END
    
    -- Obtener nombre del destino
    IF @destinationDepartmentId IS NOT NULL
        SELECT @destinationName = name FROM Departments WHERE id = @destinationDepartmentId;
    ELSE
        SELECT @destinationName = name FROM Branches WHERE id = @destinationBranchId;
    
    BEGIN TRANSACTION;
    
    -- Registrar movimiento
    INSERT INTO InventoryMovements (
        type, productId, quantity, destinationDepartmentId, 
        destinationBranchId, notes, createdBy
    )
    VALUES (
        'exit', @productId, @quantity, @destinationDepartmentId, 
        @destinationBranchId, @notes, @createdBy
    );
    
    DECLARE @movementId INT = SCOPE_IDENTITY();
    
    -- Actualizar stock
    UPDATE Products
    SET currentStock = currentStock - @quantity,
        updatedAt = GETDATE()
    WHERE id = @productId;
    
    -- Crear notificación para administradores
    INSERT INTO Notifications (userId, message, type, relatedItemId, relatedItemType)
    SELECT id, 'Salida de ' + CAST(@quantity AS NVARCHAR) + ' unidades de ' + @productName + ' a ' + @destinationName, 
           'info', @movementId, 'inventory_movement'
    FROM Users
    WHERE role = 'admin' AND active = 1;
    
    -- Verificar si el stock es menor que el mínimo y notificar
    IF ((SELECT currentStock FROM Products WHERE id = @productId) < 
        (SELECT minimumStock FROM Products WHERE id = @productId))
    BEGIN
        INSERT INTO Notifications (userId, message, type, relatedItemId, relatedItemType)
        SELECT id, 'Stock por debajo del mínimo para ' + @productName, 'warning', @productId, 'product'
        FROM Users
        WHERE role = 'admin' AND active = 1;
    END
    
    COMMIT;
    
    SELECT @movementId AS id;
END
GO

-- Registrar asignación de equipo (para AssignForm - notebooks y celulares)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_RegisterAssetAssignment')
    DROP PROCEDURE sp_RegisterAssetAssignment;
GO

CREATE PROCEDURE sp_RegisterAssetAssignment
    @assetDetailId INT,
    @assignedUserId INT,
    @notes NVARCHAR(MAX) = NULL,
    @encryptionPass NVARCHAR(255) = NULL,
    @createdBy INT
AS
BEGIN
    DECLARE @productId INT;
    DECLARE @productName NVARCHAR(100);
    DECLARE @userFullName NVARCHAR(100);
    DECLARE @departmentId INT;
    
    -- Obtener información del activo
    SELECT @productId = a.productId, @productName = p.name
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    WHERE a.id = @assetDetailId;
    
    -- Verificar que el activo exista
    IF @productId IS NULL
    BEGIN
        RAISERROR('El activo no existe', 16, 1);
        RETURN;
    END
    
    -- Verificar que el activo esté disponible
    IF NOT EXISTS (SELECT 1 FROM AssetDetails WHERE id = @assetDetailId AND status = 'available')
    BEGIN
        RAISERROR('El activo no está disponible para asignación', 16, 1);
        RETURN;
    END
    
    -- Obtener información del usuario asignado
    SELECT @userFullName = name, @departmentId = departmentId
    FROM Users
    WHERE id = @assignedUserId;
    
    -- Verificar que el usuario exista
    IF @userFullName IS NULL
    BEGIN
        RAISERROR('El usuario asignado no existe', 16, 1);
        RETURN;
    END
    
    BEGIN TRANSACTION;
    
    -- Actualizar el estado del activo y encryption pass si se proporciona
    UPDATE AssetDetails
    SET status = 'assigned',
        encryptionPass = ISNULL(@encryptionPass, encryptionPass),
        updatedAt = GETDATE()
    WHERE id = @assetDetailId;
    
    -- Registrar el movimiento de asignación
    INSERT INTO InventoryMovements (
        type, productId, assetDetailId, quantity, 
        destinationDepartmentId, assignedUserId, notes, createdBy
    )
    VALUES (
        'assignment', @productId, @assetDetailId, 1, 
        @departmentId, @assignedUserId, @notes, @createdBy
    );
    
    DECLARE @movementId INT = SCOPE_IDENTITY();
    
    -- Crear notificación para administradores
    INSERT INTO Notifications (userId, message, type, relatedItemId, relatedItemType)
    SELECT id, 'Se asignó ' + @productName + ' a ' + @userFullName, 
           'success', @movementId, 'inventory_movement'
    FROM Users
    WHERE role = 'admin' AND active = 1;
    
    -- Crear notificación para el usuario asignado
    INSERT INTO Notifications (userId, message, type, relatedItemId, relatedItemType)
    VALUES (@assignedUserId, 'Se te ha asignado un ' + @productName, 'info', @movementId, 'inventory_movement');
    
    COMMIT;
    
    SELECT @movementId AS id;
END
GO

-- Obtener historial de movimientos
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetInventoryMovements')
    DROP PROCEDURE sp_GetInventoryMovements;
GO

CREATE PROCEDURE sp_GetInventoryMovements
AS
BEGIN
    SELECT m.id, m.type, m.productId, p.name AS productName, p.type AS productType, 
           m.assetDetailId, a.serialNumber, a.assetTag,
           m.quantity, m.sourceId, m.destinationDepartmentId, d.name AS departmentName,
           m.destinationBranchId, b.name AS branchName, m.assignedUserId, u.name AS assignedUserName,
           m.movementDate, m.notes, m.createdBy, cu.name AS createdByName, 
           m.createdAt, m.updatedAt
    FROM InventoryMovements m
    JOIN Products p ON m.productId = p.id
    LEFT JOIN AssetDetails a ON m.assetDetailId = a.id
    LEFT JOIN Departments d ON m.destinationDepartmentId = d.id
    LEFT JOIN Branches b ON m.destinationBranchId = b.id
    LEFT JOIN Users u ON m.assignedUserId = u.id
    LEFT JOIN Users cu ON m.createdBy = cu.id
    ORDER BY m.movementDate DESC;
END
GO

-- Obtener movimientos por tipo
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetMovementsByType')
    DROP PROCEDURE sp_GetMovementsByType;
GO

CREATE PROCEDURE sp_GetMovementsByType
    @type NVARCHAR(20)
AS
BEGIN
    SELECT m.id, m.type, m.productId, p.name AS productName, p.type AS productType, 
           m.assetDetailId, a.serialNumber, a.assetTag,
           m.quantity, m.sourceId, m.destinationDepartmentId, d.name AS departmentName,
           m.destinationBranchId, b.name AS branchName, m.assignedUserId, u.name AS assignedUserName,
           m.movementDate, m.notes, m.createdBy, cu.name AS createdByName, 
           m.createdAt, m.updatedAt
    FROM InventoryMovements m
    JOIN Products p ON m.productId = p.id
    LEFT JOIN AssetDetails a ON m.assetDetailId = a.id
    LEFT JOIN Departments d ON m.destinationDepartmentId = d.id
    LEFT JOIN Branches b ON m.destinationBranchId = b.id
    LEFT JOIN Users u ON m.assignedUserId = u.id
    LEFT JOIN Users cu ON m.createdBy = cu.id
    WHERE m.type = @type
    ORDER BY m.movementDate DESC;
END
GO

-- Obtener movimientos por producto
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetMovementsByProduct')
    DROP PROCEDURE sp_GetMovementsByProduct;
GO

CREATE PROCEDURE sp_GetMovementsByProduct
    @productId INT
AS
BEGIN
    SELECT m.id, m.type, m.productId, p.name AS productName, p.type AS productType, 
           m.assetDetailId, a.serialNumber, a.assetTag,
           m.quantity, m.sourceId, m.destinationDepartmentId, d.name AS departmentName,
           m.destinationBranchId, b.name AS branchName, m.assignedUserId, u.name AS assignedUserName,
           m.movementDate, m.notes, m.createdBy, cu.name AS createdByName, 
           m.createdAt, m.updatedAt
    FROM InventoryMovements m
    JOIN Products p ON m.productId = p.id
    LEFT JOIN AssetDetails a ON m.assetDetailId = a.id
    LEFT JOIN Departments d ON m.destinationDepartmentId = d.id
    LEFT JOIN Branches b ON m.destinationBranchId = b.id
    LEFT JOIN Users u ON m.assignedUserId = u.id
    LEFT JOIN Users cu ON m.createdBy = cu.id
    WHERE m.productId = @productId
    ORDER BY m.movementDate DESC;
END
GO

-- Obtener movimientos por activo
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetMovementsByAsset')
    DROP PROCEDURE sp_GetMovementsByAsset;
GO

CREATE PROCEDURE sp_GetMovementsByAsset
    @assetDetailId INT
AS
BEGIN
    SELECT m.id, m.type, m.productId, p.name AS productName, p.type AS productType, 
           m.assetDetailId, a.serialNumber, a.assetTag,
           m.quantity, m.sourceId, m.destinationDepartmentId, d.name AS departmentName,
           m.destinationBranchId, b.name AS branchName, m.assignedUserId, u.name AS assignedUserName,
           m.movementDate, m.notes, m.createdBy, cu.name AS createdByName, 
           m.createdAt, m.updatedAt
    FROM InventoryMovements m
    JOIN Products p ON m.productId = p.id
    LEFT JOIN AssetDetails a ON m.assetDetailId = a.id
    LEFT JOIN Departments d ON m.destinationDepartmentId = d.id
    LEFT JOIN Branches b ON m.destinationBranchId = b.id
    LEFT JOIN Users u ON m.assignedUserId = u.id
    LEFT JOIN Users cu ON m.createdBy = cu.id
    WHERE m.assetDetailId = @assetDetailId
    ORDER BY m.movementDate DESC;
END
GO

-- Obtener movimientos por usuario asignado
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetMovementsByAssignedUser')
    DROP PROCEDURE sp_GetMovementsByAssignedUser;
GO

CREATE PROCEDURE sp_GetMovementsByAssignedUser
    @userId INT
AS
BEGIN
    SELECT m.id, m.type, m.productId, p.name AS productName, p.type AS productType, 
           m.assetDetailId, a.serialNumber, a.assetTag,
           m.quantity, m.sourceId, m.destinationDepartmentId, d.name AS departmentName,
           m.destinationBranchId, b.name AS branchName, m.assignedUserId, u.name AS assignedUserName,
           m.movementDate, m.notes, m.createdBy, cu.name AS createdByName, 
           m.createdAt, m.updatedAt
    FROM InventoryMovements m
    JOIN Products p ON m.productId = p.id
    LEFT JOIN AssetDetails a ON m.assetDetailId = a.id
    LEFT JOIN Departments d ON m.destinationDepartmentId = d.id
    LEFT JOIN Branches b ON m.destinationBranchId = b.id
    LEFT JOIN Users u ON m.assignedUserId = u.id
    LEFT JOIN Users cu ON m.createdBy = cu.id
    WHERE m.assignedUserId = @userId
    ORDER BY m.movementDate DESC;
END
GO

-- Obtener activos asignados a un usuario
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAssignedAssetsByUser')
    DROP PROCEDURE sp_GetAssignedAssetsByUser;
GO

CREATE PROCEDURE sp_GetAssignedAssetsByUser
    @userId INT
AS
BEGIN
    SELECT a.id, a.productId, p.name AS productName, p.model, p.brand, 
           c.name AS categoryName, a.serialNumber, a.assetTag, 
           a.purchaseDate, a.warrantyExpiration, a.status, a.notes, 
           a.encryptionPass, m.movementDate AS assignmentDate, 
           m.id AS movementId, m.notes AS assignmentNotes
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    JOIN Categories c ON p.categoryId = c.id
    JOIN (
        -- Subquery para obtener el último movimiento de asignación para cada activo
        SELECT assetDetailId, MAX(id) AS maxMovementId
        FROM InventoryMovements
        WHERE type = 'assignment' AND assignedUserId = @userId
        GROUP BY assetDetailId
    ) lastMovement ON a.id = lastMovement.assetDetailId
    JOIN InventoryMovements m ON lastMovement.maxMovementId = m.id
    WHERE a.status = 'assigned'
    ORDER BY m.movementDate DESC;
END
GO
