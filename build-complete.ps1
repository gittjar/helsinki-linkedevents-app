# Build the Angular app
Write-Host "Building Angular app..." -ForegroundColor Green
ng build

# Get the dist directory
$distDir = "dist\helsinki-linkedevents-app"

# Copy index.html with modifications
Write-Host "Processing index.html..." -ForegroundColor Green
$indexContent = Get-Content "src\index.html" -Raw

# Find built files
$cssFiles = Get-ChildItem "$distDir\*.css" | Select-Object -First 1
$jsFiles = Get-ChildItem "$distDir\*.js"

$runtimeJs = $jsFiles | Where-Object { $_.Name -like "*runtime*" } | Select-Object -First 1
$polyfillsJs = $jsFiles | Where-Object { $_.Name -like "*polyfills*" } | Select-Object -First 1
$mainJs = $jsFiles | Where-Object { $_.Name -like "*main*" } | Select-Object -First 1

# Inject CSS
if ($cssFiles) {
    $indexContent = $indexContent -replace '</head>', "  <link rel=`"stylesheet`" href=`"$($cssFiles.Name)`">`n</head>"
}

# Inject JS
$scriptTags = ""
if ($runtimeJs) { $scriptTags += "  <script src=`"$($runtimeJs.Name)`" type=`"module`"></script>`n" }
if ($polyfillsJs) { $scriptTags += "  <script src=`"$($polyfillsJs.Name)`" type=`"module`"></script>`n" }
if ($mainJs) { $scriptTags += "  <script src=`"$($mainJs.Name)`" type=`"module`"></script>`n" }

$indexContent = $indexContent -replace '</body>', "$scriptTags</body>"

# Write index.html
$indexContent | Out-File "$distDir\index.html" -Encoding utf8
Write-Host "✓ Created index.html" -ForegroundColor Green

# Copy favicon
Copy-Item "src\favicon.ico" "$distDir\favicon.ico" -ErrorAction SilentlyContinue
Write-Host "✓ Copied favicon.ico" -ForegroundColor Green

# Copy assets
Copy-Item -Recurse "src\assets" "$distDir\assets" -Force -ErrorAction SilentlyContinue
Write-Host "✓ Copied assets folder" -ForegroundColor Green

Write-Host "Build completed successfully!" -ForegroundColor Green
