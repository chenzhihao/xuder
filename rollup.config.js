// Rollup plugins
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'build/xuder.js',
  format: 'iife',
  moduleName: 'xuder',
  sourceMap: 'inline',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};