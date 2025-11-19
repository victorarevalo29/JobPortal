# JobPortal

Inicio de proyecto full-stack para un portal de empleo construido con Vue 3 (Vite) en el frontend, Express.js en el backend y MongoDB Atlas como base de datos. El objetivo es servir como base sólida para ir sumando módulos académicos con buenas prácticas y una estética moderna sin plantillas prefabricadas.

## Requisitos previos

- Node.js 18 o superior
- Una cuenta gratuita en MongoDB Atlas
- Variables de entorno definidas (ver `backend/.env.example`)

## Instalación inicial

```bash
cd JobPortal
npm install
```

## Scripts disponibles

```bash
npm run dev           # Arranca el frontend (Vite)
npm run dev:frontend  # Alias explícito del frontend
npm run dev:backend   # Levanta la API de Express
npm run lint          # Ejecuta los linters configurados en cada workspace
```

## Próximos pasos sugeridos

1. Configurar las variables reales en `backend/.env` usando el ejemplo proporcionado.
2. Definir los esquemas iniciales de MongoDB con Mongoose y cubrirlos con pruebas.
3. Construir los primeros módulos (autenticación, listado de vacantes, dashboard, etc.) siguiendo la estructura modular.
