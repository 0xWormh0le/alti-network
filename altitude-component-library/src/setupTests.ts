// Custom assertions
import '@testing-library/jest-dom/extend-expect'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// mock methods that are not implemented in JSDOM
window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }
})

configure({ adapter: new Adapter() })
