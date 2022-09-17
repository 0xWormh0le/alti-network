import React from 'react'
import { render } from '@testing-library/react'
import BaseAvatar from './BaseAvatar'

describe('BaseAvatar', () => {
  it('renders correctly', () => {
    const props = {
      src: { url: 'test/path' },
      name: 'test name',
      colorList: ['#404040']
    }
    const { container } = render(<BaseAvatar {...props} />)
    expect(container).toMatchSnapshot()
    expect(container.querySelector('.BaseAvatar__image')).toBeDefined()
    expect(container.querySelector('.BaseAvatar__image img')).toHaveAttribute('src', 'test/path')
    expect(container.querySelector('.BaseAvatar__text')).toBeNull()
  })

  it('renders initials with name value', () => {
    const props = {
      src: { url: '' },
      name: 'test name',
      colorList: ['#404040']
    }
    const { container } = render(<BaseAvatar {...props} />)
    expect(container.querySelector('.BaseAvatar__image')).toBeNull()
    expect(container.querySelector('.BaseAvatar__image img')).toBeNull()
    expect(container.querySelector('.BaseAvatar__text')).toHaveTextContent('tn')
    expect(container.querySelector('.BaseAvatar__text')).toHaveAttribute('style', 'background-color: rgb(64, 64, 64);') // rgb(64, 64, 64) is equivalant to #404040
  })

  it('renders initials with broken name value, name with extra space', () => {
    const props1 = {
      src: { url: '' },
      name: 'test  name',
      colorList: ['#404040']
    }
    const { container: container1 } = render(<BaseAvatar {...props1} />)
    expect(container1.querySelector('.BaseAvatar__text')).toHaveTextContent('tn')

    const props2 = {
      src: { url: '' },
      name: ' test  name ',
      colorList: ['#404040']
    }
    const { container: container2 } = render(<BaseAvatar {...props2} />)
    expect(container2.querySelector('.BaseAvatar__text')).toHaveTextContent('tn')

    const props3 = {
      src: { url: '' },
      name: 'test name  ',
      colorList: ['#404040']
    }
    const { container: container3 } = render(<BaseAvatar {...props3} />)
    expect(container3.querySelector('.BaseAvatar__text')).toHaveTextContent('tn')
  })
})
