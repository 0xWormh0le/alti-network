import React from 'react'
import { render } from '@testing-library/react'
import Ellipsify from './Ellipsify'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'

describe('Ellipsify', () => {
  beforeEach(() => {
    const createElement = document.createElement.bind(document)
    document.createElement = (tagName) => {
      if (tagName === 'canvas') {
        return {
          getContext: () => ({
            font: 'arial',
            measureText: () => ({
              width: 100
            })
          })
        }
      }
      return createElement(tagName)
    }
    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        getPropertyValue: (prop) => {
          switch (prop) {
            case 'height':
              return 25
            case 'width':
              return 42
            case 'font-size':
              return 16
            case 'line-height':
              return 20
            default:
              return ''
          }
        }
      })
    })
  })

  it('renders without truncating', () => {
    const props = {
      text: 'this is an untruncated string',
      wordWrap: true,
      showTooltip: false
    }

    const style = {
      width: '200px',
      height: '25px',
      position: 'relative'
    }
    const { container } = render(
      <div style={style}>
        <Ellipsify text={props.text} wordWrap={props.wordWrap} showTooltip={props.showTooltip} />
      </div>
    )

    expect(container.querySelector("[data-testid='truncated-text']").innerHTML).toBe('this is an untruncated string')
  })

  describe('Testing dom updates', () => {
    it('renders with an ellipses', async () => {
      const props = {
        text: 'this is an untruncated string',
        wordWrap: true,
        showTooltip: false
      }

      const style = {
        width: '42px',
        maxWidth: '42px',
        display: 'none',
        height: '25px',
        position: 'relative'
      }

      const { container } = render(
        <div style={style} id='div-test'>
          <Ellipsify text={props.text} wordWrap={props.wordWrap} showTooltip={props.showTooltip} />
        </div>
      )
      await act(async () => {
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 150
        })

        // Trigger the window resize event.
        window.dispatchEvent(new Event('resize'))
        await pause(500)
        expect(container.querySelector('#div-test').style).toHaveProperty('width', '42px')
        expect(container.querySelector("[data-testid='truncated-text']").innerHTML).toBe('this is...')
      })
    })
  })
})
const pause = (time) => {
  return new Promise((response) => {
    setTimeout(() => {
      response()
    }, time)
  })
}
