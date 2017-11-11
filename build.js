const fs         = require('fs')
const path       = require('path')
const browserify = require('browserify')

let b = browserify('./src/index.js', {standalone: 'select'})
  .transform('babelify', {presets:['es2015']})
  .transform('uglifyify', {global: true})
  .bundle()
  .pipe(fs.createWriteStream(path.join(__dirname,
                            'dist',
                            'select-from.js'
                            )))