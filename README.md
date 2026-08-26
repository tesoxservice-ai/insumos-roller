# MaxRoller

Plataforma de venta de cortinas roller con configurador interactivo, catálogo de stock, presupuesto multi-ambiente e integración con WhatsApp y Mercado Pago.

## Stack tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript (strict)
- **Estilos**: Tailwind CSS + CSS Variables custom
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Email**: Resend
- **PDF**: jsPDF
- **Pagos**: Mercado Pago
- **Iconos**: Lucide React
- **Validación**: Zod

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/maxroller.git
cd maxroller

# Instalar dependencias
npm install
```

## Configuración de variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# Completar los valores en .env.local:
# - NEXT_PUBLIC_SUPABASE_URL: URL del proyecto en Supabase
# - NEXT_PUBLIC_SUPABASE_ANON_KEY: Clave anon de Supabase
# - SUPABASE_SERVICE_ROLE_KEY: Clave service role (solo servidor)
# - RESEND_API_KEY: API key de Resend para emails
# - NEXT_PUBLIC_MP_PUBLIC_KEY: Public key de Mercado Pago
# - MP_ACCESS_TOKEN: Access token de Mercado Pago
# - NEXT_PUBLIC_WHATSAPP_NUMBER: Número de WhatsApp (ej: 5491112345678)
# - NEXT_PUBLIC_BASE_URL: URL base del deploy (ej: https://maxroller.com.ar)
```

## Correr en desarrollo

```bash
npm run dev
# Abre http://localhost:3000
```

## Estructura del proyecto

```
app/                → Rutas y páginas (App Router de Next.js 14)
  (public)/         → Páginas públicas: home, configurador, stock, guías
  (admin)/          → Panel de administración protegido por auth
  api/              → API routes: catálogo, cotizaciones, email, pagos
components/         → Componentes React por dominio
  configurador/     → Pasos del configurador interactivo
  catalogo/         → Cards y selectores del catálogo
  presupuesto/      → Panel y generador de PDF del presupuesto
  admin/            → Formularios y tablas del panel admin
  ui/               → Componentes UI genéricos reutilizables
lib/                → Utilidades del servidor: supabase, precios, pdf, email, whatsapp
hooks/              → Custom hooks: useConfigurador, usePresupuesto
types/              → Tipos TypeScript centrales del sistema
middleware.ts       → Protección de rutas /admin con Supabase Auth
```