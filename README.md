# Ciberseguridad-backend: CRUD con Node.js y MySQL

## Descripción del Proyecto

En este proyecto, desarrollarás una plataforma de streaming usando Node.js y MySQL. La aplicación permitirá realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una base de datos relacional, utilizando el archivo trailerflix.json como referencia para diseñar el modelo de datos.

## Entrega
Esta entrega se enfocará en diseñar y crear la base de datos para una plataforma de streaming, usando MySQL y Node.js, junto con su respectiva documentación.

Aprovecha lo visto en las clases para comenzar a diseñar las tablas y relaciones necesarias, las cuales deberán estar basadas en las propiedades del archivo trailerflix.json.

## Dataset Proporcionados

- **trailerflix.json**: Contiene información detallada sobre contenido de la plataforma, como películas y series. Deberás utilizar este archivo como base para diseñar el modelo de datos.

## Modelo de Base de Datos
El archivo trailerflix.json incluye propiedades como ID, título, categorías, géneros, resumen, temporadas, reparto y enlaces a trailers. Basado en esta estructura, debes diseñar una base de datos llamada trailerflix con al menos 6 tablas relacionales. Entre ellas:

- **contenido**: Tabla principal con la información de películas y series.
- **categorías**: Definirá si el contenido es una película o una serie.
- **géneros**: Almacenará los géneros como Ciencia Ficción, Fantasía, etc.
- **actores**: Información sobre los actores principales de cada contenido.
- **tabla intermedia contenido-actores**: Relacionará el contenido con los actores.
El diseño debe ser bocetado primero en papel y luego implementado en la plataforma **DB Designer** sugerida en clase. Debes generar un archivo SQL de exportación que podrás usar para crear las tablas en MySQL.

## Pasos a Seguir
1. **Diseñar el modelo de datos** basado en trailerflix.json.
2. **Implementar las tablas** en DB Designer, asegurando que haya relaciones adecuadas entre ellas.
3. **Generar el archivo SQL** para crear las tablas en MySQL.
4. **Migrar los datos** del archivo JSON a MySQL utilizando los insert correspondientes.

## Funcionalidades del CRUD

1. **Obtener todos los contenidos**
   - Endpoint que devuelve todos los contenidos de la base de datos.
   - Control de errores para manejar la indisponibilidad de la base de datos.

2. **Obtener un contenido por ID**
   - Endpoint para obtener un contenido específico.
   - Control de errores para manejar casos en que el contenido no exista.

3. **Filtrar contenidos**
   - Endpoint para filtrar por título, género o categoría.
   - Control de errores para manejar coincidencias no encontradas o problemas de conexión.

4. **Agregar un nuevo contenido**
   - Endpoint para agregar una nueva pelicula o serie a la base de datos.
   - Validación de campos obligatorios.

5. **Actualizar un contenido:**
   - Endpoint para actualizar información como temporadas o reparto.
   - Control de errores para manejar actualizaciones fallidas.
     
6. **Eliminar un contenido**
   - Endpoint para eliminar un contenido de la base de datos.
   - Control de errores para manejar problemas durante el borrado.

7. **Control de errores**
   - Manejo de errores en la estructura de las solicitudes y respuestas.
   - Respuesta adecuada con mensajes y códigos de error específicos.
   - Control de acceso a rutas no existentes con respuestas apropiadas.

## Documentación de la API

### Swagger
Debes implementar la documentación de tu API utilizando **Swagger** (OpenAPI). Esto permitirá que cualquier desarrollador pueda entender y probar los endpoints de tu aplicación de manera interactiva.

**Requisitos:**
1. Instalar las dependencias necesarias:
   ```bash
   npm install swagger-jsdoc swagger-ui-express
   ```

2. Configurar Swagger en tu aplicación (`app.js`):
   - Definir la configuración básica de Swagger (título, versión, descripción, servidor).
   - Integrar Swagger UI en una ruta específica (ejemplo: `/api-docs`).

3. Documentar cada endpoint con comentarios JSDoc:
   - Descripción del endpoint.
   - Parámetros requeridos y opcionales.
   - Respuestas posibles (códigos de estado y ejemplos).
   - Modelos de datos (schemas).

