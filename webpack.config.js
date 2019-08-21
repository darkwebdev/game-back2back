module.exports = {
    mode: 'development',
    output: {
        publicPath: 'assets'
    },
    module: {
        rules: []
    },
    devtool: 'source-map',
    devServer: {
        contentBase: '.',
        liveReload: true,
        open: true,
        port: 9000,
        writeToDisk: true
    }
};
