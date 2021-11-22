const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const mode = require('gulp-mode')();
// const imageResize = require('gulp-image-resize');
const imagemin = require('gulp-imagemin');

gulp.task('process-sass', () => {
	return gulp.src('src/scss/style.scss')
		.pipe(mode.development(sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['> 1%']
		}))
		.pipe(cssnano())
		.pipe(mode.development(sourcemaps.write('./')))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('process-js', () => {
	return gulp.src('src/js/index.js')
		.pipe(webpack({
			mode: mode.development() ? 'development' : 'production',
			watch: true,
			output: {
				filename: 'bundle.js'
			}
		}))
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(mode.development(sourcemaps.init()))
		.pipe(uglify().on('error', (uglify) => {
			console.error(uglify.message);
			this.emit('end');
		}))
		.pipe(mode.development(sourcemaps.write('./')))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('fontawesome', () => {
	return gulp.src(['./node_modules/@fortawesome/fontawesome-free/webfonts/*'])
		.pipe(gulp.dest('dist/fonts/fontawesome'));
});

gulp.task('fontmanrope', () => {
	return gulp.src(['./node_modules/manrope/complete/*'])
		.pipe(gulp.dest('dist/fonts/manrope'));
});

gulp.task('fonts', gulp.series(['fontawesome', 'fontmanrope']));

gulp.task('images',  () => {
	return gulp.src('./src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('default', () => {

	gulp.watch(
		['src/scss/*.scss','src/scss/*/*.scss'],
		{ ignoreInitial: false },
		gulp.series('process-sass')
	);

	gulp.watch(
		['src/js/*.js','src/js/*/*.js'],
		{ ignoreInitial: false },
		gulp.series('process-js')
	);

});