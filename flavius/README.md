# ⚡️ Flavius application

![Build Status](https://github.com/altitudenetworks/flavius/actions/workflows/main.yml/badge.svg?event=push&branch=develop)

![Code Coverage](/assets/coverage-badge.svg)

![Heartbeat](https://github.com/altitudenetworks/flavius/workflows/Heartbeat/badge.svg)

Front End application oriented to the end user as an interface for Altitude Networks λ functions.
The app displays a dashboard and other insights about the risks of an organization.

## Technologies used

- [Typescript](https://www.typescriptlang.org/) as the main language.
- [React](https://reactjs.org/) single page application.
- Routing done using [React Router v4](https://reacttraining.com/react-router/web/guides/philosophy).
- [SASS](http://sass-lang.com/) as a CSS preprocessor.
- [AWS Amplify](https://aws-amplify.github.io/) is used to integrate to the backend services and to talk to the API, while authentication is done via [AWS Cognito](https://aws.amazon.com/cognito/).
- Uses [react-s-alert](https://www.npmjs.com/package/react-s-alert) for alert notifications.
- Uses [react-testing-library](https://github.com/testing-library/react-testing-library) in conjunction with [Jest](https://jestjs.io/) test runner for both unit and integration tests.
- Uses [react-chartist](https://github.com/fraserxu/react-chartist) as a wrapper for [Chartist](https://gionkunz.github.io/chartist-js/) to render charts (such as line and pie charts).
- Uses [react-router-modal](https://github.com/davidmfoley/react-router-modal) to render modals within the application.
- Uses [Cypress](https://cypress.io) for E2E testing.
- [Git hooks](https://github.com/tarmolov/git-hooks-js) are managed via npm package `git-hooks`. Any local hooks will be overwritten by this package. New hooks can be added as arbitrary executable scripts to the appropriate lifecycle-named directory under `/.githooks`, e.g.: pre-push scripts can go in `/.githooks/pre-push/newscript.any`.

### Architecture diagram

![Infrastructure Diagram](/assets/refarch.png?raw=true 'Infrastructure Diagram')

## Setup

1. Install Node v10.14 or newer, preferable with [nvm](https://github.com/creationix/nvm).

```
$ nvm install v10
```

2. If `NPM_TOKEN` not set, create one and set it. Make sure
   you have access to private Altitude Networks NPM.

```
$ npm login
$ npm token create // copy the token

/* in .zshrc (or .bashrc, etc), add the following line */
export NPM_TOKEN={YOUR_TOKEN_HERE}
```

3. Clone the repository and install the dependencies.

```
$ npm install
```

4. Install watchman (see [here](https://github.com/facebook/create-react-app/issues/4540#issuecomment-393268543) for why).

```
$ brew update
$ brew install watchman
```

5. Start the frontend application locally.

```
$ npm run start
```

## Available commands

- `npm run start`: Start the app locally in your development environment, by default it will be available on `http://localhost:3000`. Your default browser should open a new tab pointing there automatically.
- `npm run test`: Run tests, uses watch mode by default.
- `npm run lint`: Run typescript compiler (`tsc`) and `ts-list`.
- `npm run lint-fix`: Run typescript compiler and fix the errors and warnings.
- `npm run build`: Build the application and get it ready to be deployed by generating a production bundle on the `build` directory.
- `npm run build-staging`: Build the application and get it ready to be deployed by generating a production bundle on the `build` directory, but with the staging environment set.
- `npm run inspect-dependencies`: Builds a dependency graph for the application, and serves the result in a local browser.
- `npm run coverage`: Runs the local tests and generates a coverage report. Updates the coverage badge accordingly.
- `npm run serve`: Runs a server from the `build` directory on port `3000`.
- `npm run serve-e2e`: Runs a server from the `build` directory on port `3000` and forks it as a background process. This is designed only to be run in CI.
- `npm run e2e-local`: This runs the cypress test suite locally. Does not start a server
- `npm run e2e-travis`: Records and uploads to Cypress with record key \$CYPRESS_RECORD_KEY, which is set in Travis CI,
- `npm run e2e`: Runs E2E tests without recording in the Cypress dashoard,
- `npm run gzip`: gzips build directory for upload to s3

## Development flow

Have a look at our [Code contribution guidelines wiki page](https://altitudenetworks.atlassian.net/wiki/x/oYE) in Confluence to learn more about our development flow process.

## CSS preprocessor

This project implements [SASS](http://sass-lang.com/) via [node-sass](https://github.com/sass/node-sass), as per the suggestion of [Create React App's documentation](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-sass-stylesheet).

The styles for each component are therefore located in their corresponding `<component_name>.scss` file.

There's also a utility folder under `src/styles`. The folder contains some common variables, mixins and other stuff that is meant to be reused from other SASS files. Have a look at the [Zeplin styleguide](https://app.zeplin.io/project/5ba57db001bc4c68619b29d7/styleguide/colors-textstyles) where you can inspect some of these variables. You should import these styles on the code from another .scss file by doing:

```css
@import 'styles/_shared.scss';
```

### BEM convention

The components try to follow a [BEM](https://css-tricks.com/bem-101/) naming convention (Block Element Modifier). Hence, you can leverage the & (ampersand) operator in SASS to reference the parent component in a concise way.

```html
<a class="Button Button--big Button--orange">
  <span class="Button__price">$9.99</span>
  <span class="Button__text">Subscribe</span>
</a>
```

you can then write your styles as:

```CSS
.Button {
  &__price {
    text-align: right;
  }

  &__text {
    font-weight: bold;
  }

  &--big {
    font-size: 24px;
  }

  &--orange {
    color: darkorange;
  }
}
```

### Post processing

This project setup minifies your CSS and adds vendor prefixes to it automatically through [Autoprefixer](https://github.com/postcss/autoprefixer) so you don’t need to worry about it. That means, you don't need to add `-webkit-`, `-ms-` (or any other) prefixes on the css properties in the codebase.

### Flexbox

The app defines a custom mixin in `src/styles/_mixins.scss` which is named `flex()` that you can use to build layouts with flexbox.
Search for the different usages across the codebase by looking for `@include flex` lines on the SASS files.

## Typescript

This project uses [Typescript](https://www.typescriptlang.org/), which is provided by [Create React App](https://github.com/facebook/create-react-app). We have tweaked the rules a bit and you can find them on the `tsconfig.json` and `tslint.json` files.

If you want to run the typescript compiler just type:

```bash
npm run lint
```

[VSCode](https://code.visualstudio.com/) Is recommended for its great integration with Typescript. Many other editors have [support](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support) as well.

## Dependency tree inspection

We use [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) to build an explorable dependency tree for the application. This can help to inspect which dependencies have been included in the production build, and look for ways to reduce the size of our dependency tree.

In order to see the dependency tree for the production build, run

```bash
npm run inspect-external-dependencies
```

See [this discussion](https://github.com/facebook/create-react-app/issues/3518#issue-277616195) for more background on the implementation.

For a graph of the typescript-only components of our application, see the [Madge](https://github.com/pahen/madge)-generated graph below

This graph can be updated with:

```bash
npm run generate-dependency-graph
```

It's also a good idea to ensure no circular dependencies exist, which you can verify by running:

```bash
npm run check-circular-dependencies
```

#### Typescript Internal Dependency Graph:

![TS Dependency graph](/assets/dependency-graph.svg)

## Testing

See our [testing guide](https://altitudenetworks.atlassian.net/wiki/spaces/PROD/pages/25198593/Software+Testing+Guide) for more information on testing.

The main principle behind the testing philosophy of this approach is:

> The more your tests resemble the way your software is used, the more confidence they can give you.

Hence, the idea is to code tests that mimic the interaction of actual users with the UI components, in order for us to provide a confidence level that can allow us to ship the app without any key parts broken. Having that said, we can, in addition to integration tests, write unit tests for the different UI components when we consider this necessary.

### Local Tests

You'll notice the test files are located within tests folders named `__tests__` in our codebase. Jest will automatically run any tests found on this folder, so in order to create a new test just add a new file inside. Moreover, there's a configuration file named `src/setupTests.ts` where basic initial configuration is set.

You can write unit and integration tests with this approach. If you want to unit test a high level component you'll need to mock some dependencies, because `react-testing-library` intentionally **does not support** shallow rendering.

#### Dependencies

The local testing strategy for this project is based on the following two libraries:

- [react-testing-library](https://github.com/testing-library/react-testing-library): these are some testing utilities that allow you to write tests that work with actual DOM nodes. You can think of it as a replacement of the popular [Enzyme](https://github.com/airbnb/enzyme) testing library.
- [Jest](https://jestjs.io/): test runner developed by Facebook, it ships with `create-react-app`. It is also used to mock some of the modules that are required on the tests.

In case you want to do basic [snapshot testing](https://jestjs.io/docs/en/snapshot-testing), this is also supported, see `src/components/base/__tests__/Sidebar.test.jsx` for an example.

#### How to run local tests

To start watch mode, just run:

```bash
npm run test
```

It is suggested that you keep your terminal opened while in watch mode. As you edit your code, your tests will be automatically re-run. Look at the terminal for more instructions on the watch mode usage.

#### Debugging local tests

There's a pretty cool feature that you can use to debug the rendered component. The `render()` function from `react-testing-library` provides a `debug()` function in the object that is returned.

```javascript
import React from 'react'
import { render } from '@testing-library/react'

const HelloWorld = () => <h1>Hello World</h1>

it('renders correctly', () => {
  const { debug } = render(<HelloWorld />)
  debug()
})
```

And then you'll see the rendered element on the console.

### End-to-End Tests

End-to-end (e2e) tests are designed as a last line of defense, to ensure that the application works as expected in what is as close to a 'real world' situation as possible through automated testing. They should be used to cover all UX flows at a high level. They should be run before merging into a new stage is approved, so from feature -> dev, dev -> staging and staging -> production. They are also run, sometimes in a reduced capacity, periodically against our live prodcution environment as a heartbeat style test to ensure systems are up and responding as normal when accessed from the browser.

#### How to run e2e tests locally

1. Build the app for staging `npm run build-staging` or production `npm run build`. Alternatively you can start a non-production-optimized build pointing to staging with `npm run start`, and skip step 2.
2. Serve by running `npm run serve`. Note that you either need to send this process to the background or run it in a separate shell session.
3. Invoke an e2e test run against the server running from the last step, by running `npm run e2e-local`.
4. After the test, quit the chrome instance and shut down the server as needed.

## Routes

This project is using [`react-router-dom v4`](https://reacttraining.com/react-router/core), have a look at `Routes.tsx` which is the file that defines the routes that are available.

There are several routes to navigate to different pages of the app, such as `/dashboard`, `/top-risks`, `/person-search`, and others

Additionally, there are some route that are pages opened inside a modal. Finally, there are routes for the support pages under `/settings` and `/help`.

In order to log in, the user is redirected to the `/login` route and for signing up the user will be using `/signup`.

## Deployment

Deployments are handled automatically with TravisCI.

Deploys occur when a Pull Request to `develop`, `master` or `release-*` branches has been approved and all tests have passed.

The project is then built by running `npm run build` and the resulting build is uploaded to S3 automatically by TravisCI. See `.travis.yml` for more configuration information.

The environment variables referenced in `.travis.yml` are encrypted using the travis cli. See the [TravisCI docs](https://docs.travis-ci.com/user/encryption-keys/) on the subject for more information.

### Test deployment

The Flavius application is currently deployed on different S3 buckets and served using CloudFront.

The `develop` branch is deployed to https://app-dev.altitudenetworks.com/.

Any `release-x.y.z` branch is deployed to https://app-staging.altitudenetworks.com/.

The `master` branch is deployed to https://app.altitudenetworks.com/, which is the production url for our application.

Tests will be run on pull requests to either of those branches.

Test and deployment history for this repository can be viewed here: https://travis-ci.com/altitudenetworks/flavius

---

This app was bootstrapped based on the template provided by [`create-react-app`](https://github.com/facebook/create-react-app)
