// Conversion to ESM using this handy article
// https://dev.to/gerryleonugroho/gulp-in-2025-a-practical-guide-to-automating-your-vanilla-web-projects-without-the-framework-fuss-62n

import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;
import size from 'gulp-size';
import noop from 'gulp-noop';
import lesshint from 'gulp-lesshint';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { deleteAsync } from 'del';

const

  // development or production
  isProd = (process.env.NODE_ENV || 'development').trim().toLowerCase() === 'production',

  // directory locations
  paths = {
    styles: {
      src: 'src/less/*.less',
      watch: 'src/less/**/*.less',
      dest: 'resources/css'
    }
  };





// Clean dist folder
export function clean() {
  return deleteAsync(["resources/css/*", "!resources/css"]);
}





/**
 * STYLING
 */

// configuration options
const cssConfig = {
  src: paths.styles.src,
  watch: paths.styles.watch,
  dest: paths.styles.dest,
  postCSS: [autoprefixer(), cssnano()]
};

// linter
export function stylesLint() {
  console.log("Linting…");
  return src(cssConfig.src)
    .pipe(lesshint({
      configPath: '/'
     }))
    .pipe(lesshint.reporter()) // Leave empty to use the default, 'stylish'
    .pipe(lesshint.failOnError()); // Use this to fail the task on lint errors
}

// transformation
export function styles() {
  console.log("Compiling…");
  return src(cssConfig.src)
    .pipe(!isProd ? sourcemaps.init() : noop())
    .pipe(less())
    .pipe(postcss(cssConfig.postCSS))
    .pipe(cleanCSS({debug: true}))
    .pipe(!isProd ? sourcemaps.write() : noop())
    .pipe(size({ showFiles:true }))
    .pipe(dest(cssConfig.dest))
    // .pipe(!isProd ? browserSync.reload({ stream: true }) : noop());
    .pipe(!isProd ? browserSync.stream() : noop());
}





/**
 * BROWSER SYNCHRONIZATION
 */

// configuration options
// const syncConfig = {
//   server: {
//     baseDir: './CV/',
//     index: 'index.php'
//   },
//   port: 8888,
//   open: false
// };

// browser-sync
export function serve() {
  if (isProd) return;

  // browserSync.init(syncConfig);

  browserSync.init({
    server: {
      baseDir: paths.styles.dest,
    },
    port: 8888,
    open: false
  });

  watch(paths.styles.src, series(stylesLint, styles));
}

// watch
// function watchTask() {
//   watch(
//     [cssConfig.watch],
//     series(stylesLint, styles)
//   );
// }





export const build = series(
  clean,
  series(stylesLint, styles)
);

export default series(build, serve);
