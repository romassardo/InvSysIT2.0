-- Procedimientos almacenados para notificaciones
USE InvSysIT;
GO

-- Obtener notificaciones no leídas para un usuario
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetUnreadNotificationsByUser')
    DROP PROCEDURE sp_GetUnreadNotificationsByUser;
GO

CREATE PROCEDURE sp_GetUnreadNotificationsByUser
    @userId INT
AS
BEGIN
    SELECT id, userId, message, type, isRead, relatedItemId, relatedItemType, createdAt
    FROM Notifications
    WHERE userId = @userId AND isRead = 0
    ORDER BY createdAt DESC;
END
GO

-- Obtener todas las notificaciones para un usuario
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllNotificationsByUser')
    DROP PROCEDURE sp_GetAllNotificationsByUser;
GO

CREATE PROCEDURE sp_GetAllNotificationsByUser
    @userId INT
AS
BEGIN
    SELECT id, userId, message, type, isRead, relatedItemId, relatedItemType, createdAt
    FROM Notifications
    WHERE userId = @userId
    ORDER BY createdAt DESC;
END
GO

-- Marcar una notificación como leída
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_MarkNotificationAsRead')
    DROP PROCEDURE sp_MarkNotificationAsRead;
GO

CREATE PROCEDURE sp_MarkNotificationAsRead
    @notificationId INT
AS
BEGIN
    UPDATE Notifications
    SET isRead = 1
    WHERE id = @notificationId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Marcar todas las notificaciones de un usuario como leídas
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_MarkAllNotificationsAsRead')
    DROP PROCEDURE sp_MarkAllNotificationsAsRead;
GO

CREATE PROCEDURE sp_MarkAllNotificationsAsRead
    @userId INT
AS
BEGIN
    UPDATE Notifications
    SET isRead = 1
    WHERE userId = @userId AND isRead = 0;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Crear una notificación
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateNotification')
    DROP PROCEDURE sp_CreateNotification;
GO

CREATE PROCEDURE sp_CreateNotification
    @userId INT,
    @message NVARCHAR(255),
    @type NVARCHAR(20),
    @relatedItemId INT = NULL,
    @relatedItemType NVARCHAR(50) = NULL
AS
BEGIN
    INSERT INTO Notifications (userId, message, type, relatedItemId, relatedItemType)
    VALUES (@userId, @message, @type, @relatedItemId, @relatedItemType);
    
    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- Eliminar notificaciones leídas y antiguas
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CleanupOldNotifications')
    DROP PROCEDURE sp_CleanupOldNotifications;
GO

CREATE PROCEDURE sp_CleanupOldNotifications
    @daysToKeep INT = 30
AS
BEGIN
    DELETE FROM Notifications
    WHERE isRead = 1 AND createdAt < DATEADD(DAY, -@daysToKeep, GETDATE());
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Contar notificaciones no leídas para un usuario
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CountUnreadNotifications')
    DROP PROCEDURE sp_CountUnreadNotifications;
GO

CREATE PROCEDURE sp_CountUnreadNotifications
    @userId INT
AS
BEGIN
    SELECT COUNT(*) AS unreadCount
    FROM Notifications
    WHERE userId = @userId AND isRead = 0;
END
GO
