-- Procedimientos almacenados para reportes
USE InvSysIT;
GO

-- Reporte de inventario actual
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ReportCurrentInventory')
    DROP PROCEDURE sp_ReportCurrentInventory;
GO

CREATE PROCEDURE sp_ReportCurrentInventory
    @categoryId INT = NULL,
    @type NVARCHAR(20) = NULL,
    @lowStock BIT = NULL -- 1 para solo productos con stock menor al mínimo
AS
BEGIN
    SELECT p.id, p.name, p.description, p.model, p.brand, 
           c.name AS categoryName, c.id AS categoryId,
           p.type, p.currentStock, p.minimumStock,
           CASE WHEN p.currentStock <= p.minimumStock THEN 1 ELSE 0 END AS isLowStock,
           p.active, p.createdAt, p.updatedAt
    FROM Products p
    LEFT JOIN Categories c ON p.categoryId = c.id
    WHERE (@categoryId IS NULL OR p.categoryId = @categoryId)
          AND (@type IS NULL OR p.type = @type)
          AND (@lowStock IS NULL OR (@lowStock = 1 AND p.currentStock <= p.minimumStock) OR (@lowStock = 0))
          AND p.active = 1
    ORDER BY c.name, p.name;
END
GO

-- Reporte de movimientos de inventario
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ReportInventoryMovements')
    DROP PROCEDURE sp_ReportInventoryMovements;
GO

CREATE PROCEDURE sp_ReportInventoryMovements
    @startDate DATETIME = NULL,
    @endDate DATETIME = NULL,
    @movementType NVARCHAR(20) = NULL,
    @productId INT = NULL,
    @departmentId INT = NULL,
    @branchId INT = NULL,
    @userId INT = NULL
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
    WHERE (@startDate IS NULL OR m.movementDate >= @startDate)
          AND (@endDate IS NULL OR m.movementDate <= @endDate)
          AND (@movementType IS NULL OR m.type = @movementType)
          AND (@productId IS NULL OR m.productId = @productId)
          AND (@departmentId IS NULL OR m.destinationDepartmentId = @departmentId)
          AND (@branchId IS NULL OR m.destinationBranchId = @branchId)
          AND (@userId IS NULL OR m.assignedUserId = @userId OR m.createdBy = @userId)
    ORDER BY m.movementDate DESC;
END
GO

-- Reporte de activos asignados
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ReportAssignedAssets')
    DROP PROCEDURE sp_ReportAssignedAssets;
GO

CREATE PROCEDURE sp_ReportAssignedAssets
    @departmentId INT = NULL,
    @categoryId INT = NULL,
    @userId INT = NULL
AS
BEGIN
    SELECT a.id, a.productId, p.name AS productName, p.model, p.brand, 
           c.name AS categoryName, a.serialNumber, a.assetTag, 
           a.purchaseDate, a.warrantyExpiration, a.status, a.notes, 
           a.encryptionPass, u.id AS userId, u.name AS userName, 
           d.id AS departmentId, d.name AS departmentName,
           m.movementDate AS assignmentDate, m.id AS movementId
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    JOIN Categories c ON p.categoryId = c.id
    JOIN (
        -- Subquery para obtener el último movimiento de asignación para cada activo
        SELECT assetDetailId, MAX(id) AS maxMovementId
        FROM InventoryMovements
        WHERE type = 'assignment'
        GROUP BY assetDetailId
    ) lastMovement ON a.id = lastMovement.assetDetailId
    JOIN InventoryMovements m ON lastMovement.maxMovementId = m.id
    JOIN Users u ON m.assignedUserId = u.id
    JOIN Departments d ON u.departmentId = d.id
    WHERE a.status = 'assigned'
          AND (@departmentId IS NULL OR u.departmentId = @departmentId)
          AND (@categoryId IS NULL OR p.categoryId = @categoryId)
          AND (@userId IS NULL OR m.assignedUserId = @userId)
    ORDER BY u.name, p.name;
END
GO

-- Reporte de activos por categoría
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ReportAssetsByCategory')
    DROP PROCEDURE sp_ReportAssetsByCategory;
GO

