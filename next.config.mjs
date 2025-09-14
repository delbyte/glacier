import withBundleAnalyzer from '@next/bundle-analyzer';
import os from 'os';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Updated experimental flags for Next.js 15
  experimental: {
    webpackBuildWorker: true,
    // Disabled optimizePackageImports - causing import resolution issues
    // optimizePackageImports: [
    //   'lucide-react', 
    //   'date-fns', 
    //   '@wagmi/core', 
    //   '@rainbow-me/rainbowkit',
    //   '@radix-ui/react-alert-dialog',
    //   '@radix-ui/react-button',
    //   '@radix-ui/react-card',
    //   'clsx',
    //   'tailwind-merge',
    //   'framer-motion'
    // ],
    // Enable parallel builds
    cpus: os.cpus().length,
  },
  
  // Modern Turbopack configuration
  turbopack: {},
  
  // Moved from experimental in Next.js 15
  serverExternalPackages: ['canvas', 'jsdom', 'cobe'],
  
  webpack: (config, { dev, isServer, webpack }) => {
    // EXTREME performance optimizations for development
    if (dev) {
      // Disable source maps completely for speed
      config.devtool = false;
      
      // Most aggressive caching
      config.cache = {
        type: 'filesystem',
        cacheDirectory: '.next/cache/webpack',
        buildDependencies: {
          config: [import.meta.url],
        },
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        compression: 'gzip',
      };
      
      // Disable ALL optimizations in dev for speed
      config.optimization = {
        minimize: false,
        minimizer: [],
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        usedExports: false,
        sideEffects: false,
        providedExports: false,
        flagIncludedChunks: false,
        occurrenceOrder: false,
        concatenateModules: false,
        innerGraph: false,
        mangleExports: false,
        portableRecords: false,
        realContentHash: false,
      };

      // Speed up module resolution
      config.resolve.symlinks = false;
      config.resolve.cacheWithContext = false;
      
      // Faster file watching
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
        aggregateTimeout: 100,
        poll: false,
      };

      // Use faster snapshot options
      config.snapshot = {
        managedPaths: [path.resolve('node_modules')],
        immutablePaths: [],
        buildDependencies: {
          hash: true,
          timestamp: false,
        },
        module: {
          timestamp: false,
          hash: true,
        },
        resolve: {
          timestamp: false,
          hash: true,
        },
        resolveBuildDependencies: {
          hash: true,
          timestamp: false,
        },
      };
    }

    // Replace babel with esbuild for 10x faster transpilation
    const jsRule = config.module.rules.find(rule => 
      rule.test && rule.test.toString().includes('js|jsx|ts|tsx')
    );
    
    if (jsRule) {
      jsRule.use = [
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2020',
            jsx: 'automatic',
          },
        },
      ];
    }

    // Aggressive chunk splitting for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000,
        maxSize: 200000,
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 30,
            chunks: 'all',
            enforce: true,
          },
          web3: {
            test: /[\\/]node_modules[\\/](wagmi|viem|@rainbow-me|@tanstack|@wagmi)[\\/]/,
            name: 'web3',
            priority: 20,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|@radix-ui|clsx|tailwind-merge|framer-motion)[\\/]/,
            name: 'ui',
            priority: 15,
            chunks: 'all',
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          common: {
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Module resolution optimizations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      path: false,
      stream: false,
      util: false,
      url: false,
      buffer: false,
    };

    // Tree shaking optimizations
    config.optimization.usedExports = !dev;
    config.optimization.providedExports = !dev;
    config.optimization.sideEffects = false;

    // Ignore source maps and development files
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Critical dependency: the request of a dependency is an expression/,
    ];

    return config;
  },
  
  // Reduce JavaScript bundle size with modular imports (disabled for stability)
  // modularizeImports: {
  //   'lucide-react': {
  //     transform: 'lucide-react/dist/esm/icons/{{member}}',
  //     skipDefaultConversion: true,
  //   },
  //   '@radix-ui/react-icons': {
  //     transform: '@radix-ui/react-icons/dist/{{member}}',
  //   },
  // },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
  
  // Output optimization
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: false,
  
  // Compression
  compress: !process.env.NODE_ENV === 'development',
  
  // Disable x-powered-by header
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
    },
  ],
};

// Bundle analyzer (use ANALYZE=true npm run build to analyze)
export default process.env.ANALYZE === 'true' 
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;
