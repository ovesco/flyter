const path = require('path');

const tsConfigNoTypes = { declaration: false };
const configs = [
    { name: 'vanilla', compilerOptions: tsConfigNoTypes },
    { name: 'bootstrap', compilerOptions: tsConfigNoTypes },
    { name: 'popper', compilerOptions: tsConfigNoTypes },
    { name: 'popper-bootstrap', compilerOptions: {} }
];

module.exports = configs.map(({ name, compilerOptions }) => ({
    mode: 'production',
    entry: `./src/build/build.${name}.ts`,
    output: {
        path: path.resolve( __dirname, 'dist' ),
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
                            compilerOptions,
                        }
                    }
                ]                
            }
        ]
    }
}));