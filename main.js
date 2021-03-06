const path = require('path');
const gulp = require('gulp');
const gulpWatch = require('gulp-watch');
const less = require('gulp-less');
const rename = require('gulp-rename');

const RUN_ACTIONS = ['build', 'watch']

let CONFIG = require('./conf.base');

try {
  CONFIG = require(path.resolve('./conf.lil'));
} catch (err) {
  console.log('\nIf you need custom setting, make conf.lil.js under you project root folder .\n');
}

const styles = CONFIG.dirs.map(item => {
  item.fn = () => {
    console.log('building ...')
    gulp.src(item.src)
      .pipe(less(CONFIG.options))
      .pipe(rename({
        extname: ".wxss"
      }))
      .pipe(gulp.dest(item.dist));
  }
  return item
});

function compile () {
  styles.forEach(item => item.fn())
}

gulp.task('build', compile);

function watch () {
  console.log('\nwatching ... \n')
  styles.forEach(item => {
    gulpWatch(item.src, item.fn);
  });
}

function runLil (action) {
  if (!~RUN_ACTIONS.indexOf(action)) {
    return console.error(`\nMust run action with ${RUN_ACTIONS.join('|')}, but used ${action} .\n`);
  }
  switch (action) {
    case 'build':
      compile();
      break;
    case 'watch':
      watch();
      break;
  }
}

module.exports = runLil;
