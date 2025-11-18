# Project Manager (Frontend-only) - Supabase

Este repo contiene un frontend estático (HTML/CSS/JS) que se conecta directamente a Supabase (Postgres) usando la llave publishable.

## Estructura

- `index.html` — Interfaz principal (tabla, modal).
- `style_inicio.css` — Estilos.
- `supabase.js` — Inicialización del cliente Supabase (usa la key publica).
- `app.js` — Lógica CRUD (leer, crear, editar, eliminar).

## Requisitos

- Una tabla en Supabase llamada `servicios_tecnicos` con la siguiente estructura:

```sql
CREATE TABLE servicios_tecnicos (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(150) NOT NULL,
  celular VARCHAR(20),
  numero INTEGER NOT NULL,
  fecha_emision DATE NOT NULL,
  numero_serie VARCHAR(50),
  costo NUMERIC(12,2) NOT NULL,
  saldo NUMERIC(12,2),
  marca VARCHAR(100),
  estado VARCHAR(50),
  descripcion TEXT
);
```

## Cómo usar (local)

1. Clona o descarga estos archivos.
2. Sirve la carpeta con un servidor estático (recomendado) — desde la terminal:
   - Python 3:
     ```bash
     python -m http.server 5500
     ```
     Luego abre `http://localhost:5500` en tu navegador.
3. Asegúrate de que tu tabla exista y que la clave publishable esté correctamente configurada en `supabase.js`.

## Subir a GitHub

1. `git init`
2. `git add .`
3. `git commit -m "Frontend Supabase listo"`
4. Crea un repo en GitHub y sigue las instrucciones para `git remote add origin ...` y `git push`.

## Notas de seguridad

- La llave publishable **está diseñada** para usarse en el frontend.
- **Nunca** pegues la llave `service_role` (secreta) en archivos públicos.

