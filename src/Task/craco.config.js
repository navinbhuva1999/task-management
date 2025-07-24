module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source maps
      webpackConfig.devtool = false;
      return webpackConfig;
    }
  },
}; 