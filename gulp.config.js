module.exports = function() {
    
    var config = {
        index: 'index.html',
        client: '',
        js: ['./js/**/*.js'],
        // bower and npm locations
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        /**
         * Node settings
         */
        defaultPort: 8888,
        nodeServer: 'index.js',
        browserReloadDelay: 1000
    };
    
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        
        return options;
    };
    
    return config;
};