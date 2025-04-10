-- Procedimientos almacenados para categorías
USE InvSysIT;
GO

-- Obtener todas las categorías
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetAllCategories')
    DROP PROCEDURE sp_GetAllCategories;
GO

CREATE PROCEDURE sp_GetAllCategories
AS
BEGIN
    SELECT c.id, c.name, c.description, c.parentId, p.name AS parentName, c.active, c.createdAt, c.updatedAt
    FROM Categories c
    LEFT JOIN Categories p ON c.parentId = p.id
    ORDER BY ISNULL(c.parentId, 0), c.name;
END
GO

-- Obtener categoría por ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetCategoryById')
    DROP PROCEDURE sp_GetCategoryById;
GO

CREATE PROCEDURE sp_GetCategoryById
    @categoryId INT
AS
BEGIN
    SELECT c.id, c.name, c.description, c.parentId, p.name AS parentName, c.active, c.createdAt, c.updatedAt
    FROM Categories c
    LEFT JOIN Categories p ON c.parentId = p.id
    WHERE c.id = @categoryId;
END
GO

-- Obtener categorías principales (sin padre)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetMainCategories')
    DROP PROCEDURE sp_GetMainCategories;
GO

CREATE PROCEDURE sp_GetMainCategories
AS
BEGIN
    SELECT id, name, description, parentId, active, createdAt, updatedAt
    FROM Categories
    WHERE parentId IS NULL AND active = 1
    ORDER BY name;
END
GO

-- Obtener subcategorías por ID de categoría padre
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetSubcategoriesByParentId')
    DROP PROCEDURE sp_GetSubcategoriesByParentId;
GO

CREATE PROCEDURE sp_GetSubcategoriesByParentId
    @parentId INT
AS
BEGIN
    SELECT id, name, description, parentId, active, createdAt, updatedAt
    FROM Categories
    WHERE parentId = @parentId AND active = 1
    ORDER BY name;
END
GO

-- Crear nueva categoría
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_CreateCategory')
    DROP PROCEDURE sp_CreateCategory;
GO

CREATE PROCEDURE sp_CreateCategory
    @name NVARCHAR(100),
    @description NVARCHAR(255),
    @parentId INT = NULL
AS
BEGIN
    -- Verificar que no exista otra categoría con el mismo nombre y mismo padre
    IF EXISTS (SELECT 1 FROM Categories WHERE name = @name AND ISNULL(parentId, 0) = ISNULL(@parentId, 0))
    BEGIN
        RAISERROR('Ya existe una categoría con el mismo nombre en este nivel', 16, 1);
        RETURN;
    END

    INSERT INTO Categories (name, description, parentId)
    VALUES (@name, @description, @parentId);
    
    SELECT SCOPE_IDENTITY() AS id;
END
GO

-- Actualizar categoría
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_UpdateCategory')
    DROP PROCEDURE sp_UpdateCategory;
GO

CREATE PROCEDURE sp_UpdateCategory
    @categoryId INT,
    @name NVARCHAR(100),
    @description NVARCHAR(255),
    @parentId INT = NULL,
    @active BIT
AS
BEGIN
    -- Verificar que no exista otra categoría con el mismo nombre y mismo padre
    IF EXISTS (SELECT 1 FROM Categories WHERE name = @name AND ISNULL(parentId, 0) = ISNULL(@parentId, 0) AND id != @categoryId)
    BEGIN
        RAISERROR('Ya existe una categoría con el mismo nombre en este nivel', 16, 1);
        RETURN;
    END

    -- Verificar que no estemos creando un ciclo (una categoría no puede ser su propia subcategoría)
    IF @parentId IS NOT NULL AND @categoryId = @parentId
    BEGIN
        RAISERROR('Una categoría no puede ser su propio padre', 16, 1);
        RETURN;
    END

    -- Verificar que no se esté creando un ciclo más profundo
    DECLARE @currentParentId INT = @parentId;
    WHILE @currentParentId IS NOT NULL
    BEGIN
        IF @currentParentId = @categoryId
        BEGIN
            RAISERROR('No se puede crear un ciclo en la estructura de categorías', 16, 1);
            RETURN;
        END
        
        SELECT @currentParentId = parentId
        FROM Categories
        WHERE id = @currentParentId;
    END

    UPDATE Categories
    SET name = @name,
        description = @description,
        parentId = @parentId,
        active = @active,
        updatedAt = GETDATE()
    WHERE id = @categoryId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Eliminar categoría (marcar como inactiva)
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_DeactivateCategory')
    DROP PROCEDURE sp_DeactivateCategory;
GO

CREATE PROCEDURE sp_DeactivateCategory
    @categoryId INT
AS
BEGIN
    -- Marcar la categoría como inactiva
    UPDATE Categories
    SET active = 0,
        updatedAt = GETDATE()
    WHERE id = @categoryId;
    
    -- Marcar todas las subcategorías como inactivas también
    UPDATE Categories
    SET active = 0,
        updatedAt = GETDATE()
    WHERE parentId = @categoryId;
    
    SELECT @@ROWCOUNT AS rowsAffected;
END
GO

-- Obtener estructura jerárquica de categorías
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetCategoryHierarchy')
    DROP PROCEDURE sp_GetCategoryHierarchy;
GO

CREATE PROCEDURE sp_GetCategoryHierarchy
AS
BEGIN
    WITH CategoryHierarchy AS (
        -- Categorías raíz (sin padre)
        SELECT
            id,
            name,
            description,
            parentId,
            active,
            CAST(name AS NVARCHAR(255)) AS path,
            0 AS level
        FROM
            Categories
        WHERE
            parentId IS NULL
            AND active = 1

        UNION ALL

        -- Unir con subcategorías
        SELECT
            c.id,
            c.name,
            c.description,
            c.parentId,
            c.active,
            CAST(ch.path + ' > ' + c.name AS NVARCHAR(255)) AS path,
            ch.level + 1 AS level
        FROM
            Categories c
        INNER JOIN
            CategoryHierarchy ch ON c.parentId = ch.id
        WHERE
            c.active = 1
    )

    SELECT
        id,
        name,
        description,
        parentId,
        active,
        path,
        level
    FROM
        CategoryHierarchy
    ORDER BY
        path;
END
GO
