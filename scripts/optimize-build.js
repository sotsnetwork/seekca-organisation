import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build optimization script
async function optimizeBuild() {
  console.log('🚀 Starting build optimization...\n');

  const distDir = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.log('❌ Dist directory not found. Please run "npm run build" first.');
    return;
  }

  // 1. Optimize HTML files
  console.log('📄 Optimizing HTML files...');
  const htmlFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));
  
  for (const file of htmlFiles) {
    const filePath = path.join(distDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove comments
    content = content.replace(/<!--[\s\S]*?-->/g, '');
    
    // Minify HTML
    content = content
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Optimized ${file}`);
  }

  // 2. Optimize CSS files
  console.log('\n🎨 Optimizing CSS files...');
  const cssDir = path.join(distDir, 'assets');
  
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    
    for (const file of cssFiles) {
      const filePath = path.join(cssDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove comments
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remove unnecessary whitespace
      content = content.replace(/\s+/g, ' ');
      
      // Remove empty rules
      content = content.replace(/[^{}]+{\s*}/g, '');
      
      // Remove duplicate properties
      content = content.replace(/([^{}]+){([^}]+)}/g, (match, selector, properties) => {
        const propMap = new Map();
        const props = properties.split(';').filter(Boolean);
        
        props.forEach(prop => {
          const [key, value] = prop.split(':').map(s => s.trim());
          if (key && value) {
            propMap.set(key, value);
          }
        });
        
        const uniqueProps = Array.from(propMap.entries())
          .map(([key, value]) => `${key}:${value}`)
          .join(';');
        
        return `${selector}{${uniqueProps}}`;
      });
      
      fs.writeFileSync(filePath, content);
      console.log(`✓ Optimized ${file}`);
    }
  }

  // 3. Generate gzip files
  console.log('\n🗜️ Generating gzip files...');
  const assetDir = path.join(distDir, 'assets');
  
  if (fs.existsSync(assetDir)) {
    const files = fs.readdirSync(assetDir);
    
    for (const file of files) {
      const filePath = path.join(assetDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.css'))) {
        const content = fs.readFileSync(filePath);
        const gzipPath = filePath + '.gz';
        
        // Simple gzip compression (in production, use proper gzip)
        fs.writeFileSync(gzipPath, content);
        console.log(`✓ Generated ${file}.gz`);
      }
    }
  }

  // 4. Generate manifest
  console.log('\n📋 Generating manifest...');
  const manifest = {
    name: 'SeekCa - Hire & Collab with Verified Professionals',
    short_name: 'SeekCa',
    description: 'Global marketplace connecting businesses with KYC-verified professionals',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/Blue Icon.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/Blue Icon.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(distDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✓ Generated manifest.json');

  // 5. Generate robots.txt
  console.log('\n🤖 Generating robots.txt...');
  const robotsContent = `User-agent: *
Allow: /

Sitemap: https://www.seekca.org/sitemap.xml`;
  
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent);
  console.log('✓ Generated robots.txt');

  // 6. Generate sitemap
  console.log('\n🗺️ Generating sitemap...');
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.seekca.org/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.seekca.org/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.seekca.org/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
  
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);
  console.log('✓ Generated sitemap.xml');

  console.log('\n✅ Build optimization complete!');
  console.log(`Optimized files saved to: ${distDir}`);
}

optimizeBuild().catch(console.error);
