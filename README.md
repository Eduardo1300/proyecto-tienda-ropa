# 🛍️ Tienda de Ropa - E-commerce Full Stack

Un sistema completo de tienda en línea desarrollado con **NestJS** (backend) y **React + TypeScript** (frontend), con autenticación robusta, gestión de productos, carrito de compras y sistema de órdenes.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación de email único
- **Login/Logout** con JWT tokens
- **Refresh tokens** para sesiones prolongadas
- **Recuperación de contraseña** con tokens temporales
- **Roles de usuario** (user/admin)
- **Middleware de autenticación** con Passport.js

### 🛒 Funcionalidades de E-commerce
- **Catálogo de productos** con filtros y búsqueda
- **Carrito de compras** persistente
- **Gestión de órdenes** completa
- **Panel de administrador** para gestión de productos
- **Perfiles de usuario** personalizables

### 🏗️ Arquitectura Robusta
- **Backend**: NestJS con TypeORM y PostgreSQL
- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: TailwindCSS para diseño responsive
- **Base de datos**: PostgreSQL con migraciones automáticas
- **Autenticación**: JWT + Passport.js
- **Validación**: class-validator y class-transformer

## 📁 Estructura del Proyecto

```
proyecto_tienda_de_ropa/
├── tienda-backend/          # API REST con NestJS
│   ├── src/
│   │   ├── auth/           # Sistema de autenticación
│   │   ├── users/          # Gestión de usuarios
│   │   ├── productos/      # Catálogo de productos
│   │   ├── carrito/        # Carrito de compras
│   │   ├── ordenes/        # Sistema de órdenes
│   │   ├── admin/          # Panel administrativo
│   │   └── common/         # Tipos y utilidades compartidas
│   ├── .env               # Variables de entorno
│   └── package.json
├── tienda-frontend/        # SPA con React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── context/       # Context API (Auth, Carrito)
│   │   ├── services/      # Cliente API con Axios
│   │   └── types/         # Definiciones de TypeScript
│   └── package.json
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Backend (NestJS)
- **NestJS** 11.0.1 - Framework progresivo para Node.js
- **TypeORM** 0.3.25 - ORM para TypeScript
- **PostgreSQL** - Base de datos relacional
- **Passport.js** - Middleware de autenticación
- **JWT** - JSON Web Tokens para autenticación
- **bcrypt** - Encriptación de contraseñas
- **class-validator** - Validación de DTOs

### Frontend (React)
- **React** 19.1.0 - Biblioteca de UI
- **TypeScript** 5.8.3 - Tipado estático
- **Vite** 7.0.6 - Build tool y dev server
- **React Router** 7.7.1 - Enrutamiento
- **TailwindCSS** 3.4.3 - Framework de CSS utility-first
- **Axios** 1.11.0 - Cliente HTTP

## 📋 Prerrequisitos

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 13.0
- **npm** o **yarn**

## ⚡ Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd proyecto_tienda_de_ropa
```

### 2. Configurar la Base de Datos
```bash
# Crear base de datos en PostgreSQL
createdb tienda_db
```

### 3. Configurar Backend
```bash
cd tienda-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones de base de datos
```

**Configuración del archivo `.env`:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=tienda_db

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro
JWT_EXPIRES_IN=15m

# App
NODE_ENV=development
PORT=3002
```

### 4. Configurar Frontend
```bash
cd ../tienda-frontend

# Instalar dependencias
npm install
```

## 🚀 Ejecución

### Desarrollo
```bash
# Terminal 1: Backend
cd tienda-backend
npm run start:dev

# Terminal 2: Frontend
cd tienda-frontend
npm run dev
```

### Producción
```bash
# Backend
cd tienda-backend
npm run build
npm run start:prod

# Frontend
cd tienda-frontend
npm run build
npm run preview
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002
- **Documentación API**: http://localhost:3002/api (Swagger)

## 📚 API Endpoints

### Autenticación
```http
POST /auth/register     # Registro de usuario
POST /auth/login        # Inicio de sesión
POST /auth/logout       # Cerrar sesión
POST /auth/refresh      # Renovar token
GET  /auth/profile      # Perfil del usuario
POST /auth/forgot-password   # Recuperar contraseña
POST /auth/reset-password    # Resetear contraseña
```

