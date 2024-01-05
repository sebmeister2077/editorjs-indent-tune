const path = require('path')

module.exports = {
    mode: 'development', // Change to 'production' for production build
    entry: './src/index.ts', // Entry file for your TypeScript code
    output: {
        filename: 'bundle.js', // Output bundle file name
        path: path.resolve(__dirname, 'dist'), // Output directory path
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'], // File extensions to resolve
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader', // Use ts-loader for TypeScript files
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
}
