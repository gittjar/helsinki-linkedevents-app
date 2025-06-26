# Complete build and deploy script
Write-Host "Starting complete build and deploy process..." -ForegroundColor Green

# Step 1: Clean and build
Write-Host "1. Building Angular app..." -ForegroundColor Yellow
ng build

# Step 2: Get the current build files to update index.html
$distDir = "dist\helsinki-linkedevents-app"
$jsFiles = Get-ChildItem "$distDir\*.js"
$cssFiles = Get-ChildItem "$distDir\*.css"

$runtimeJs = ($jsFiles | Where-Object { $_.Name -like "*runtime*" }).Name
$polyfillsJs = ($jsFiles | Where-Object { $_.Name -like "*polyfills*" }).Name
$mainJs = ($jsFiles | Where-Object { $_.Name -like "*main*" }).Name
$cssFile = $cssFiles[0].Name

Write-Host "Found files: Runtime: $runtimeJs, Polyfills: $polyfillsJs, Main: $mainJs, CSS: $cssFile" -ForegroundColor Cyan

# Step 3: Create index.html with correct file references
Write-Host "2. Creating index.html..." -ForegroundColor Yellow
$indexContent = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Helsinki Linked Events App - 2025</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBwEUE1PoDf9nKebcZuMxSBwFZJi_ECPsY" defer></script>
  <script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-elements/dist/css/tw-elements.min.css" />
  <script src="https://cdn.tailwindcss.com/3.3.0"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        fontFamily: {
          sans: ["Roboto", "sans-serif"],
          body: ["Roboto", "sans-serif"],
          mono: ["ui-monospace", "monospace"],
        },
      },
      corePlugins: {
        preflight: false,
      },
    };
  </script>
  <link rel="stylesheet" href="$cssFile">
</head>
<body>
  <app-root></app-root>
  <script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/tw-elements.umd.min.js"></script>
  <script src="$runtimeJs" type="module"></script>
  <script src="$polyfillsJs" type="module"></script>
  <script src="$mainJs" type="module"></script>
</body>
</html>
"@

$indexContent | Out-File "$distDir\index.html" -Encoding utf8
Write-Host "✓ Created index.html with correct file references" -ForegroundColor Green

# Step 4: Copy favicon
Write-Host "3. Copying favicon..." -ForegroundColor Yellow
Copy-Item "src\favicon.ico" "$distDir\favicon.ico" -Force
Write-Host "✓ Copied favicon.ico" -ForegroundColor Green

# Step 5: Clean existing assets and copy fresh
Write-Host "4. Copying assets..." -ForegroundColor Yellow
if (Test-Path "$distDir\assets") {
    Remove-Item "$distDir\assets" -Recurse -Force
}
Copy-Item -Recurse "src\assets" "$distDir\assets" -Force
Write-Host "✓ Copied assets folder" -ForegroundColor Green

# Step 6: Verify carousel images
Write-Host "5. Verifying carousel images..." -ForegroundColor Yellow
$carouselImages = Get-ChildItem "$distDir\assets\carousel-images\*.jpeg"
Write-Host "Found $($carouselImages.Count) carousel images:" -ForegroundColor Cyan
$carouselImages | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

# Step 7: List final dist structure
Write-Host "6. Final dist structure:" -ForegroundColor Yellow
Write-Host "Root files:" -ForegroundColor Cyan
Get-ChildItem "$distDir" -File | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
Write-Host "Assets:" -ForegroundColor Cyan
Get-ChildItem "$distDir\assets" | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

# Step 8: Deploy
Write-Host "7. Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --force

Write-Host "✅ Build and deploy completed!" -ForegroundColor Green
Write-Host "🌐 Your app should be available at: https://helsinki.web.app" -ForegroundColor Magenta
Write-Host "🖼️  Test carousel images directly at:" -ForegroundColor Magenta
Write-Host "   https://helsinki.web.app/assets/carousel-images/helsinki-city-image001.jpeg" -ForegroundColor Gray
