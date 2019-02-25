// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
var path = require('path');

const TEST_REPORT_DIRNAME = 'testing/reports';
module.exports = function (config) {
  config.set({
    basePath: '',
    // Reliability settings to keep VSTS/CI happy
    captureTimeout: 60000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000,
    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', '@angular/cli', 'detectBrowsers'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-trx-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-detect-browsers'),
      require('@angular/cli/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    mime: {
      'text/x-typescript': ['ts'],
      'application/javascript': ['ts', 'tsx']
    },
    // detect browsers in env. during karma launch
    detectBrowsers: {
      enabled: true,
      usePhantomJS: true,
      // post processing of browsers list 
      // here you can edit the list of browsers used by karma 
      // **every browser in final browsersToTestWith needs corresponding launcher**
      postDetection: function (availableBrowser) {
        var browsersToTestWith = availableBrowser;

        //Prefer chrome over other browsers
        var chromeIndex = availableBrowser.indexOf('Chrome');
        var phantomIndex = availableBrowser.indexOf('PhantomJS');
        if (chromeIndex > -1) {
          // return chrome as the desired browser
          browsersToTestWith = [availableBrowser[chromeIndex]];
        } else {
          //otherwise fall back to PhantomJS
          if (availableBrowser.length > 1 && phantomIndex > -1) {
            browsersToTestWith = [availableBrowser[phantomIndex]];
          } else {
            //If no phantom then fail
            browsersToTestWith = [];
          }
        }
        return browsersToTestWith;
      }
    },
    coverageIstanbulReporter: {
      reports: ['text-summary', 'html', 'cobertura'],
      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name 
      dir: path.join(__dirname, TEST_REPORT_DIRNAME + '/coverage'),

      // if using webpack and pre-loaders, work around webpack breaking the source path 
      fixWebpackSourcePaths: true,

      // stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped` 
      skipFilesWithNoCoverage: true,

      // Most reporters accept additional config options. You can pass these through the `report-config` option 
      'report-config': {
        // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137 
        html: {
          // outputs the report in {TEST_REPORT_DIRNAME}/coverage/report-html 
          subdir: 'report-html'
        },
        cobertura: {
          // outputs the summary under {TEST_REPORT_DIRNAME}/coverage
          subdir: '.',
          file: 'cobertura-summary.xml'
        }
      }
    },

    // Test results reporter to use.
    // Possible values: 'dots', 'progress'.
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'trx', 'coverage-istanbul'],
    trxReporter: {
      //outputFile path begins at application root
      outputFile: TEST_REPORT_DIRNAME + '/test-results.trx',
      shortTestName: false
    },
    angularCli: {
      environment: 'dev'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
