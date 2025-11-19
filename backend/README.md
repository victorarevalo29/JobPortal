# JobPortal API

## Modelos disponibles

- `User`: perfiles de candidatos y empleadores, con skills, alertas y estadísticas.
- `Company`: metadatos de empresas para vacantes y reseñas.
- `Job`: ofertas vinculadas a compañías con rango salarial, estado y experiencia requerida.
- `Application`: aplicaciones entre usuarios y vacantes, evita duplicados por índice compuesto.
- `Review`: reseñas con rating de 1 a 5 por empresa.
- `Resource`: contenidos educativos categorizados para la comunidad.
- `ForumPost`: publicaciones del foro con hilos de comentarios embebidos.

Cada esquema usa `timestamps: true`, referencias via `ObjectId`, validaciones básicas y los índices necesarios para búsquedas frecuentes.
