const fs = require('fs');
const path = require('path');
const mix = require('laravel-mix');
const fontawesomeSubset = require('fontawesome-subset');

// icons to be used
let icons = [
    'check', 'square', 'caret-up',
];

let config = {
    outputBase: 'dist',
    reducedFontPath: 'src/sass/fonts',
    publicFontPath: '/fonts',
    publicCssPath: 'css/icons.css',
};


// reduce fonts
rimraf(config.reducedFontPath, { recursive: true });
fontawesomeSubset(icons, config.reducedFontPath);
mix.copyDirectory(config.reducedFontPath, path.resolve([config.outputBase, config.publicFontPath].join(path.sep)));


/** sass **/
(function (icons) { // create a scss file override variables
    let scssIcons = icons.map(name => `${name}: $fa-var-${name}`).join(',');
    fs.writeFileSync('src/sass/_icon_generated.scss', `$icons: (${scssIcons});`, (err) => {
        if (err) throw err;
    });
})(icons || []);

mix.sass('src/sass/icons.scss', path.resolve([config.outputBase, config.publicCssPath].join(path.sep)), {
    prependData: `$fa-font-path: "${config.publicFontPath}";`,
});


// options
mix.setPublicPath(config.outputBase);
mix.copyDirectory('public', config.outputBase);
mix.options({
    processCssUrls: false,
})


/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}