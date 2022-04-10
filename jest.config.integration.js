const esModules = ['true-myth'].join('|');

module.exports = {
  // SWC is much faster than ts-node
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc-node/jest',
      {
        target: 'es2020',
        module: 'commonjs',
        esModuleInterop: true,
        dynamicImport: false,
      },
    ],
  },
  testEnvironment: 'node',
  testRegex: '.*\\.itest\\.ts$',
  // Ignore everything, except for ES modules which need transforming
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
};
