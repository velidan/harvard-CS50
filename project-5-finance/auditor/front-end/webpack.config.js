const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

module.exports = {
  entry: {
    app: [path.resolve(__dirname, './src/index.js'),],
    styles: [path.resolve(__dirname, './styles/style.scss')]
  }, 
  output: {
    filename: '[name].js',  
    path: path.resolve(__dirname, '../static'), 
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      '@appSrc': path.resolve(__dirname, 'src/'),
      '@appComponents': path.resolve(__dirname, 'src/components/'),
      '@appCore': path.resolve(__dirname, 'src/core/'),
      '@appHocs': path.resolve(__dirname, 'src/hocs/'),
      '@appUtils': path.resolve(__dirname, 'src/utils/'),
      '@appHooks': path.resolve(__dirname, 'src/hooks/'),
    },
  },
  
  module: {
    rules: [
      {
        test: /\.jpe?g|png$/,
        exclude: /node_modules/,
        use: ["url-loader", "file-loader"]
    },
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
    },
      {
        test: /\.(css|scss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
  ],
};