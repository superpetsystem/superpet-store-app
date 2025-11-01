const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appName = 'SuperPet Portal';
const desktopPath = path.join(process.env.USERPROFILE, 'Desktop');
const shortcutPath = path.join(desktopPath, `${appName}.lnk`);
const exePath = path.join(__dirname, '..', 'release', 'win-unpacked', `${appName}.exe`);

// Verifica se o executável existe
if (!fs.existsSync(exePath)) {
  console.error(`❌ Executável não encontrado em: ${exePath}`);
  console.log('\n💡 Execute primeiro: npm run build:win');
  process.exit(1);
}

// Cria o script PowerShell para criar o atalho
const psScript = `
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("${shortcutPath}")
$Shortcut.TargetPath = "${exePath}"
$Shortcut.WorkingDirectory = "${path.dirname(exePath)}"
$Shortcut.IconLocation = "${exePath},0"
$Shortcut.Description = "SuperPet Portal - Portal da Loja"
$Shortcut.Save()
Write-Host "Atalho criado com sucesso!"
`;

try {
  // Executa o script PowerShell
  execSync(`powershell.exe -Command "${psScript.replace(/"/g, '\\"')}"`, {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log(`\n✅ Atalho criado com sucesso na área de trabalho!`);
  console.log(`📁 Localização: ${shortcutPath}`);
} catch (error) {
  console.error('❌ Erro ao criar atalho:', error.message);
  process.exit(1);
}

