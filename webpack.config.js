const path = require('path');

const configs = [
    'vanilla',
    'bootstrap',
    'popper',
    'popper-bootstrap',
];

module.exports = configs.map((name) => ({
    mode: 'production',
    entry: `./src/build/build.${name}.ts`,
    output: {
        path: path.resolve( __dirname, 'bundles' ),
        filename: `flyter.${name}.min.js`,
    },

    resolve: {
        extensions: ['.ts'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                declaration: false,
                                module: "CommonJS",
                                sourceMap: false,  
                                outDir: './bundles'
                            }                      
                        }
                    }
                ]                
            }
        ]
    }
}));