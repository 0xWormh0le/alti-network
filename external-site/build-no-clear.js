const metalsmith  = require('metalsmith')
const jstransformer = require('metalsmith-jstransformer')
const concat = require('metalsmith-concat')
const fingerprint = require('metalsmith-fingerprint')
const sass = require('metalsmith-sass')
const svgo = require('metalsmith-svgo')
const ignore = require('metalsmith-ignore')
const fs = require('fs').promises
const define = require('metalsmith-define')
const Entities = require('html-entities').AllHtmlEntities;

const decode = (entityEncodedString) => {
    const entities = new Entities();
    return entities.decode(entityEncodedString);
}

metalsmith(__dirname)
  .source('./src/')
  .destination('./build/')
  .clean(false)
  .use(define({
    filters: {
      decode
    }
  }))
  .use(ignore(['resources_pages/*', '**/.DS_Store', '**/.gitignore']))
  .use(concat({
    files: [
      'assets/js/jquery.min.js',
      'assets/js/uuid-random.min.js',
      'assets/js/slick.min.js',
      'assets/js/lottie_canvas.min.js',
      'assets/js/highlight.pack.js',
      'assets/js/main.js'
    ],
    output: 'assets/js/app.js'
  }))
  .use(sass({
    outputStyle: 'expanded',
    outputDir: 'assets/css/',
    sourceMap: true,
    sourceMapContents: true
  }))
  .use(fingerprint({
    pattern: [
      'assets/css/styles.css',
      'assets/js/*.js'
    ]
  }))
  .use(jstransformer({
    pattern: '**',
    layoutPattern: 'layouts/**',
    defaultLayout: null
  }))
  .use(svgo())
  .build(async function(err) {
    if (err) {
      throw err
    }
    await fs.writeFile(`${__dirname}/.state/fingerprint.json`, JSON.stringify(this._metadata.fingerprint))

  })
