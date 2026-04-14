-- Crear base de datos (por si no existe)
IF DB_ID('TaskAppDB') IS NULL
BEGIN
    CREATE DATABASE TaskAppDB;
END
GO

USE TaskAppDB;
GO

-- Crear tabla
DROP TABLE IF EXISTS Tasks;
GO

CREATE TABLE Tasks (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Completed BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Stored Procedures

CREATE PROCEDURE GetTasks
AS
BEGIN
    SELECT * FROM Tasks;
END;
GO

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

CREATE PROCEDURE ToggleTask
    @Id INT
AS
BEGIN
    UPDATE Tasks
    SET Completed = CASE 
        WHEN Completed = 1 THEN 0 
        ELSE 1 
    END
    WHERE Id = @Id;

    SELECT * FROM Tasks WHERE Id = @Id;
END;
GO

CREATE PROCEDURE DeleteTask
    @Id INT
AS
BEGIN
    DELETE FROM Tasks
    WHERE Id = @Id;
END;
GO

-- Índice
CREATE INDEX IX_Tasks_Completed ON Tasks(Completed);
GO