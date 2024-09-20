const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Import the plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); 

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,  // Font file types
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',  // Output font files to the fonts folder in dist
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,  // Image files (JPG, PNG, etc.)
        type: 'asset/resource',  // Use asset/resource to bundle images
        generator: {
          filename: 'images/[name][ext]',  // Output images to the images folder in dist
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',  // Path to your HTML file
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/images', to: 'assets/images' },  // Copy images to dist/assets/images
        { from: 'src/assets/svgs', to: 'assets/svgs' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Replace 'contentBase' with 'static.directory'
    },
    hot: true,  // Enable hot module replacement (HMR)
    watchFiles: ['./src/**/*'],
    open: false, // Automatically open the browser
    port: 3000, // Set a port for the dev server
  },
};
