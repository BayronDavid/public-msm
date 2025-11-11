const fs = require('fs');
const path = require('path');

// Configuration
const IMAGES_FOLDER = './images';
const OUTPUT_JSON = './assets.json';
const BASE_URL = './images/'; // Change this to your desired base URL (e.g., 'https://yoursite.com/images/')

/**
 * Scans the images folder and generates a JSON file with asset URLs
 */
function updateAssetsJson() {
    try {
        // Check if images folder exists
        if (!fs.existsSync(IMAGES_FOLDER)) {
            console.error(`❌ Folder ${IMAGES_FOLDER} does not exist`);
            return;
        }

        // Read all files from images folder
        const files = fs.readdirSync(IMAGES_FOLDER);
        
        // Filter only files (no directories) and common media extensions
        const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.mov', '.avi', '.webm'];
        const assetFiles = files.filter(file => {
            const filePath = path.join(IMAGES_FOLDER, file);
            const isFile = fs.statSync(filePath).isFile();
            const hasMediaExtension = mediaExtensions.includes(path.extname(file).toLowerCase());
            return isFile && (hasMediaExtension || path.extname(file) === '');
        });

        // Sort files alphabetically for consistent output
        assetFiles.sort();

        // Generate asset object with URLs
        const assets = {
            lastUpdated: new Date().toISOString(),
            totalAssets: assetFiles.length,
            baseUrl: BASE_URL,
            files: {}
        };

        // Add each file with its URL and metadata
        assetFiles.forEach(file => {
            const filePath = path.join(IMAGES_FOLDER, file);
            const stats = fs.statSync(filePath);
            const fileKey = path.parse(file).name.replace(/[^a-zA-Z0-9]/g, '_'); // Create a valid key name
            
            assets.files[fileKey] = {
                filename: file,
                url: BASE_URL + file,
                extension: path.extname(file).toLowerCase() || 'unknown',
                size: stats.size,
                modified: stats.mtime.toISOString()
            };
        });

        // Create arrays for quick access by type
        assets.images = Object.values(assets.files).filter(asset => 
            ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(asset.extension)
        );

        assets.videos = Object.values(assets.files).filter(asset => 
            ['.mp4', '.mov', '.avi', '.webm'].includes(asset.extension)
        );

        // Write JSON file
        fs.writeFileSync(OUTPUT_JSON, JSON.stringify(assets, null, 2), 'utf8');
        
        console.log('✅ Assets JSON updated successfully!');
        console.log(`📁 Total files processed: ${assetFiles.length}`);
        console.log(`🖼️  Images: ${assets.images.length}`);
        console.log(`🎥 Videos: ${assets.videos.length}`);
        console.log(`📄 Output file: ${OUTPUT_JSON}`);
        
    } catch (error) {
        console.error('❌ Error updating assets JSON:', error.message);
    }
}

/**
 * Watch for changes in the images folder (optional)
 */
function watchFolder() {
    console.log(`👀 Watching ${IMAGES_FOLDER} for changes...`);
    fs.watch(IMAGES_FOLDER, (eventType, filename) => {
        if (filename) {
            console.log(`📁 Detected ${eventType} in ${filename}`);
            console.log('🔄 Updating assets JSON...');
            updateAssetsJson();
        }
    });
}

// Main execution
if (require.main === module) {
    console.log('🚀 Starting asset updater...');
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const shouldWatch = args.includes('--watch') || args.includes('-w');
    
    // Initial update
    updateAssetsJson();
    
    // Watch for changes if requested
    if (shouldWatch) {
        watchFolder();
        console.log('Press Ctrl+C to stop watching...');
        
        // Keep the process alive
        process.on('SIGINT', () => {
            console.log('\n👋 Stopping asset updater...');
            process.exit(0);
        });
    }
}

module.exports = { updateAssetsJson, watchFolder };