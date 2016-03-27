module.exports = function() {
    
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];
    
    var config = {
        index: 'index.html',
        client: '',
        js: [
            './js/**/*.js',
            '!' + './js/**/*.spec.js'
        ],
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
        browserReloadDelay: 1000,
        /**
         * Test Information
         */
        tests: './tests/',
        specRunner: './tests/specrunner.html',
        specs: ['./js/**/*.spec.js'],
        testlibraries: [
            './bower_components/jasmine-core/lib/jasmine-core/jasmine-html.js',
            './bower_components/jasmine-core/lib/jasmine-core/boot.js',
            './node_modules/jasmine-jquery/lib/jasmine-jquery.js'
        ],
    };
    
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        
        return options;
    };
    
    config.karma = getKarmaOptions();
    
    return config;
    
    //////////////////
    
    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                './bower_components/jasmine-core/lib/jasmine-core/jasmine-html.js',
                './bower_components/jasmine-core/lib/jasmine-core/boot.js'
            ),
            exclude: [],
        };

        return options;
    }
    
};