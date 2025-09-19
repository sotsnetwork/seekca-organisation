import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = './public';
const outputDir = './public/optimized';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Image optimization configurations
const configs = {
  webp: { quality: 80, effort: 6 },
  avif: { quality: 80, effort: 4 },
  jpeg: { quality: 80, mozjpeg: true },
  png: { quality: 80, compressionLevel: 9 }
};

// Responsive image sizes
const responsiveSizes = [
  { width: 320, suffix: '-sm' },
  { width: 640, suffix: '-md' },
  { width: 1024, suffix: '-lg' },
  { width: 1280, suffix: '-xl' },
  { width: 1920, suffix: '-2xl' }
];

async function optimizeImage(inputPath, outputPath, format, options = {}) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    let pipeline = image;
    
    // Resize if width is specified
    if (options.width && options.width < metadata.width) {
      pipeline = pipeline.resize(options.width, null, {
        withoutEnlargement: true,
        fastShrinkOnLoad: false
      });
    }
    
    // Apply format-specific optimizations
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp(configs.webp);
        break;
      case 'avif':
        pipeline = pipeline.avif(configs.avif);
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg(configs.jpeg);
        break;
      case 'png':
        pipeline = pipeline.png(configs.png);
        break;
    }
    
    await pipeline.toFile(outputPath);
    console.log(`✓ Generated ${format}: ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error generating ${format} for ${inputPath}:`, error.message);
  }
}

async function processImage(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath).toLowerCase();
  
  // Skip if not an image
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return;
  }
  
  console.log(`\nProcessing: ${filePath}`);
  
  // Generate optimized versions
  const formats = ['webp', 'avif'];
  
  for (const format of formats) {
    const outputPath = path.join(outputDir, `${fileName}.${format}`);
    await optimizeImage(filePath, outputPath, format);
  }
  
  // Generate responsive sizes
  for (const size of responsiveSizes) {
    for (const format of formats) {
      const outputPath = path.join(outputDir, `${fileName}${size.suffix}.${format}`);
      await optimizeImage(filePath, outputPath, format, { width: size.width });
    }
  }
  
  // Generate optimized original format
  const originalFormat = ext === '.jpg' || ext === '.jpeg' ? 'jpeg' : 'png';
  const optimizedOriginalPath = path.join(outputDir, `${fileName}-optimized${ext}`);
  await optimizeImage(filePath, optimizedOriginalPath, originalFormat);
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  for (const file of imageFiles) {
    const filePath = path.join(inputDir, file);
    await processImage(filePath);
  }
  
  console.log('\n✅ Image optimization complete!');
  console.log(`Optimized images saved to: ${outputDir}`);
}

main().catch(console.error);
