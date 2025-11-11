// Ejemplo práctico de uso del assets.json
const assets = require('./assets.json');

/**
 * Ejemplo 1: Obtener todas las URLs de imágenes
 */
function getAllImageUrls() {
    return assets.images.map(img => img.url);
}

/**
 * Ejemplo 2: Buscar un asset por nombre de archivo
 */
function findAssetByFilename(filename) {
    return Object.values(assets.files).find(asset => 
        asset.filename.toLowerCase().includes(filename.toLowerCase())
    );
}

/**
 * Ejemplo 3: Obtener assets por extensión
 */
function getAssetsByExtension(extension) {
    return Object.values(assets.files).filter(asset => 
        asset.extension.toLowerCase() === extension.toLowerCase()
    );
}

/**
 * Ejemplo 4: Generar HTML para una galería
 */
function generateImageGallery() {
    return assets.images.map(img => 
        `<img src="${img.url}" alt="${img.filename}" title="Tamaño: ${formatFileSize(img.size)}">`
    ).join('\n');
}

/**
 * Ejemplo 5: Formatear tamaño de archivo
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Ejemplo 6: Estadísticas de assets
 */
function getAssetStats() {
    const totalSize = Object.values(assets.files).reduce((sum, asset) => sum + asset.size, 0);
    return {
        totalFiles: assets.totalAssets,
        totalImages: assets.images.length,
        totalVideos: assets.videos.length,
        totalSizeFormatted: formatFileSize(totalSize),
        lastUpdate: new Date(assets.lastUpdated).toLocaleString('es-ES')
    };
}

// Ejemplos de uso:
console.log('=== ESTADÍSTICAS ===');
console.log(getAssetStats());

console.log('\n=== TODAS LAS IMÁGENES ===');
getAllImageUrls().forEach(url => console.log(url));

console.log('\n=== BUSCAR "WhatsApp" ===');
const whatsappAssets = Object.values(assets.files).filter(asset => 
    asset.filename.includes('WhatsApp')
);
whatsappAssets.forEach(asset => console.log(`${asset.filename} (${formatFileSize(asset.size)})`));

console.log('\n=== VIDEOS MÁS GRANDES ===');
const largeVideos = assets.videos
    .filter(video => video.size > 10000000) // Mayor a 10MB
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

largeVideos.forEach(video => 
    console.log(`${video.filename}: ${formatFileSize(video.size)}`)
);

module.exports = {
    getAllImageUrls,
    findAssetByFilename,
    getAssetsByExtension,
    generateImageGallery,
    formatFileSize,
    getAssetStats,
    assets
};