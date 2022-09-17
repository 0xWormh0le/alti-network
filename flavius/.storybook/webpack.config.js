const resolve = require('path').resolve

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss?modules'],
        include: resolve(__dirname, '../')
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loaders: ['file'],
        include: resolve(__dirname, '../')
      }
    ]
  }
}
