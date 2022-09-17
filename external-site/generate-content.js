const Prismic = require('prismic-javascript');
const PrismicDOM = require('prismic-dom');
const metalsmith  = require('metalsmith');
const jstransformer = require('metalsmith-jstransformer');
const ignore = require('metalsmith-ignore');
const collections = require('metalsmith-collections');
const pagination = require('metalsmith-pagination');
const layouts = require('metalsmith-layouts');
const fsAsync = require('fs').promises;
const fsSync = require('fs');
const moveUp = require('metalsmith-move-up');
const define = require('metalsmith-define');
const Entities = require('html-entities').AllHtmlEntities;
const moment = require('moment');
const beautify = require('metalsmith-beautify');
const yaml = require('js-yaml');
const whilst = require('async/whilst');
const axios = require('axios');
const sitemap = require('metalsmith-sitemap');

const decode = (entityEncodedString) => {
  const entities = new Entities();
  return entities.decode(entityEncodedString);
}

const apiEndpoint = 'https://altnet.cdn.prismic.io/api/v2';
const apiToken = 'MC5YMUpENFJBQUFDVUFUOVgw.77-977-977-977-9H--_ve-_vQvvv73vv73vv73vv70T77-9fe-_vXIV77-9Ze-_vWAXAhTvv71zEu-_ve-_ve-_vQ0';

const postTypeMappings = {
  all: 'All Resources',
  blog: 'Blog',
  webcast: 'Webcasts',
  webinar: 'Events',
  document: 'Documents',
  press: 'Press'
}

const homePagePaginationOptions = {}

Object.keys(postTypeMappings).forEach(postType => {
  const postTypeRootPath = postTypeMappings[postType].toLowerCase().replace(' ', '-')
  const paginationOptions = {
    perPage: 6,
    layout: 'resources.html.njk',
    path: `${postTypeRootPath}/pages/page-:num.html`,
    pageMetadata: {
      [`${postType}`]: true,
      title: 'Resources Home',
      description: 'Blog posts, CISO to CISO webcasts, and more information on Cloud Storage Data Loss Prevention',
      url: '/resources'
    },
  }
  
  paginationOptions.path = `${postTypeRootPath}/pages/page-:num.html`

  if (postType === 'all') {
    paginationOptions.first = 'index.html'
  }
  else {  
    paginationOptions.first = `${postTypeRootPath}/index.html`
  }

  if (postType === 'webcast') {
    paginationOptions.pageMetadata.thumbnail = '/images/webcast-social.png'
  }
  
  homePagePaginationOptions[`collections.${postType}`] = paginationOptions
})

// add Read More section options
homePagePaginationOptions['collections.featured'] = {
  perPage: 3,
  layout: 'partials/featured.html.njk',
  path: `partials/featured.html`
}

const buildBlog = async () => {
  const fingerprint = await fsAsync.readFile(`${__dirname}/.state/fingerprint.json`, 'utf-8')
  const api = await Prismic.getApi(apiEndpoint, {accessToken: apiToken})
  const response = await api.query("", {pageSize: 100})
  const siteUrl = 'https://www.altitudenetworks.com'
  let currentPage = 1;
  let results = response.results
  await whilst(async () => currentPage < response.total_pages, async () => {
    ++currentPage
    const paginatedResponse = await api.query("", {pageSize: 100, page: currentPage})
    results = [...results, ...paginatedResponse.results]
  })
  console.info(`Writing ${results.length} posts`);

  await asyncForEach(results, writePost)

  metalsmith(__dirname)
    .source('./src')
    .destination('./build/resources')
    .clean(true)
    .use(define({
      filters: {
        decode
      },
      fingerprint: JSON.parse(fingerprint),
      resourceCategories: Object.keys(postTypeMappings).map(postType => postTypeMappings[postType]),
      resources: true
    }))
    .use(ignore(['*', '**/*', '**/.DS_Store', '!resources_pages/*', '**/.gitignore']))
    .use(collections({
      all: {
        pattern: ['resources_pages/*.html.njk', '!resources_pages/resources.html.njk'],
        sortBy: 'date',
        reverse: true
      },
      featured: {
        sortBy: 'date',
        reverse: true
      },
      blog: {
        sortBy: 'date',
        reverse: true
      },
      webcast: {
        sortBy: 'date',
        reverse: true
      },
      webinar: {
        sortBy: 'date',
        reverse: true
      },
      document: {
        sortBy: 'date',
        reverse: true
      },
      press: {
        sortBy: 'date',
        reverse: true
      }
    }))
    .use(pagination(homePagePaginationOptions))
    .use(layouts({
      directory: 'src/layouts',
      engineOptions: {
        filters: {
          decode
        }
      }
    }))
    .use(jstransformer({
      pattern: '**',
      layoutPattern: 'src/layouts/**'
    }))
    .use(beautify({
      js: false,
      html: {
          "wrap_line_length": 80
      }
    }))
    .use(moveUp('resources_pages/*'))
    .use(sitemap({           
      hostname: siteUrl+"/resources",
      omitExtension: true,
      omitIndex: true,
      pattern: ['**/*.html', '**/*.html.njk'],
      output: "../sitemap-resources.xml"
    }))
    .use(moveUp('src/*'))
    .build(function(err) {
      if (err) {
        throw err
      }
      console.log('Post writing finished!')
    })
}
buildBlog()

