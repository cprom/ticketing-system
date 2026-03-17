import sql from 'mssql';
import 'dotenv/config';

const masterConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: 'master',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const dbConfig = {
  ...masterConfig,
  database: 'TicketingSystemA'
};

async function init() {
  try {
    console.log('Connecting to SQL Server...');
    const masterPool = await sql.connect(masterConfig);

    // Create DB if not exists
    await masterPool.request().query(`
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TicketingSystemA')
      BEGIN
        CREATE DATABASE [TicketingSystemA];
      END
    `);

    console.log('Database ready.');

    const pool = await sql.connect(dbConfig);

    // Create tables
    await pool.request().query(`
      USE [TicketingSystemA]
      IF OBJECT_ID('Roles') IS NULL
      CREATE TABLE Roles (
        RoleID INT IDENTITY PRIMARY KEY,
        RoleName VARCHAR(50) NOT NULL UNIQUE
      );

      IF OBJECT_ID('Department') IS NULL
      CREATE TABLE Department (
        DepartmentID INT IDENTITY PRIMARY KEY,
        DepartmentName VARCHAR(100) NOT NULL UNIQUE,
      );

      IF OBJECT_ID('Users') IS NULL
      CREATE TABLE Users (
        UserID INT IDENTITY PRIMARY KEY,
        FullName VARCHAR(100) NOT NULL,
        FirstName VARCHAR(100) NOT NULL,
        LastName VARCHAR(100) NOT NULL,
        Email VARCHAR(150) NOT NULL UNIQUE,
        PasswordHash VARCHAR(255) NOT NULL,
        RoleID INT NOT NULL,
        JobTitle VARCHAR(100),
        DepartmentID INT,
        PhoneNumber VARCHAR(20),
        Address VARCHAR(500),
        ProfileImg VARCHAR(200),
        ManagerID INT,
        IsActive BIT NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
        FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
      );

      IF OBJECT_ID('TicketStatus') IS NULL
      CREATE TABLE TicketStatus (
        StatusID INT IDENTITY PRIMARY KEY,
        StatusName VARCHAR(50) NOT NULL UNIQUE
      );

      IF OBJECT_ID('TicketPriority') IS NULL
      CREATE TABLE TicketPriority (
        PriorityID INT IDENTITY PRIMARY KEY,
        PriorityName VARCHAR(50) NOT NULL UNIQUE
      );

      IF OBJECT_ID('Categories') IS NULL
      CREATE TABLE Categories (
        CategoryID INT IDENTITY PRIMARY KEY,
        CategoryName VARCHAR(100) NOT NULL UNIQUE
      );

      IF OBJECT_ID('Tickets') IS NULL
      CREATE TABLE Tickets (
        TicketID INT IDENTITY PRIMARY KEY,
        Title VARCHAR(200) NOT NULL,
        Description TEXT NOT NULL,
        CreatedBy INT NOT NULL,
        AssignedTo INT NULL,
        StatusID INT NOT NULL,
        PriorityID INT NOT NULL,
        CategoryID INT NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME NULL,
        ClosedAt DATETIME NULL,
        RequesterID INT NOT NULL,
        IsActive BIT NOT NULL,
        FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
        FOREIGN KEY (AssignedTo) REFERENCES Users(UserID),
        FOREIGN KEY (StatusID) REFERENCES TicketStatus(StatusID),
        FOREIGN KEY (PriorityID) REFERENCES TicketPriority(PriorityID),
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
        FOREIGN KEY (RequesterID) REFERENCES Users(UserID)
      );

      IF OBJECT_ID('TicketComments') IS NULL
      CREATE TABLE TicketComments (
        CommentID INT IDENTITY PRIMARY KEY,
        TicketID INT NOT NULL,
        UserID INT NOT NULL,
        Comment TEXT NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (TicketID) REFERENCES Tickets(TicketID),
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
      );

      IF OBJECT_ID('TicketAttachments') IS NULL
      CREATE TABLE TicketAttachments (
        AttachmentID INT IDENTITY PRIMARY KEY,
        TicketID INT NOT NULL,
        FileName VARCHAR(255) NOT NULL,
        FilePath VARCHAR(500) NOT NULL,
        UploadedBy INT NOT NULL,
        UploadedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (TicketID) REFERENCES Tickets(TicketID),
        FOREIGN KEY (UploadedBy) REFERENCES Users(UserID)
      );
    `);

    // Seed data (idempotent)
    await pool.request().query(`
        
      IF NOT EXISTS (SELECT 1 FROM Roles)
        INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Agent'), ('User'), ('Tech');

      IF NOT EXISTS (SELECT 1 FROM Department)
        INSERT INTO Department (DepartmentName) 
        VALUES ('Finance'), ('Marketing'), ('Human Resources'), ('IT'), ('Sales'), ('Executive'), ('Administration'), ('Engineering');

      IF NOT EXISTS (SELECT 1 FROM TicketStatus)
        INSERT INTO TicketStatus (StatusName)
        VALUES ('Open'), ('In Progress'), ('Resolved'), ('Closed');

      IF NOT EXISTS (SELECT 1 FROM TicketPriority)
        INSERT INTO TicketPriority (PriorityName)
        VALUES ('Low'), ('Medium'), ('High'), ('Critical');

      IF NOT EXISTS (SELECT 1 FROM Categories)
        INSERT INTO Categories (CategoryName)
        VALUES ('Hardware'), ('Software'), ('Network'), ('Access'), ('Other');

      IF NOT EXISTS (SELECT 1 FROM Users)
        INSERT INTO Users 
        ( FullName, FirstName, LastName, Email, PasswordHash, RoleID, JobTitle, DepartmentID, PhoneNumber, Address, ProfileImg, IsActive)
        VALUES
        ('System Admin','System', 'Admin', 'admin@tickets.local', 'hashed_password', 1, 'Sys Admin', 1, '555-555-5555', '123 Test Street City CA 90805','image/url/1', 1),

      IF NOT EXISTS (SELECT 1 FROM Tickets)
        INSERT INTO Tickets (Title, Description, CreatedBy, StatusID, PriorityID, CategoryID, RequesterID, IsActive)
        VALUES 
        ('Seeded Ticket 1', 'Ticket seeded by script for testing', 4, 2, 4, 1, 2, 1),
    `);

    console.log('Schema created and data seeded.');
    process.exit(0);
  } catch (err) {
    console.error('Init failed:', err);
    process.exit(1);
  }
}

init();