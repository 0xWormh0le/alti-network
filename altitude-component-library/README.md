# altitude-component-library

> Component library to serve Altitude Networks domain applications

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @altitudenetworks/component-library
yarn add @altitudenetworks/component-library
```

## Usage

```tsx
import React, { Component } from 'react'

import { AnAltitudeComponent } from 'altitude-component-library'
import 'altitude-component-library/dist/index.css'

const Example = () => {
  return (
    <div>
      <AnAltitudeComponent />
    </div>
  )
}
```


## Release workflow
- Create release branch from main
- Create release tag from release branch
- Merge the automatically created release PR
- Done

## License

UNLICENSED
