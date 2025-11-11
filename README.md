# Asset Management System

Este sistema genera automáticamente un JSON con todas las URLs de los assets en la carpeta `images`.

## 🚀 Uso

### Actualizar el JSON de assets:
```bash
node update-assets.js
```

### Vigilar cambios automáticamente:
```bash
node update-assets.js --watch
```

## 📁 Estructura del JSON generado

El archivo `assets.json` contiene:

- **lastUpdated**: Timestamp de la última actualización
- **totalAssets**: Número total de archivos
- **baseUrl**: URL base para todos los assets
- **files**: Objeto con todos los archivos indexados por clave
- **images**: Array solo con imágenes (jpg, png, webp, etc.)
- **videos**: Array solo con videos (mp4, mov, etc.)

## 💻 Ejemplo de uso en JavaScript

```javascript
// Cargar el JSON de assets
const assets = require('./assets.json');

// Obtener todas las imágenes
console.log('Imágenes disponibles:', assets.images.length);
assets.images.forEach(img => {
    console.log(`- ${img.filename}: ${img.url}`);
});

// Obtener un asset específico por clave
const specificAsset = assets.files['IMG_20251030_WA0043'];
if (specificAsset) {
    console.log(`URL: ${specificAsset.url}`);
    console.log(`Tamaño: ${specificAsset.size} bytes`);
}

// Obtener solo videos
const videos = assets.videos;
console.log(`Videos disponibles: ${videos.length}`);
```

## 📋 Ejemplo de uso en HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Galería de Assets</title>
</head>
<body>
    <div id="gallery"></div>
    
    <script>
        // Cargar assets (necesitarías servir assets.json desde un servidor)
        fetch('./assets.json')
            .then(response => response.json())
            .then(assets => {
                const gallery = document.getElementById('gallery');
                
                // Mostrar todas las imágenes
                assets.images.forEach(img => {
                    const imgElement = document.createElement('img');
                    imgElement.src = img.url;
                    imgElement.alt = img.filename;
                    imgElement.style.maxWidth = '300px';
                    imgElement.style.margin = '10px';
                    gallery.appendChild(imgElement);
                });
            });
    </script>
</body>
</html>
```

## ⚙️ Configuración

Puedes modificar estas variables en `update-assets.js`:

- **IMAGES_FOLDER**: Carpeta a escanear (por defecto: `'./images'`)
- **OUTPUT_JSON**: Archivo de salida (por defecto: `'./assets.json'`)
- **BASE_URL**: URL base para los assets (por defecto: `'./images/'`)

### Cambiar la URL base:

```javascript
// Para URLs absolutas en producción
const BASE_URL = 'https://tudominio.com/images/';

// Para rutas relativas
const BASE_URL = './images/';

// Para GitHub Pages
const BASE_URL = '/tu-repo/images/';
```

## 🔄 Automatización

### Opción 1: Usar el modo watch
```bash
node update-assets.js --watch
```

### Opción 2: Crear un script en package.json
```json
{
  "scripts": {
    "update-assets": "node update-assets.js",
    "watch-assets": "node update-assets.js --watch"
  }
}
```

### Opción 3: Git Hook (actualizar antes de cada commit)
Crea `.git/hooks/pre-commit`:
```bash
#!/bin/sh
node update-assets.js
git add assets.json
```

## 📊 Información incluida para cada asset

- **filename**: Nombre original del archivo
- **url**: URL completa del asset
- **extension**: Extensión del archivo
- **size**: Tamaño en bytes
- **modified**: Fecha de última modificación

¡Listo! Ahora cada vez que agregues o quites archivos de la carpeta `images`, solo ejecuta el script y tendrás el JSON actualizado.