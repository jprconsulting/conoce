const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/api', proxy({
        target: 'https://localhost:44381/api',
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }));
};
