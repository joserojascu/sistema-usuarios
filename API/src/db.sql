-- Crear la base de datos "sistema"
CREATE DATABASE sistema;

-- Usar la base de datos "sistema"
USE sistema;

-- Crear la tabla "user" con las columnas especificadas
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lastName VARCHAR(50),
    age INT,
    firstName VARCHAR(50),
    password VARCHAR(100),
    phone VARCHAR(20),
    gender VARCHAR(10),
    rol VARCHAR(20)
);