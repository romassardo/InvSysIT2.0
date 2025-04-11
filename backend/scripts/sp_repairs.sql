-- Procedimientos almacenados para la gestión de reparaciones

USE InvSysIT;
GO

-- Procedimiento para registrar el envío de un activo a reparación
CREATE OR ALTER PROCEDURE sp_RegisterRepairSend
    @assetDetailId INT,
    @repairProvider NVARCHAR(100),
    @issueDescription NVARCHAR(500),
    @sentDate DATETIME,
    @sentBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar que el activo existe
    IF NOT EXISTS (SELECT 1 FROM AssetDetails WHERE Id = @assetDetailId)
    BEGIN
        THROW 50001, 'El activo no existe', 1;
    END
    
    -- Verificar que el activo no esté ya en reparación
    IF EXISTS (SELECT 1 FROM Repairs WHERE AssetDetailId = @assetDetailId AND ReturnDate IS NULL)
    BEGIN
        THROW 50002, 'Este activo ya está en reparación', 1;
    END
    
    -- Verificar que el activo no esté dado de baja
    IF EXISTS (SELECT 1 FROM AssetDetails WHERE Id = @assetDetailId AND Status = 'disposed')
    BEGIN
        THROW 50003, 'Este activo está dado de baja y no puede enviarse a reparación', 1;
    END
    
    -- Insertar registro de reparación
    INSERT INTO Repairs (
        AssetDetailId,
        RepairProvider,
        IssueDescription,
        SentDate,
        SentBy,
        RepairStatus
    )
    VALUES (
        @assetDetailId,
        @repairProvider,
        @issueDescription,
        @sentDate,
        @sentBy,
        'pending' -- Estado pendiente por defecto
    );
    
    -- Actualizar estado del activo
    UPDATE AssetDetails
    SET Status = 'in_repair',
        UpdatedAt = GETDATE()
    WHERE Id = @assetDetailId;
    
    -- Registrar movimiento en el historial
    INSERT INTO InventoryMovements (
        assetDetailId,
        type,
        quantity,
        notes,
        createdBy,
        createdAt
    )
    VALUES (
        @assetDetailId,
        'repair_send',
        1,
        'Envío a reparación: ' + @repairProvider + ' - ' + @issueDescription,
        @sentBy,
        @sentDate
    );
    
    -- Crear notificación para administradores
    -- Buscar usuarios administradores
    DECLARE @adminUserIds TABLE (id INT);
    INSERT INTO @adminUserIds
    SELECT id FROM Users WHERE role = 'admin';
    
    -- Crear notificación para cada administrador
    INSERT INTO Notifications (
        userId,
        message,
        type,
        relatedItemId,
        relatedItemType,
        isRead,
        createdAt
    )
    SELECT 
        id,
        'Activo enviado a reparación con ' + @repairProvider,
        'info',
        @assetDetailId,
        'asset',
        0,
        GETDATE()
    FROM @adminUserIds;
    
    -- Retornar el ID de la reparación creada
    SELECT SCOPE_IDENTITY() AS RepairId;
END;
GO

-- Procedimiento para registrar el retorno de un activo de reparación
CREATE OR ALTER PROCEDURE sp_RegisterRepairReturn
    @repairId INT,
    @returnDate DATETIME,
    @wasRepaired BIT,
    @repairDescription NVARCHAR(500) = NULL,
    @disposalReason NVARCHAR(500) = NULL,
    @registeredBy INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @assetDetailId INT;
    DECLARE @assetName NVARCHAR(100);
    
    -- Verificar que la reparación existe
    IF NOT EXISTS (SELECT 1 FROM Repairs WHERE Id = @repairId)
    BEGIN
        THROW 50001, 'La reparación no existe', 1;
    END
    
    -- Verificar que la reparación no ha sido retornada
    IF EXISTS (SELECT 1 FROM Repairs WHERE Id = @repairId AND ReturnDate IS NOT NULL)
    BEGIN
        THROW 50002, 'Esta reparación ya ha sido retornada', 1;
    END
    
    -- Obtener el ID del activo
    SELECT @assetDetailId = AssetDetailId FROM Repairs WHERE Id = @repairId;
    
    -- Obtener nombre del activo para notificaciones
    SELECT @assetName = P.Name + ' ' + P.Model
    FROM AssetDetails AD
    JOIN Products P ON AD.ProductId = P.Id
    WHERE AD.Id = @assetDetailId;
    
    BEGIN TRANSACTION;
    
    -- Actualizar registro de reparación
    UPDATE Repairs
    SET ReturnDate = @returnDate,
        WasRepaired = @wasRepaired,
        RepairDescription = @repairDescription,
        DisposalReason = @disposalReason,
        RepairStatus = CASE 
                          WHEN @wasRepaired = 1 THEN 'completed'
                          ELSE 'disposed'
                       END,
        UpdatedAt = GETDATE()
    WHERE Id = @repairId;
    
    -- Actualizar estado del activo según el resultado
    IF @wasRepaired = 1
    BEGIN
        -- Si fue reparado, vuelve a estar disponible
        UPDATE AssetDetails
        SET Status = 'available',
            UpdatedAt = GETDATE()
        WHERE Id = @assetDetailId;
        
        -- Registrar movimiento en el historial
        INSERT INTO InventoryMovements (
            assetDetailId,
            type,
            quantity,
            notes,
            createdBy,
            createdAt
        )
        VALUES (
            @assetDetailId,
            'repair_return',
            1,
            'Retorno de reparación: ' + @repairDescription,
            @registeredBy,
            @returnDate
        );
        
        -- Crear notificación para administradores
        INSERT INTO Notifications (
            userId,
            message,
            type,
            relatedItemId,
            relatedItemType,
            isRead,
            createdAt
        )
        SELECT 
            id,
            'El activo ' + @assetName + ' ha sido reparado y está disponible nuevamente',
            'success',
            @assetDetailId,
            'asset',
            0,
            GETDATE()
        FROM Users WHERE role = 'admin';
    END
    ELSE
    BEGIN
        -- Si no fue reparado, se da de baja
        UPDATE AssetDetails
        SET Status = 'disposed',
            UpdatedAt = GETDATE()
        WHERE Id = @assetDetailId;
        
        -- Registrar movimiento en el historial
        INSERT INTO InventoryMovements (
            assetDetailId,
            type,
            quantity,
            notes,
            createdBy,
            createdAt
        )
        VALUES (
            @assetDetailId,
            'disposal',
            1,
            'Baja por irreparable: ' + @disposalReason,
            @registeredBy,
            @returnDate
        );
        
        -- Crear notificación para administradores
        INSERT INTO Notifications (
            userId,
            message,
            type,
            relatedItemId,
            relatedItemType,
            isRead,
            createdAt
        )
        SELECT 
            id,
            'El activo ' + @assetName + ' ha sido dado de baja por: ' + @disposalReason,
            'warning',
            @assetDetailId,
            'asset',
            0,
            GETDATE()
        FROM Users WHERE role = 'admin';
    END
    
    COMMIT;
    
    -- Retornar los datos actualizados
    SELECT 
        R.Id,
        R.AssetDetailId,
        P.Name + ' ' + P.Model AS AssetName,
        R.RepairProvider,
        R.IssueDescription,
        R.SentDate,
        U1.Name AS SentByName,
        R.ReturnDate,
        R.WasRepaired,
        R.RepairDescription,
        R.DisposalReason,
        R.RepairStatus
    FROM Repairs R
    JOIN AssetDetails AD ON R.AssetDetailId = AD.Id
    JOIN Products P ON AD.ProductId = P.Id
    JOIN Users U1 ON R.SentBy = U1.Id
    WHERE R.Id = @repairId;
    
