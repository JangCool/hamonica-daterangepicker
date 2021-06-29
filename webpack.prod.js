const path = require('path')
// webpack-merge 플러그인 추가
const { merge } = require('webpack-merge');
// webpack 공통 설정 추가 
const common = require('./webpack.common.js')
// clean-webpack-plugin 추가 
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // installed via npm
const TerserJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = [
    merge(common, {
        entry: {
            "daterangepicker": path.resolve(__dirname, 'src/js/HamonicaDateRangePicker.js'),
        },
        // 웹팩 빌드를 시작할 때 dist폴더를 비우도록 설정
        plugins: [
            new CleanWebpackPlugin(),
        ],
        optimization: {
            minimize: false
        }
    }),
    merge(common, {
        entry: {
            "daterangepicker.min": path.resolve(__dirname, 'src/js/HamonicaDateRangePicker.js'),
        },
        optimization: {
            minimizer: [
                new TerserJSPlugin(),
                new CssMinimizerPlugin(),
            ]
        },
    })
]