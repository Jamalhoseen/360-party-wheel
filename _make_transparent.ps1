Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Jamal Hoseen\360-party-wheel\assets\img\logo-original.png"
$dst = "C:\Users\Jamal Hoseen\360-party-wheel\assets\img\logo-real.png"

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$w = $bmp.Width
$h = $bmp.Height

$cx = $w / 2.0
$cy = $h / 2.0
$radius = [Math]::Min($w, $h) / 2.0

$out = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $dx = $x - $cx
    $dy = $y - $cy
    $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
    $px = $bmp.GetPixel($x, $y)
    if ($dist -gt $radius) {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $px.R, $px.G, $px.B))
    } elseif ($dist -gt ($radius - 2)) {
      # 2px antialiased edge feather
      $t = $radius - $dist
      $alpha = [Math]::Round(($t / 2.0) * 255)
      if ($alpha -lt 0) { $alpha = 0 }
      if ($alpha -gt 255) { $alpha = 255 }
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb([int]$alpha, $px.R, $px.G, $px.B))
    } else {
      $out.SetPixel($x, $y, $px)
    }
  }
}

$out.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$out.Dispose()
Write-Host "Saved $dst ($w x $h)"
