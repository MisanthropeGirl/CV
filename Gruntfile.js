module.exports = function( grunt ) {

	grunt.initConfig({
		autoprefixer: {
			options: {
				browsers: ["last 2 versions"]
			},
			no_dest: {
				src: "resources/css/styles.css"
			},
		},

		csslint: {
			options: {
				"adjoining-classes": false,
				"box-model": false,
				"box-sizing": false,
				"compatible-vendor-prefixes": false,
				"duplicate-properties": false,
				"shorthand": false
			},
			src: ['resources/css/styles.less'] 
		},

		cssmin: {
			options: {
				"source-map": true
			},
			target: {
				files: {
					"resources/css/styles.min.css": "resources/css/styles.css"
				}
			}
		},

		less: {
			development: {
				files: {
					"resources/css/styles.css": "src/less/styles.less"
				}
			},
		},

		lesslint: {
			options: {
				imports: ["../Resources/LESS/*.less"],
				csslint: {
					"adjoining-classes": false,
					"font-sizes": false,
					"unique-headings": false
					// csslintrc: ".csslintrc"
				}
			},
			src: ["src/less/styles.less"]
		},

		parker: {
			src: ['resources/css/styles.css']
		},

		watch: {
			styles: {
				files: "src/less/**/*.less",
				tasks: "styling"
			}
		}	
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask("styling", ["lesslint", "less", "autoprefixer", "cssmin", "csslint", "parker"]);

};