import React from 'react'
import { render } from '@testing-library/react'
import { FileGridBanner, FileGridBannerProps } from './FileGridBanner'

describe('FileGridBanner', () => {
  it('renders correctly', () => {
    const props: FileGridBannerProps = {
      message: 'This file is owned by the external account cw@gmail.com.'
    }
    const { container } = render(<FileGridBanner {...props} />)
    expect(container).toMatchSnapshot()
  })
})
