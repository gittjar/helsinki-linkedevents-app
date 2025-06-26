const fs = require('fs');
const path = require('path');

// Paths
const srcIndexPath = 'src/index.html';
const distDir = 'dist/helsinki-linkedevents-app';
const distIndexPath = path.join(distDir, 'index.html');
const srcFaviconPath = 'src/favicon.ico';
const distFaviconPath = path.join(distDir, 'favicon.ico');
const srcAssetsPath = 'src/assets';
const distAssetsPath = path.join(distDir, 'assets');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Read the source index.html
let indexContent = fs.readFileSync(srcIndexPath, 'utf8');

// Find the built files
const distFiles = fs.readdirSync(distDir);
const cssFile = distFiles.find(file => file.endsWith('.css'));
const jsFiles = distFiles.filter(file => file.endsWith('.js'));

// Inject the built files into the HTML
const runtimeJs = jsFiles.find(file => file.includes('runtime'));
const polyfillsJs = jsFiles.find(file => file.includes('polyfills'));
const mainJs = jsFiles.find(file => file.includes('main'));

// Add CSS link before closing head tag
if (cssFile) {
    indexContent = indexContent.replace('</head>', `  <link rel="stylesheet" href="${cssFile}">\n</head>`);
}

// Add JS scripts before closing body tag
let scriptTags = '';
if (runtimeJs) scriptTags += `  <script src="${runtimeJs}" type="module"></script>\n`;
if (polyfillsJs) scriptTags += `  <script src="${polyfillsJs}" type="module"></script>\n`;
if (mainJs) scriptTags += `  <script src="${mainJs}" type="module"></script>\n`;

indexContent = indexContent.replace('</body>', `${scriptTags}</body>`);

// Write the modified index.html
fs.writeFileSync(distIndexPath, indexContent);
console.log('✓ Created index.html');

// Copy favicon
if (fs.existsSync(srcFaviconPath)) {
    fs.copyFileSync(srcFaviconPath, distFaviconPath);
    console.log('✓ Copied favicon.ico');
}

// Copy assets folder
if (fs.existsSync(srcAssetsPath)) {
    copyRecursiveSync(srcAssetsPath, distAssetsPath);
    console.log('✓ Copied assets folder');
}

console.log('Build completed successfully!');
