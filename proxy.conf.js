const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use('/api', proxy({
        target: 'https://conocelosprueba.bsite.net',
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }));
};
