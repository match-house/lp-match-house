$port = 3456
$root = $PSScriptRoot

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.woff2'= 'font/woff2'
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$port"

while ($listener.IsListening) {
  try {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $res  = $ctx.Response

    $urlPath = $req.Url.LocalPath.TrimStart('/')
    if ($urlPath -eq '' -or $urlPath -eq '/') { $urlPath = 'index.html' }
    $filePath = Join-Path $root $urlPath

    Write-Host "$($req.HttpMethod) /$urlPath"

    if (Test-Path $filePath -PathType Leaf) {
      $ext   = [System.IO.Path]::GetExtension($filePath).ToLower()
      $mime  = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
      $bytes = [byte[]][System.IO.File]::ReadAllBytes($filePath)
      $len   = [long]$bytes.Length

      Write-Host "  -> $filePath | mime=$mime | len=$len"

      $res.StatusCode      = 200
      $res.ContentType     = $mime
      $res.KeepAlive       = $false
      $res.ContentLength64 = $len

      Write-Host "  -> ContentLength64 set to $($res.ContentLength64)"

      if ($req.HttpMethod -ne 'HEAD') {
        $res.OutputStream.Write($bytes, 0, [int]$len)
      }
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $res.StatusCode      = 404
      $res.ContentType     = 'text/plain'
      $res.KeepAlive       = $false
      $res.ContentLength64 = [long]$body.Length
      $res.OutputStream.Write($body, 0, $body.Length)
    }

    $res.OutputStream.Close()
  } catch {
    Write-Host "ERROR: $_"
    try { $ctx.Response.OutputStream.Close() } catch {}
  }
}
