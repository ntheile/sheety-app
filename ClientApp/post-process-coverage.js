
/**
 * Runs additional post processing on coverage html files to display correctly in VSTS coverage view.
 * Transforms coverage/report-html index.html to use inline css styles
 * Runs post vstsTest.
 */
const fs = require("fs"),
path = require("path"),
inline = require("inline-css"),
chalk = require('chalk')
log = console.log,
recursereaddir = require("recursive-readdir");

const CODE_COVERAGE_DIRECTORY = "./testing/reports/coverage/report-html";
log(chalk.blue('[at post-process-coverage] Begin inline-css transform for coverage html'));

recursereaddir(CODE_COVERAGE_DIRECTORY, (err, files) => {
if (err) { throw new Error(err); }
let reports = files.filter((report) => {
	return report.endsWith(".html");
});
reports.forEach((filePath) => {
	let options = {
		url: "file://" + path.resolve(filePath),
		extraCss: ".pad1 { padding: 0; }"
	};
	fs.readFile(path.resolve(filePath), (err, data) => {
		inline(data, options)
			.then((html) => {
				let outputFile = filePath;
				fs.writeFile(outputFile, html, (err) => {
					if (err) { throw err; } else {
						log(chalk.green('[at post-process-coverage] Wrote to file at:' + outputFile));
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
	});
});
});