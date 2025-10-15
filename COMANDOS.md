# Guía Rápida - Comandos del Proyecto

## 🚀 Desarrollo
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve
# Acceso: http://localhost:4200

# Build para producción
ng build --prod
```

## 🔥 Firebase
```bash
# Login Firebase
firebase login

# Deploy hosting
firebase deploy --only hosting

# Deploy functions
firebase deploy --only functions

# Emuladores locales
firebase emulators:start
```

## 🧪 Testing
```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Linting
ng lint
```

## 📦 Gestión Dependencias
```bash
# Audit vulnerabilidades
npm audit

# Fix automático
npm audit fix

# Actualizar dependencias
ng update

# Verificar versiones
ng version
```

## 🔧 Comandos Útiles Angular
```bash
# Generar componente
ng generate component nombre-componente

# Generar servicio
ng generate service nombre-servicio

# Generar guard
ng generate guard nombre-guard

# Analizar bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/paginaproyecto/stats.json
```

## 📊 Información del Proyecto
- **Angular CLI**: 11.2.14
- **Node**: 18.x
- **Firebase**: v7.24.0
- **Puerto dev**: 4200
- **Build output**: dist/paginaproyecto/

---
*Comandos verificados: 15 de octubre de 2025*