// Conversion to ESM using this handy article
// https://dev.to/gerryleonugroho/gulp-in-2025-a-practical-guide-to-automating-your-vanilla-web-projects-without-the-framework-fuss-62n

import { src, dest, watch, series, parallel } from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import sassLint from "gulp-sass-lint";
import noop from 'gulp-noop';
import size from 'gulp-size';
import sourcemaps from "gulp-sourcemaps";
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browserSyncLib from "browser-sync";
import cssnano from 'cssnano';
import { deleteAsync } from "del";

const sass = gulpSass(dartSass);
const browserSync = browserSyncLib.create();

// development or production
const isProd = (process.env.NODE_ENV || 'development').trim().toLowerCase() === 'production';

// Paths
const paths = {
  styles: {
    src: 'src/scss/*.scss',
    watch: 'src/scss/**/*.scss',
    dest: "resources/css/",
  },
};

// Clean resources/css
export function stylesClean() {
  return deleteAsync(paths.styles.dest);
}

// lint SCSS files
export function stylesLint() {
  return src(paths.styles.src)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError()); // Use this to fail the task on lint errors
};

// Compile and minify SCSS files
export function styles() {
  return src(paths.styles.src)
    .pipe(!isProd ? sourcemaps.init() : noop())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(!isProd ? sourcemaps.write() : noop())
    .pipe(size({ showFiles:true }))
    .pipe(dest(paths.styles.dest))
    .pipe(!isProd ? browserSync.stream() : noop());
};

export const buildStyles = series(stylesClean, stylesLint, styles);

// Dev Server
export function serve() {
  browserSync.init({
    browser: "google chrome",
    server: {
      baseDir: ".",
    },
  });

  watch(paths.styles.watch, buildStyles);
  watch("index.html").on("change", browserSync.reload);;
};

// Build task
export const build = buildStyles;

// Default task
export default series(build, serve);
