module.exports = {
  apps: [
    {
      name: 'juln-ai',
      script: 'ts-node',
      args: 'src/index.ts',
      cwd: './',
      watch: false,
      exec_mode: 'cluster',
      instances: 1,
      out_file: './logs/out.log',
      error_file: './logs/err.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
