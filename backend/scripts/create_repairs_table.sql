-- Script para crear la tabla de reparaciones si no existe

USE InvSysIT;
GO

-- Crear tabla de reparaciones
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Repairs')
BEGIN
    CREATE TABLE Repairs (
        Id INT PRIMARY KEY IDENTITY(1,1),
        AssetDetailId INT NOT NULL,
        RepairProvider NVARCHAR(100) NOT NULL,
        IssueDescription NVARCHAR(500) NOT NULL,
        SentDate DATETIME NOT NULL,
        SentBy INT NOT NULL,
        ReturnDate DATETIME NULL,
        WasRepaired BIT NULL,
        RepairDescription NVARCHAR(500) NULL,
        DisposalReason NVARCHAR(500) NULL,
        RepairStatus NVARCHAR(20) NOT NULL DEFAULT('pending'), -- pending, completed, disposed
        CreatedAt DATETIME NOT NULL DEFAULT(GETDATE()),
        UpdatedAt DATETIME NULL,
        FOREIGN KEY (AssetDetailId) REFERENCES AssetDetails(Id),
        FOREIGN KEY (SentBy) REFERENCES Users(Id)
    );

    PRINT 'Tabla Repairs creada correctamente.';
END
ELSE
BEGIN
    PRINT 'La tabla Repairs ya existe.';
END
GO
