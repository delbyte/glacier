// webpack.config.js - Additional optimizations for development
const path = require('path');

module.exports = {
  resolve: {
    // Speed up module resolution
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '.'),
      '~': path.resolve(__dirname, '.'),
    },
    // Reduce filesystem checks
    symlinks: false,
    cacheWithContext: false,
  },
  
  // Development optimizations
  optimization: {
    // Disable optimizations in development for speed
    minimize: process.env.NODE_ENV === 'production',
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: process.env.NODE_ENV === 'production' ? {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    } : false,
  },

  // Cache configuration for faster builds
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
    buildDependencies: {
      config: [__filename],
    },
  },

  // Performance hints
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: 250000,
    maxAssetSize: 250000,
  },

  // Ignore source maps in development for speed
  devtool: process.env.NODE_ENV === 'development' ? false : 'source-map',

  // Module rules for faster transpilation
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2020',
            jsx: 'automatic',
          },
        },
      },
    ],
  },

  // Watch options for faster rebuilds
  watchOptions: {
    ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
    aggregateTimeout: 100,
    poll: false,
  },
};