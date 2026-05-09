import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'public', 'images');

async function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(file).toLowerCase();
            if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
                const parsedPath = path.parse(fullPath);
                const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

                try {
                    await sharp(fullPath)
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                    console.log(`Converted: ${file} -> ${path.basename(outputPath)}`);
                    
                    // Delete the original file after successful conversion
                    fs.unlinkSync(fullPath);
                } catch (error) {
                    console.error(`Error converting ${file}:`, error);
                }
            }
        }
    }
}

async function run() {
    console.log('Starting image optimization...');
    await processDirectory(imagesDir);
    console.log('Image optimization complete.');
}

run();