END;
GO

-- Procedimiento para obtener todas las reparaciones
CREATE OR ALTER PROCEDURE sp_GetAllRepairs
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        R.Id,
        R.AssetDetailId,
        P.Name + ' ' + P.Model AS AssetName,
        AD.SerialNumber,
        R.RepairProvider,
        R.IssueDescription,
        R.SentDate,
        U1.Name AS SentByName,
        R.ReturnDate,
        R.WasRepaired,
        R.RepairDescription,
        R.DisposalReason,
        R.RepairStatus,
        CASE 
            WHEN R.RepairStatus = 'pending' THEN DATEDIFF(day, R.SentDate, GETDATE())
            ELSE DATEDIFF(day, R.SentDate, R.ReturnDate)
        END AS DaysInRepair
    FROM Repairs R
    JOIN AssetDetails AD ON R.AssetDetailId = AD.Id
    JOIN Products P ON AD.ProductId = P.Id
    JOIN Users U1 ON R.SentBy = U1.Id
    ORDER BY 
        CASE WHEN R.RepairStatus = 'pending' THEN 0 ELSE 1 END,
        R.SentDate DESC;
END;
GO

-- Procedimiento para obtener reparaciones por estado
CREATE OR ALTER PROCEDURE sp_GetRepairsByStatus
    @status NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        R.Id,
        R.AssetDetailId,
        P.Name + ' ' + P.Model AS AssetName,
        AD.SerialNumber,
        R.RepairProvider,
        R.IssueDescription,
        R.SentDate,
        U1.Name AS SentByName,
        R.ReturnDate,
        R.WasRepaired,
        R.RepairDescription,
        R.DisposalReason,
        R.RepairStatus,
        CASE 
            WHEN R.RepairStatus = 'pending' THEN DATEDIFF(day, R.SentDate, GETDATE())
            ELSE DATEDIFF(day, R.SentDate, R.ReturnDate)
        END AS DaysInRepair
    FROM Repairs R
    JOIN AssetDetails AD ON R.AssetDetailId = AD.Id
    JOIN Products P ON AD.ProductId = P.Id
    JOIN Users U1 ON R.SentBy = U1.Id
    WHERE R.RepairStatus = @status
    ORDER BY R.SentDate DESC;
END;
GO

-- Procedimiento para obtener historial de reparaciones de un activo
CREATE OR ALTER PROCEDURE sp_GetRepairHistoryByAsset
    @assetDetailId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        R.Id,
        R.AssetDetailId,
        P.Name + ' ' + P.Model AS AssetName,
        AD.SerialNumber,
        R.RepairProvider,
        R.IssueDescription,
        R.SentDate,
        U1.Name AS SentByName,
        R.ReturnDate,
        CASE WHEN R.ReturnDate IS NOT NULL THEN U2.Name ELSE NULL END AS ReturnedByName,
        R.WasRepaired,
        R.RepairDescription,
        R.DisposalReason,
        R.RepairStatus,
        CASE 
            WHEN R.RepairStatus = 'pending' THEN DATEDIFF(day, R.SentDate, GETDATE())
            ELSE DATEDIFF(day, R.SentDate, R.ReturnDate)
        END AS DaysInRepair
    FROM Repairs R
    JOIN AssetDetails AD ON R.AssetDetailId = AD.Id
    JOIN Products P ON AD.ProductId = P.Id
    JOIN Users U1 ON R.SentBy = U1.Id
    LEFT JOIN Users U2 ON U2.Id = @assetDetailId
    WHERE R.AssetDetailId = @assetDetailId
    ORDER BY R.SentDate DESC;
END;
GO
