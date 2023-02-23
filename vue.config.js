//IMP: Fondamentale servire i file compressi almeno in gzip (sarebbe top servirli in broli )
const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = defineConfig({
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

  /* More info about preloadPlugin: https://github.com/vuejs/preload-webpack-plugin */

  chainWebpack(config) {
    config
      .plugin("preload")
      .use(PreloadWebpackPlugin, [
        {
          rel: "preload",
          include: "initial",
          fileBlacklist: [/\.map/, /\.whatever/, /\.js/, /\.css/],
          as(entry) {
            if (/\.css$/.test(entry)) return "style";
            if (/\.woff$/.test(entry)) return "font";
            if (/\.(png|jpg|jpeg|webp)$/.test(entry)) return "image";
            return "script";
          },
        },
      ])
      .after("html");

    /*     config
      .plugin("prefetch")
      .use(PreloadWebpackPlugin, [
        {
          rel: "prefetch",
          include: "initial"
        },
      ])
      .after("html"); */
  },
  configureWebpack: {
    plugins: [new CompressionPlugin()],
    optimization: {
      minimizer: [
        "...",
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.sharpMinify,
            options: {
              encodeOptions: {
                jpeg: {
                  // https://sharp.pixelplumbing.com/api-output#jpeg
                  quality: 100,
                },
                webp: {
                  // https://sharp.pixelplumbing.com/api-output#webp
                  lossless: true,
                },
                avif: {
                  // https://sharp.pixelplumbing.com/api-output#avif
                  lossless: true,
                },

                // png by default sets the quality to 100%, which is same as lossless
                // https://sharp.pixelplumbing.com/api-output#png
                png: {},

                // gif does not support lossless compression at all
                // https://sharp.pixelplumbing.com/api-output#gif
                gif: {},
              },
            },
          },
          generator: [
            {
              // You can apply generator using `?as=webp`, you can use any name and provide more options
              preset: "webp",
              implementation: ImageMinimizerPlugin.sharpGenerate,
              options: {
                encodeOptions: {
                  webp: {
                    lossless: true,
                    quality: 60,
                    alphaQuality: 80,
                    force: false,
                  },
                },
              },
            },
          ],
        }),
      ],
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
});
