// PM2 Ecosystem Configuration for Portfoilos Frontend (Next.js)
// Usage:
//   pm2 start ecosystem.config.js --env production
//   pm2 save
//   pm2 startup   (run the printed command to enable auto-start on reboot)

module.exports = {
  apps: [
    {
      name: 'portfoilos-frontend',
      cwd: '/home/portfoilos/portfoilos/templates/template_1_malakparites',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,          // Single instance; use 'max' if you want cluster mode
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3050,
      },
      error_file:  '/var/log/portfoilos/nextjs-error.log',
      out_file:    '/var/log/portfoilos/nextjs-out.log',
      merge_logs:  true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
