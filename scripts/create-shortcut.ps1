# Script PowerShell para criar atalho na área de trabalho
param(
    [string]$ExePath = ".\release\win-unpacked\SuperPet Painel.exe",
    [string]$AppName = "SuperPet Painel"
)

$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "$AppName.lk"

# Verifica se o executável existe
if (-not (Test-Path $ExePath)) {
    Write-Host "❌ Executável não encontrado em: $ExePath" -ForegroundColor Red
    Write-Host "`n💡 Execute primeiro: npm run build:win" -ForegroundColor Yellow
    exit 1
}

# Cria o atalho
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = (Resolve-Path $ExePath).Path
$Shortcut.WorkingDirectory = Split-Path -Parent $Shortcut.TargetPath
$Shortcut.IconLocation = "$($Shortcut.TargetPath),0"
$Shortcut.Description = "SuperPet Painel - Painel da Loja"
$Shortcut.Save()

Write-Host "✅ Atalho criado com sucesso na área de trabalho!" -ForegroundColor Green
Write-Host "📁 Localização: $ShortcutPath" -ForegroundColor Cyan

