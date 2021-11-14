module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-css-variables'),
        require('postcss-nested'),
        require('cssnano')({ preset: 'default' })
    ]
};
