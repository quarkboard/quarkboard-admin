const version = require('./package.json').version;

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Quarkboard Admin'
    }
  },
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      definitions[0]['process.env']['PACKAGE_VERSION'] = JSON.stringify(require('./package.json').version);
      return definitions;
    });
  },
};
