// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'

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
