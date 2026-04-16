-- Crear base de datos (por si no existe)
IF DB_ID('TaskAppDB') IS NULL
BEGIN
    CREATE DATABASE TaskAppDB;
END
GO

USE TaskAppDB;
GO

-- Eliminar tabla si existe (solo para desarrollo)
DROP TABLE IF EXISTS Tasks;
GO

-- Crear tabla con borrado lógico
CREATE TABLE Tasks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Completed BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    DeletedAt DATETIME NULL
);
GO

-- =====================================
-- Stored Procedures
-- =====================================

-- Obtener solo tareas activas
CREATE PROCEDURE GetTasks
AS
BEGIN
    SELECT *
    FROM Tasks
    WHERE DeletedAt IS NULL;
END;
GO

-- Crear tarea
CREATE PROCEDURE CreateTask
    @Title NVARCHAR(255),
    @Description NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Tasks (Title, Description)
    VALUES (@Title, @Description);

    SELECT SCOPE_IDENTITY() AS Id;
END;
GO

-- Marcar/desmarcar completada (solo si no está eliminada)
CREATE PROCEDURE ToggleTask
    @Id INT
AS
BEGIN
    UPDATE Tasks
    SET Completed = CASE 
        WHEN Completed = 1 THEN 0 
        ELSE 1 
    END
    WHERE Id = @Id
      AND DeletedAt IS NULL;

    SELECT *
    FROM Tasks
    WHERE Id = @Id
      AND DeletedAt IS NULL;
END;
GO

-- Borrado lógico
CREATE PROCEDURE SoftDeleteTask
    @Id INT
AS
BEGIN
    UPDATE Tasks
    SET DeletedAt = GETDATE()
    WHERE Id = @Id
      AND DeletedAt IS NULL;
END;
GO

-- Índice
CREATE INDEX IX_Tasks_Completed ON Tasks(Completed);
GO