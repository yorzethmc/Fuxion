const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT_VISOR = 3000;

const servers = [
    { dir: 'RANGO_1_ECONOMICO/CATEGORIA_A_BASICO', port: 8081, type: 'static' },
    { dir: 'RANGO_1_ECONOMICO/CATEGORIA_B_QR_PRO', port: 8082, type: 'static' },
    { dir: 'RANGO_1_ECONOMICO/CATEGORIA_C_AUTOADMINISTRABLE_MANUAL', port: 8083, type: 'static' },
    { dir: 'RANGO_2_PROFESIONAL/CATEGORIA_A_ESTETICO', port: 8084, type: 'react' },
    { dir: 'RANGO_2_PROFESIONAL/CATEGORIA_B_PRE_PEDIDO_WHATSAPP', port: 8085, type: 'react' },
    { dir: 'RANGO_2_PROFESIONAL/CATEGORIA_C_COMBO_MARCA', port: 8086, type: 'react' },
    { dir: 'RANGO_3_PREMIUM/CATEGORIA_A_AUTOR', port: 8087, type: 'react' },
    { dir: 'RANGO_3_PREMIUM/CATEGORIA_B_ECOMMERCE_GOURMET', port: 8088, type: 'react' },
    { dir: 'RANGO_3_PREMIUM/CATEGORIA_C_SAAS_CLOUD_KITCHEN', port: 8089, type: 'react' }
];

const apps = servers.map(s => ({
  path: s.dir,
  cmd: s.type === 'static' ? 'npx.cmd' : 'npm.cmd',
  args: s.type === 'static' 
    ? ['-y', 'http-server', '.', '-p', s.port.toString(), '-c-1', '--cors'] 
    : ['run', 'dev', '--', '--port', s.port.toString(), '--strictPort']
}));

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
