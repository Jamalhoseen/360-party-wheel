Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("C:\Users\Jamal Hoseen\360-party-wheel\assets\img\logo-real.png")
$corner = $bmp.GetPixel(5,5)
$center = $bmp.GetPixel([int]($bmp.Width/2), [int]($bmp.Height/2))
Write-Host "Corner (5,5): A=$($corner.A) R=$($corner.R) G=$($corner.G) B=$($corner.B)"
Write-Host "Center: A=$($center.A) R=$($center.R) G=$($center.G) B=$($center.B)"
$bmp.Dispose()
