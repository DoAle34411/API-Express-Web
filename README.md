# API para Renta de Libros y Recomendaciones

Esta es una API desarrollada con **Express.js** para gestionar la lógica de negocio de un sistema de renta de libros. Proporciona endpoints para manejar usuarios, libros, historial de rentas y recomendaciones basadas en datos históricos.

## Características

- **Autenticación**: Manejo de sesiones de usuarios con control de acceso.
- **Gestión de Libros**: Endpoints para crear, editar, eliminar y consultar libros.
- **Rentas**: 
  - Crear y actualizar rentas.
  - Validar disponibilidad y gestión de multas por retrasos.
- **Recomendaciones Personalizadas**: Basadas en géneros más rentados por cada usuario.
- **Tendencias de Libros**:
  - Libros más rentados de todos los tiempos.
  - Libros más rentados del último mes.

---

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework para construir la API.
- **MongoDB**: Base de datos utilizada para almacenar información.
- **Mongoose**: ODM para interactuar con MongoDB.
- **bcrypt**: Para encriptar contraseñas de los usuarios.
- **dotenv**: Para manejar variables de entorno.

---

## Instalación

1. **Clona el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```
2. **Instala dependencias**
3. **Ejecuta**
## Endpoints del API

### Rutas de Usuarios (`/users`)
- **POST `/register`**: Registrar un nuevo usuario.  
- **POST `/login`**: Iniciar sesión de usuario.  
- **POST `/update-password`**: Actualizar la contraseña de un usuario.  
- **POST `/admin/login`**: Iniciar sesión como administrador.  
- **POST `/admin/clear-multa/:user_id`**: Eliminar multa de un usuario.  
- **GET `/cedula/:cedula`**: Buscar usuario por cédula.  
- **GET `/id/:id_user`**: Buscar usuario por ID.  
- **GET `/admin/allUsers`**: Obtener la lista de todos los usuarios.  
- **PUT `/update/:id`**: Actualizar los datos de un usuario.  
- **DELETE `/delete/:id`**: Eliminar un usuario por ID.  

---

### Rutas de Libros (`/books`)
- **POST `/createBook`**: Crear un nuevo libro.  
- **GET `/`**: Obtener todos los libros.  
- **GET `/:id`**: Obtener los detalles de un libro específico.  
- **PUT `/update/:id`**: Actualizar la información de un libro.  
- **DELETE `/delete/:id`**: Eliminar un libro por ID.  
- **GET `/book/by-genres`**: Obtener libros por género.  

---

### Rutas de Rentas (`/rent`)
- **POST `/rents`**: Crear una nueva renta.  
- **GET `/rents`**: Obtener todas las rentas.  
- **GET `/rents/user/:user_id`**: Obtener las rentas de un usuario por ID.  
- **GET `/rents/book/:book_id`**: Obtener las rentas relacionadas con un libro por ID.  
- **PUT `/rents/:rent_id`**: Actualizar la información de una renta.  
- **GET `/rents/genres/most-rented`**: Obtener los géneros más rentados de todos los tiempos.  
- **GET `/rents/genres/most-rented/time`**: Obtener los géneros más rentados en un período de tiempo.  
- **GET `/rents/genres/user/:user_id`**: Obtener los géneros más comunes rentados por un usuario.  
- **GET `/rents/top-books`**: Obtener los libros más rentados de todos los tiempos.  
- **GET `/rents/top-books/month`**: Obtener los libros más rentados del último mes.  

---

### Rutas de Eventos (`/event`)
- **POST `/createEvent`**: Crear un nuevo evento.  
- **GET `/`**: Obtener todos los eventos.  
- **GET `/:id`**: Obtener los detalles de un evento por ID.  
- **PUT `/updateEvent/:id`**: Actualizar la información de un evento.  
- **DELETE `/deleteEvent/:id`**: Eliminar un evento por ID.  
- **GET `/events/currentEvents`**: Obtener los eventos actuales.  

---

### Configuración Adicional
- **CORS**: Permite solicitudes desde:
  - `https://remix-front.onrender.com` (frontend del cliente).  
  - `https://admin-proyecto-web.onrender.com` (panel de administración).  
- **Sesiones**: Configuración de sesiones seguras con cookies.  
- **Base de Datos**: Conexión a MongoDB utilizando variables de entorno.  