const writePost = async (doc) => {
  const {data, slugs, type, first_publication_date} = doc
  const {title, content, hero_image, description, transcript, original_post_time, video, author, featured, seo_title, engineering_signup_form, document_link, doc_type}  = data

  let postType = '';
  let thumbnailUrl = '';
  switch(type) {
    case 'blog_post':
      postType = 'blog';
      thumbnailUrl = hero_image && hero_image.url ? hero_image.url : '';
      break;
    case 'webcast':
    case 'webinar':
    case 'document':
    case 'press':
      postType = type;
      thumbnailUrl = hero_image && hero_image.url ? hero_image.url : '';
      break;
    default:
      throw new Error(`The post type ${type} is not supported`)
      break;
  }

  const titleHtml = PrismicDOM.RichText.asHtml(title, linkResolver)
  const body = PrismicDOM.RichText.asHtml(content, linkResolver)
  const entities = new Entities();
  const encodedBody = entities.encode(body)
  let encodedTranscript;
  if (transcript) {
    encodedTranscript = PrismicDOM.RichText.asText(transcript)
    encodedTranscript = entities.encode(encodedTranscript)
  }
  const postTime = original_post_time ? original_post_time : first_publication_date
  const collections = [postType]
  if (featured) {
    collections.push('featured')
  }

  const seoTitle = seo_title ? seo_title : title[0].text

  const localThumbnailPath = `/images/blog-thumbnails/${titleToFilename(seoTitle)}.png`
  await downloadImage(thumbnailUrl, localThumbnailPath)

  const frontmatter = {
    title: title[0].text,
    seoTitle,
    thumbnail: localThumbnailPath,
    body: encodedBody,
    collection: collections,
    type: postType,
    description: description ? description : 'Blog Post by Altitude Networks',
    url: `/resources/${slugs[0]}`,
    date: postTime,
    prettyDate: moment(postTime).format('MMMM Do, YYYY'),
    shortDate: moment(postTime).format('MM/DD/YY'),
    author: author ? author : 'Altitude Networks',
    video: video && video.embed_url ? video.embed_url : '',
    layout: `${postType}.html.njk`,
    resources: true,
    featured: !!featured,
    transcript: encodedTranscript ? encodedTranscript : '',
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://altitudenetworks.com' : 'https://external-site-dev.altitudenetworks.com',
    showEngineeringSignupForm: !!engineering_signup_form,
    documentUrl: document_link && document_link.url ? document_link.url : '',
    docType: doc_type ? doc_type : 'document'
  }

  const yamlStr = yaml.safeDump(frontmatter);
  const safeFrontmatter = `---\n${yamlStr}\n---`
  const fileName = `${slugs[0]}.html.njk`
  await fsAsync.writeFile(`${__dirname}/src/resources_pages/${fileName}`, safeFrontmatter, 'utf8')
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
  
const linkResolver = (doc) => {
  switch(doc.type) {
    case 'blog_post':
      return '/blog/' + doc.slugs[0];
    default:
      return '/doc/' + doc.slugs[0];
  }
  // Pretty URLs for known types
  if (doc.type === 'blog') return 
  if (doc.type === 'page') return "/" + doc.uid;
  // Fallback for other types, in case new custom types get created
  return "/doc/" + doc.id;
};

async function downloadImage(imageUrl, imageLocation) {
  const imageWriter = fsSync.createWriteStream(`${__dirname}/src${imageLocation}`)

  const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(imageWriter)

  return new Promise((resolve, reject) => {
    imageWriter.on('finish', resolve)
    imageWriter.on('error', reject)
  })
}

const titleToFilename = (title) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w\-\.]/g, '')
}