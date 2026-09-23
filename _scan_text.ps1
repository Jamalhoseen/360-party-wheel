Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("C:\Users\Jamal Hoseen\360-party-wheel\assets\img\logo-real.png")
$w = $bmp.Width
$h = $bmp.Height
$cx = $w / 2.0
$cy = $h / 2.0

$minR = [double]::MaxValue
$maxR = [double]::MinValue
$minAngle = [double]::MaxValue
$maxAngle = [double]::MinValue
$count = 0

for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $px = $bmp.GetPixel($x, $y)
    if ($px.A -lt 100) { continue }
    if ($px.R -gt 190 -and $px.G -gt 190 -and $px.B -gt 190) {
      $dx = $x - $cx
      $dy = $y - $cy
      $r = [Math]::Sqrt($dx*$dx + $dy*$dy)
      # only consider outer band (ring text + ring border), exclude inner wordmark area
      if ($r -gt 280 -and $r -lt 390) {
        $angle = [Math]::Atan2($dy, $dx) * 180 / [Math]::PI
        if ($r -lt $minR) { $minR = $r }
        if ($r -gt $maxR) { $maxR = $r }
        if ($angle -lt $minAngle) { $minAngle = $angle }
        if ($angle -gt $maxAngle) { $maxAngle = $angle }
        $count++
      }
    }
  }
}
Write-Host "count=$count minR=$minR maxR=$maxR minAngle=$minAngle maxAngle=$maxAngle"
$bmp.Dispose()
