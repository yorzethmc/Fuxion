const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT_VISOR = 3000;

const apps = [
  { path: 'RANGO_1_ECONOMICO/CATEGORIA_A_BASICO', cmd: 'npx.cmd', args: ['-y', 'http-server', '.', '-p', '8081', '-c-1', '--cors'] },
  { path: 'RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO', cmd: 'npx.cmd', args: ['-y', 'http-server', '.', '-p', '8082', '-c-1', '--cors'] },
  { path: 'RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL', cmd: 'npx.cmd', args: ['-y', 'http-server', '.', '-p', '8083', '-c-1', '--cors'] },
  { path: 'RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO', cmd: 'npm.cmd', args: ['run', 'dev', '--', '--port', '8084', '--strictPort'] },
  { path: 'RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP', cmd: 'npm.cmd', args: ['run', 'dev', '--', '--port', '8085', '--strictPort'] },
  { path: 'RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA', cmd: 'npm.cmd', args: ['run', 'dev', '--', '--port', '8086', '--strictPort'] },
  { path: 'RANGO_3_PREMIUM/CATEGORIA_A_AUTOR', cmd: 'npm.cmd', args: ['run', 'dev', '--', '--port', '8087', '--strictPort'] }
];

const children = [];

console.log('Iniciando servidores en segundo plano...');

apps.forEach(app => {
  const cwd = path.join(__dirname, app.path);
  if (!fs.existsSync(cwd)) return;

  const child = spawn(app.cmd, app.args, { cwd, shell: true });
  
  child.on('error', (err) => {
    console.error(`Error al iniciar ${app.path}:`, err);
  });
  
  children.push(child);
});

// Limpieza al cerrar
function cleanup() {
  console.log('Cerrando servidores...');
  children.forEach(child => {
    try {
      spawn('taskkill', ['/pid', child.pid, '/f', '/t']);
    } catch (e) {}
  });
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Servir visor.html
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'visor.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error cargando visor.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT_VISOR, () => {
  console.log(`Visor General corriendo en http://localhost:${PORT_VISOR}`);
  console.log('Presiona Ctrl+C en esta ventana para cerrar todos los servidores.');
  
  // Abrir en el navegador por defecto
  const startCmd = process.platform === 'win32' ? 'start' : (process.platform === 'darwin' ? 'open' : 'xdg-open');
  spawn(startCmd, [`http://localhost:${PORT_VISOR}`], { shell: true });
});
