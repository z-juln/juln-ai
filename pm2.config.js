module.exports = {
  apps: [
    {
      name: 'juln-ai',
      script: 'ts-node',
      args: 'src/index.ts',
      watch: false,
      exec_mode: 'cluster',
      instances: 1,
    },
  ],
};
