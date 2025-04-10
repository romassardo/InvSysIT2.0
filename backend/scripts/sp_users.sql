-- Procedimientos almacenados para usuarios
USE InvSysIT;
GO

-- Obtener usuario por ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetUserById')
    DROP PROCEDURE sp_GetUserById;
GO

CREATE PROCEDURE sp_GetUserById
    @userId INT
AS
BEGIN
    SELECT id, name, email, role, departmentId, active, createdAt, updatedAt
    FROM Users
    WHERE id = @userId;
END
GO

-- Obtener usuario por email
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetUserByEmail')
    DROP PROCEDURE sp_GetUserByEmail;
GO

CREATE PROCEDURE sp_GetUserByEmail
    @email NVARCHAR(100)
AS
BEGIN
    SELECT id, name, email, password, role, departmentId, active, createdAt, updatedAt
    FROM Users
    WHERE email = @email;
END
GO

-- Crear nuevo usuario
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateUser')
    DROP PROCEDURE sp_CreateUser;
GO

CREATE PROCEDURE sp_CreateUser
    @name NVARCHAR(100),
    @email NVARCHAR(100),
    @password NVARCHAR(255),
    @role NVARCHAR(20),
    @departmentId INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
    BEGIN
        RAISERROR('El email ya está registrado', 16, 1);
        RETURN;
    END

    INSERT INTO Users (name, email, password, role, departmentId)
    VALUES (@name, @email, @password, @role, @departmentId);
    
    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- Actualizar usuario
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateUser')
    DROP PROCEDURE sp_UpdateUser;
GO

CREATE PROCEDURE sp_UpdateUser
    @userId INT,
    @name NVARCHAR(100),
    @email NVARCHAR(100),
    @role NVARCHAR(20),
    @departmentId INT,
    @active BIT
AS
BEGIN
    -- Verificar si el email ya existe para otro usuario
    IF EXISTS (SELECT 1 FROM Users WHERE email = @email AND id != @userId)
    BEGIN
        RAISERROR('El email ya está registrado para otro usuario', 16, 1);
        RETURN;
    END

    UPDATE Users
    SET name = @name,
        email = @email,
        role = @role,
        departmentId = @departmentId,
        active = @active,
        updatedAt = GETDATE()
    WHERE id = @userId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Cambiar contraseña
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ChangePassword')
    DROP PROCEDURE sp_ChangePassword;
GO

CREATE PROCEDURE sp_ChangePassword
    @userId INT,
    @newPassword NVARCHAR(255)
AS
BEGIN
    UPDATE Users
    SET password = @newPassword,
        updatedAt = GETDATE()
    WHERE id = @userId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Listar todos los usuarios
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllUsers')
    DROP PROCEDURE sp_GetAllUsers;
GO

CREATE PROCEDURE sp_GetAllUsers
AS
BEGIN
    SELECT u.id, u.name, u.email, u.role, u.departmentId, d.name AS departmentName, u.active, u.createdAt, u.updatedAt
    FROM Users u
    LEFT JOIN Departments d ON u.departmentId = d.id
    ORDER BY u.name;
END
GO

-- Eliminar usuario (marcar como inactivo)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeactivateUser')
    DROP PROCEDURE sp_DeactivateUser;
GO

CREATE PROCEDURE sp_DeactivateUser
    @userId INT
AS
BEGIN
    UPDATE Users
    SET active = 0,
        updatedAt = GETDATE()
    WHERE id = @userId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO
