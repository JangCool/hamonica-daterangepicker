const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
    mode:"production",
    output:{
       path: path.resolve(__dirname, "dist"),
       filename: "[name].js",
       publicPath: "/",
       library: "hamonica",
       libraryTarget: "umd",
    //    globalObject: 'this'
    },
    module: {
       rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /.s?css$/,
                use: [          
                    MiniCssExtractPlugin.loader, 
                    'css-loader'
                    // 'sass-loader'
                ]       
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename :"[name].css"
       })
    ]
 }