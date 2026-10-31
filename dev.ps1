# Node is installed under AppData rather than on the system PATH, so put it
# there for this process before handing over to next dev.
$node = "$env:LOCALAPPDATA\Programs\nodejs"
if (Test-Path $node) { $env:PATH = "$node;$env:PATH" }
Set-Location $PSScriptRoot
& npm run dev
