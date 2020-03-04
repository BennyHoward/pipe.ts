const gulp = require('gulp');
const through = require('through2');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('build', () => {
  return gulp.src('./pipe.ts')
      .pipe(sourcemaps.init())
      .pipe(ts.createProject('./tsconfig.json')())
      .pipe(UMD_TRANSFORM)
      .pipe(sourcemaps.write('.', { includeContent: false }))
      .pipe(gulp.dest('./dist'));
});

// Hack because the TypeScript compiler doesn't provide a global fallback for UND modules
const UMD_TRANSFORM = through.obj(function (file, encoding, callback) {
  const fileName = file.path.split('/').splice(-1)[0];
  if (fileName === 'pipe.js') {
    const fileContents = file.contents.toString(encoding);
    file.contents = Buffer.from([
`(function (root, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
      var v = factory(require, exports);
      if (v !== undefined) module.exports = v;
  }
  else if (typeof define === "function" && define.amd) {
      define(["require", "exports"], factory);
  } else {
      const module = {exports: {}};
      const exports = module.exports;
      var v = factory(void 0, exports);
      if (v !== undefined) module.exports = v;
      root.pipe = module.exports.pipe;
  }
})(this, function (require, exports) {`,
      fileContents,
      '});',
    ].join('\n'), encoding);
  }
  callback(null, file);
});
