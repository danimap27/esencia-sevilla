// PM2 — arranque y auto-reinicio de Esencia Sevilla en el VPS
// Uso: pm2 start ecosystem.config.js && pm2 save
module.exports = {
  apps: [
    {
      name: 'esencia-sevilla',
      script: 'npx',
      args: 'next start -p 3010',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
      },
    },
  ],
};
