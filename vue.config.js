module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "theBigVendors",
            chunks: "all",
          },
        },
      },
    },
  },

  transpileDependencies: true,
  lintOnSave: false,
};