4. La documentación debe incluir:
   - Información general de la API.
   - Todos los endpoints del CRUD.
   - Ejemplos de request y response.
   - Códigos de estado HTTP utilizados.

### Archivo api.http
Debes crear un archivo **api.http** en la raíz del proyecto que contenga ejemplos de todas las peticiones HTTP que tu API soporta. Este archivo permitirá probar los endpoints de manera rápida usando la extensión REST Client de Visual Studio Code.

**Requisitos:**
1. Incluir todas las operaciones CRUD:
   - GET: Obtener todos los contenidos.
   - GET: Obtener un contenido por ID.
   - GET: Filtrar contenidos (por título, género, categoría).
   - POST: Crear un nuevo contenido.
   - PUT/PATCH: Actualizar un contenido existente.
   - DELETE: Eliminar un contenido.

2. Cada petición debe incluir:
   - El método HTTP y la URL completa.
   - Headers necesarios (Content-Type, etc.).
   - Body con datos de ejemplo (para POST y PUT).
   - Comentarios explicativos.

3. Separar las peticiones con `###` para facilitar su ejecución individual.

4. Incluir variables de entorno cuando sea apropiado (ejemplo: `@baseUrl`).
  
## Herramientas Sugeridas
Utiliza una **I.A.** como sugerimos en clase para optimizar la inserción de los datos del JSON a la base de datos. Esto puede ayudarte a transformar el archivo *trailerflix.json* en un formato que sea más fácil de insertar en MySQL.

## Fechas Importantes

- **Avance del Proyecto**: 15 de octubre de 2024
  - Tener diseñadas las tablas en DB Designer, con el archivo SQL generado y los primeros endpoints funcionando.

- **Presentación Final**: 31 de octubre de 2024
  - Proyecto completo con CRUD y toda la documentación.

## Estructura del Repositorio

```plaintext
/controllers
  - contenidoController.js
/json
  - trailerflix.json
/README.md
/app.js
/api.http
/conexion/
  - database.js
/models/
  - contenido.js
  - categoria.js
  - genero.js
  - actor.js
/routes/
  - contenidoRoutes.js
```

### Descripción de Archivos

- **/json**: Contiene el archivo trailerflix.json con los datos de películas y series.
- **/README.md**: Este archivo, con la descripción del proyecto.
- **/app.js**: Archivo principal de la aplicación Node.js.
- **/api.http**: Archivo con ejemplos de peticiones HTTP para probar todos los endpoints de la API.
- **/conexion/database.js**: Configuración de la conexión a MySQL.
- **/models/**: Modelos de datos para las tablas en MySQL.
- **/routes/**: Definición de las rutas y endpoints del CRUD.

## Instrucciones de Entrega

1. **Fork** el repositorio desde [aquí](https://github.com/FabioDrizZt/Trabajo-Integrador-Relacional-Backend-Diplomatura-UNTREF/fork).
2. **Clona** tu fork en tu máquina local.
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio-fork.git
   ```
3. Realiza los cambios y sube tu código a tu fork.
4. **Sube** los cambios a tu fork.
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push origin main
   ```

5. Agrega a los siguientes usuarios como colaboradores en tu repositorio:
   - [FabioDrizZt](https://github.com/FabioDrizZt)
   - [Fer24Sanchez](https://github.com/Fer24Sanchez)

## Conclusión

Este proyecto te permitirá aplicar conceptos clave de desarrollo backend, diseño de bases de datos y documentación. ¡Adelanta los pasos y recuerda mantener tu código limpio y bien documentado!

---

Recuerda mantener tu código limpio, documentado y seguir las buenas prácticas de desarrollo.
## Seguridad

La documentación detallada sobre seguridad, autenticación, logs y pruebas se ha movido a un archivo separado: [SECURITY.md](SECURITY.md).

Resumen rápido aquí: autenticación por JWT + refresh tokens, contraseñas hasheadas con bcrypt, validación de entradas, cabeceras de seguridad (`helmet`), limitación de tasa para login y logs de auditoría con `winston`.

Para ver la explicación completa, ejemplos de pruebas y ubicaciones de los archivos relevantes, revisá [SECURITY.md](SECURITY.md).