CREATE PROCEDURE sp_ReportAssetsByCategory
AS
BEGIN
    SELECT c.id AS categoryId, c.name AS categoryName, 
           COUNT(DISTINCT p.id) AS productCount,
           SUM(p.currentStock) AS totalStock,
           SUM(CASE WHEN p.currentStock <= p.minimumStock THEN 1 ELSE 0 END) AS lowStockCount
    FROM Categories c
    LEFT JOIN Products p ON c.id = p.categoryId AND p.active = 1
    WHERE c.active = 1
    GROUP BY c.id, c.name
    ORDER BY c.name;
END
GO

-- Reporte de activos por estado
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ReportAssetsByStatus')
    DROP PROCEDURE sp_ReportAssetsByStatus;
GO

CREATE PROCEDURE sp_ReportAssetsByStatus
AS
BEGIN
    SELECT a.status, COUNT(*) AS assetCount
    FROM AssetDetails a
    GROUP BY a.status
    ORDER BY a.status;
END
GO

-- Reporte de activos por departamento
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ReportAssetsByDepartment')
    DROP PROCEDURE sp_ReportAssetsByDepartment;
GO

CREATE PROCEDURE sp_ReportAssetsByDepartment
AS
BEGIN
    SELECT d.id AS departmentId, d.name AS departmentName, 
           COUNT(DISTINCT a.id) AS assetCount
    FROM Departments d
    LEFT JOIN Users u ON d.id = u.departmentId
    LEFT JOIN InventoryMovements m ON u.id = m.assignedUserId AND m.type = 'assignment'
    LEFT JOIN AssetDetails a ON m.assetDetailId = a.id AND a.status = 'assigned'
    WHERE d.active = 1
    GROUP BY d.id, d.name
    ORDER BY d.name;
END
GO

-- Reporte de consumo por departamento
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ReportConsumptionByDepartment')
    DROP PROCEDURE sp_ReportConsumptionByDepartment;
GO

CREATE PROCEDURE sp_ReportConsumptionByDepartment
    @startDate DATETIME = NULL,
    @endDate DATETIME = NULL
AS
BEGIN
    SELECT d.id AS departmentId, d.name AS departmentName, 
           SUM(m.quantity) AS totalQuantity,
           COUNT(DISTINCT m.id) AS movementCount
    FROM Departments d
    LEFT JOIN InventoryMovements m ON d.id = m.destinationDepartmentId
    WHERE m.type = 'exit'
          AND (@startDate IS NULL OR m.movementDate >= @startDate)
          AND (@endDate IS NULL OR m.movementDate <= @endDate)
    GROUP BY d.id, d.name
    ORDER BY totalQuantity DESC;
END
GO

-- Reporte de garantías próximas a vencer
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ReportWarrantiesExpiringSoon')
    DROP PROCEDURE sp_ReportWarrantiesExpiringSoon;
GO

CREATE PROCEDURE sp_ReportWarrantiesExpiringSoon
    @daysThreshold INT = 90
AS
BEGIN
    SELECT a.id, a.productId, p.name AS productName, p.model, p.brand, 
           c.name AS categoryName, a.serialNumber, a.assetTag, 
           a.purchaseDate, a.warrantyExpiration, a.status, 
           DATEDIFF(DAY, GETDATE(), a.warrantyExpiration) AS daysUntilExpiration,
           u.id AS assignedUserId, u.name AS assignedUserName
    FROM AssetDetails a
    JOIN Products p ON a.productId = p.id
    JOIN Categories c ON p.categoryId = c.id
    LEFT JOIN (
        -- Subquery para obtener el usuario asignado para cada activo
        SELECT assetDetailId, assignedUserId
        FROM InventoryMovements
        WHERE type = 'assignment' AND id IN (
            SELECT MAX(id)
            FROM InventoryMovements
            WHERE type = 'assignment'
            GROUP BY assetDetailId
        )
    ) lastAssignment ON a.id = lastAssignment.assetDetailId
    LEFT JOIN Users u ON lastAssignment.assignedUserId = u.id
    WHERE a.warrantyExpiration IS NOT NULL
          AND a.warrantyExpiration >= GETDATE()
          AND a.warrantyExpiration <= DATEADD(DAY, @daysThreshold, GETDATE())
    ORDER BY a.warrantyExpiration;
END
GO
