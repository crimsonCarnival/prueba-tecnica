# JornadaApp — Sistema de Registro de Jornadas Laborales

Aplicación full-stack para registrar y gestionar las jornadas laborales de los trabajadores. Permite iniciar una jornada con un código único, visualizar un cronómetro en tiempo real sincronizado con el servidor, y finalizar la jornada registrando el tiempo total trabajado.

---

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite 8 + TypeScript 6 |
| Backend | Node.js + Express 4 + TypeScript 5 |
| Base de datos | MySQL 8+ |
| Validación | Zod |
| HTTP client | Axios |
| IDs | UUID v4 |
| Estilos | Vanilla CSS con custom properties (tema claro) |

---

## Requisitos

- Node.js 18+
- MySQL 8+ en ejecución local
- npm 9+

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd prueba-tecnica
```

### 2. Crear la base de datos en MySQL

Puedes ejecutar directamente el archivo `backend/src/database/schema.sql`, que crea la base de datos, las tablas y los trabajadores de prueba:

```bash
mysql -u root -p < backend/src/database/schema.sql
```

O manualmente:

```sql
CREATE DATABASE IF NOT EXISTS jornada_laboral CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend

```bash
cd backend
npm install
```

Configurar las variables de entorno en `backend/.env`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=jornada_laboral
CORS_ORIGIN=http://localhost:5173
```

### 4. Frontend

```bash
cd frontend
npm install
```

Configurar `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Ejecución

Abrir dos terminales:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Abrir el navegador en `http://localhost:5173`.

Los códigos de trabajador de prueba disponibles son: `1000`, `1001`, `1002`.

---

## Endpoints de la API

Base URL: `http://localhost:3001/api/shifts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/start` | Inicia una nueva jornada para un trabajador |
| `PATCH` | `/:id/end` | Finaliza una jornada activa |
| `GET` | `/report` | Obtiene todas las jornadas (reporte general) |
| `GET` | `/active/:workerCode` | Obtiene la jornada activa de un trabajador |
| `GET` | `/history/:workerCode` | Obtiene el historial de jornadas de un trabajador |

### Formato de respuesta

Toda respuesta sigue el mismo envelope:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-07-25T14:30:00.000Z"
}
```

En caso de error:

```json
{
  "success": false,
  "error": {
    "code": "WORKER_NOT_FOUND",
    "message": "El trabajador \"9999\" no fue encontrado en el sistema"
  },
  "timestamp": "2026-07-25T14:30:00.000Z"
}
```

---

## Estructura del proyecto

```
prueba-tecnica/
├── backend/
│   ├── src/
│   │   ├── config/          # Variables de entorno validadas con Zod
│   │   ├── controllers/     # Handlers HTTP (delgados, sin lógica de negocio)
│   │   ├── database/        # Conexión MySQL y schema.sql
│   │   ├── dtos/            # Objetos de transferencia de datos (Request/Response)
│   │   ├── errors/          # Jerarquía de errores tipados (AppError → subclases)
│   │   ├── middleware/       # Error handler centralizado, request logger
│   │   ├── models/          # Interfaces de entidades de DB
│   │   ├── repositories/    # Acceso a datos (SQL puro, sin ORM)
│   │   ├── routes/          # Definición de rutas con DI manual
│   │   ├── services/        # Lógica de negocio
│   │   ├── validators/      # Schemas Zod para validación de requests
│   │   ├── app.ts           # Configuración Express
│   │   └── index.ts         # Punto de entrada (bootstrap)
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client + funciones tipadas por dominio
│   │   ├── components/      # Componentes UI (ShiftForm, ActiveShift, Timer, ...)
│   │   ├── hooks/           # useShift, useTimer, useToast
│   │   ├── types/           # Interfaces TypeScript compartidas
│   │   ├── utils/           # Formateo de tiempo, validación cliente
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css        # Design tokens y estilos base
│   │   └── main.tsx
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3001` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | _(vacío)_ |
| `DB_NAME` | Nombre de la base de datos | `jornada_laboral` |
| `CORS_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API | `http://localhost:3001/api` |

---

## Decisiones de arquitectura

### UUID como identificadores
Los IDs de todas las entidades son UUID v4 generados en la capa de aplicación (paquete `uuid`). Esto permite escalar a entornos distribuidos sin colisiones y evita exponer la secuencia interna de registros.

### Capas bien definidas
La arquitectura sigue una separación estricta de responsabilidades:
- **Controllers**: reciben la request HTTP, validan el formato y delegan.
- **Services**: contienen toda la lógica de negocio (verificar trabajadores, aplicar reglas de jornada).
- **Repositories**: único punto de acceso a la base de datos; los Services no ejecutan SQL.

### Jerarquía de errores tipados
`AppError` es la clase base con `statusCode` y `errorCode`. Sus subclases (`NotFoundError`, `ConflictError`, `ValidationError`) permiten al middleware centralizado mapearlos automáticamente a respuestas HTTP consistentes sin `if/else` en cada controlador.

### Cronómetro sincronizado con el servidor
El timer deriva el tiempo transcurrido de `startTime` (registrado por el servidor) en cada tick, no de un contador local. Esto garantiza que recargar la página muestre el tiempo correcto.

### Inyección de dependencias manual
Las dependencias se instancian y conectan en las rutas sin framework de IoC. Suficiente para la escala actual y fácil de migrar a un contenedor (tsyringe, InversifyJS) si creciera.

---

## Escenarios de error implementados

| # | Escenario | HTTP | Código de error | Descripción |
|---|-----------|------|-----------------|-------------|
| 1 | Código de trabajador inválido | `404` | `WORKER_NOT_FOUND` | Se intenta iniciar jornada con un código que no existe en la BD |
| 2 | Jornada ya activa | `409` | `SHIFT_ALREADY_ACTIVE` | El trabajador ya tiene una jornada en curso; no puede iniciar otra |
| 3 | Jornada no encontrada | `404` | `SHIFT_NOT_FOUND` | Se intenta finalizar un ID de jornada que no existe |
| 4 | Jornada ya finalizada | `409` | `SHIFT_ALREADY_COMPLETED` | Se intenta finalizar una jornada que ya fue completada |
| 5 | Datos de request inválidos | `400` | `VALIDATION_ERROR` | Código vacío, formato UUID incorrecto, campos faltantes |

Todos los errores son capturados por el middleware centralizado y devueltos como JSON estructurado. El frontend los muestra como notificaciones toast con el mensaje exacto recibido del servidor.