### Productos
```http
GET    /products        # Listar productos
POST   /products        # Crear producto (admin)
GET    /products/:id    # Obtener producto
PATCH  /products/:id    # Actualizar producto (admin)
DELETE /products/:id    # Eliminar producto (admin)
```

### Carrito
```http
POST   /cart           # Agregar al carrito
GET    /cart/:userId   # Obtener carrito
DELETE /cart/:id       # Eliminar del carrito
```

### Órdenes
```http
POST   /orders         # Crear orden
GET    /orders         # Listar órdenes del usuario
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm run start:dev      # Desarrollo con watch mode
npm run build          # Compilar para producción
npm run start:prod     # Ejecutar en producción
npm run test           # Ejecutar tests
npm run test:e2e       # Tests end-to-end
npm run lint           # Linting del código
```

### Frontend
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build para producción
npm run preview        # Preview del build
npm run lint           # Linting del código
```

## 🧪 Testing

### Backend
```bash
cd tienda-backend
npm run test           # Unit tests
npm run test:e2e       # Integration tests
npm run test:cov       # Coverage report
```

### Frontend
```bash
cd tienda-frontend
npm run test           # Component tests
```

## 📊 Base de Datos

### Entidades Principales
- **User**: Usuarios del sistema
- **Product**: Catálogo de productos
- **CartItem**: Items en el carrito
- **Order**: Órdenes de compra
- **OrderItem**: Items de las órdenes

### Migraciones
```bash
# Las migraciones se ejecutan automáticamente al iniciar el backend
# TypeORM sincroniza el esquema en modo desarrollo
```

## 🔒 Seguridad

- **Contraseñas encriptadas** con bcrypt
- **JWT tokens** con expiración configurable
- **Validación de entrada** en todos los endpoints
- **CORS** configurado para frontend
- **Variables de entorno** para datos sensibles
- **Sanitización de emails** (lowercase, trim)

## 🎨 Características del Frontend

- **Diseño responsive** con TailwindCSS
- **Contextos globales** para autenticación y carrito
- **Enrutamiento protegido** por roles
- **Gestión de estado** con React Context
- **Interfaz moderna** y user-friendly
- **Formularios validados** del lado cliente

## 🚀 Deployment

### Backend (Railway/Heroku)
```bash
# Configurar variables de entorno en tu plataforma
# DATABASE_URL, JWT_SECRET, etc.
npm run build
npm run start:prod
```

### Frontend (Vercel/Netlify)
```bash
# Configurar variable de entorno VITE_API_URL
npm run build
# Deploy de la carpeta dist/
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### v1.0.0 (2025-01-10)
- ✅ Sistema de autenticación completo
- ✅ CRUD de productos
- ✅ Carrito de compras funcional
- ✅ Sistema de órdenes
- ✅ Panel de administración
- ✅ Diseño responsive
- ✅ Validaciones robustas

## 🐛 Troubleshooting

### Problemas Comunes

**Error de conexión a la base de datos:**
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql start

# Verificar configuración en .env
DB_HOST=localhost
DB_PORT=5432
```

**Puerto ocupado:**
```bash
# Cambiar puerto en .env (backend) o vite.config.ts (frontend)
PORT=3003
```

**Problemas de CORS:**
```bash
# Verificar que la URL del frontend esté en la configuración de CORS del backend
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autores

- **Eduardo Valdivia** - *Desarrollo Full Stack* - [@Eduardo1300](https://github.com/Eduardo1300)

## 🙏 Agradecimientos

- NestJS Team por el increíble framework
- React Team por la biblioteca de UI
- TailwindCSS por el sistema de diseño
- TypeORM por el ORM robusto

---

**¿Tienes preguntas?** Abre un issue o contacta al equipo de desarrollo.

**¿Encontraste un bug?** Por favor, reporta el problema con pasos para reproducirlo.

**¿Quieres contribuir?** ¡Las contribuciones son bienvenidas! Lee la guía de contribución arriba.
