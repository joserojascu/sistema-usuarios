# Sistema de Gestión de Usuarios

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

Este repositorio contiene un sistema desarrollado para la gestión de usuarios, implementado con Node.js para el backend, Angular para el frontend y utiliza MySQL como gestor de base de datos. Este README proporciona una guía detallada sobre cómo clonar el repositorio, configurar el entorno y ejecutar la aplicación.

# Funcionalidades Principales
El sistema ofrece las siguientes funcionalidades:

Registro de Usuarios: Permite el registro de nuevos usuarios.
Roles de Usuario: Hay dos roles principales, "basic" y "admin".
Rol "Basic": Puede editar su información de perfil al iniciar sesión.
Rol "Admin": Tiene privilegios para ver todos los usuarios registrados, agregar, modificar y eliminar usuarios, además de editar su propio perfil.



## Ejecutar de forma local

CLonar el proyecto

```bash
  git clone https://github.com/joserojascu/sistema-usuarios.git
```

Backend (Node.js)

Ir a la siguiente directorio

```bash
  cd sistema-usuarios/API
```

Instalar dependencias para el backend

```bash
  npm install
```

En la ruta API/src/ encontrarás un archivo llamado db.sql. Copiar el contenido de este archivo y ejecutar las sentencias SQL en tu gestor de base de datos MySQL. Asegúrate de que la ejecución esté en el puerto 3306.

Frontend (Angular)

Regresar al directorio principal del sistema de usuarios:

```bash
  cd ..
```

Instalar dependencias para el Frontend

```bash
  npm install
```

Iniciar los servidores

```bash
  npm run dev
```