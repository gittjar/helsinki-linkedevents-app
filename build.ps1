# Simple build and deploy script
Write-Host "Starting build process..." -ForegroundColor Green

# Step 1: Build Angular app
Write-Host "1. Building Angular app..." -ForegroundColor Yellow
ng build

# Step 2: Get the current build files to create correct index.html
$distDir = "dist\helsinki-linkedevents-app"
$jsFiles = Get-ChildItem "$distDir\*.js"
$cssFiles = Get-ChildItem "$distDir\*.css"

$runtimeJs = ($jsFiles | Where-Object { $_.Name -like "*runtime*" }).Name
$polyfillsJs = ($jsFiles | Where-Object { $_.Name -like "*polyfills*" }).Name
$mainJs = ($jsFiles | Where-Object { $_.Name -like "*main*" }).Name
$cssFile = $cssFiles[0].Name

Write-Host "Found files - CSS: $cssFile, Runtime: $runtimeJs, Polyfills: $polyfillsJs, Main: $mainJs" -ForegroundColor Cyan

# Step 3: Copy favicon
Write-Host "2. Copying favicon..." -ForegroundColor Yellow
Copy-Item "src\favicon.ico" "$distDir\favicon.ico" -Force
Write-Host "Copied favicon.ico" -ForegroundColor Green

# Step 4: Create index.html with correct file references
Write-Host "3. Creating index.html..." -ForegroundColor Yellow

# Create the HTML content
$htmlContent = @"
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
          mono: ["ui-monospace", "monospace"]
        }
      },
      corePlugins: {
        preflight: false
      }
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

# Write the HTML file
$htmlContent | Out-File "$distDir\index.html" -Encoding utf8 -Force
Write-Host "Created index.html with correct file references" -ForegroundColor Green

# Step 5: Show final files
Write-Host "4. Build completed. Files in dist:" -ForegroundColor Yellow
Get-ChildItem "$distDir" | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

Write-Host "Build process completed!" -ForegroundColor Green
Write-Host "Ready to deploy with: firebase deploy" -ForegroundColor Magenta
