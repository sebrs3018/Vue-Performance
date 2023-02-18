//IMP: Fondamentale servire i file compressi almeno in gzip (sarebbe top servirli in broli )
const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  pages: {
    index: {
      entry: "src/main.ts" /* js entry point */,
      template: "public/index.html" /* html template entry point */,
      filename: "index.html" /* output name of the file */,
      title: "My optimization page",
    },
    profile: {
      entry: "src/scripts/profile.ts" /* js entry point */,
      template: "public/profile.html" /* html template entry point */,
      filename: "profile.html" /* output name of the file */,
      title: "My profile",
    },
    coreVitals: {
      entry: "src/scripts/coreVitals.ts" /* js entry point */,
      template: "public/core-vitals.html" /* html template entry point */,
      filename: "core-vitals.html" /* output name of the file */,
      title: "Core Vitals",
    },
  },
  configureWebpack: {
    plugins: [new CompressionPlugin()],
    optimization: {
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
  },
  transpileDependencies: true,
  lintOnSave: false,
};
