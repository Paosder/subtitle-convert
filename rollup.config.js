import replace from 'rollup-plugin-replace';

export default {
  entry: 'lib/index.js',
  format: 'cjs',
  plugins: [
    replace({ 'process.browser': !!process.env.BROWSER }),
  ],
};
