import React from 'react'
import Help from 'components/elements/Help'
import { renderWithRouter } from 'test/support/helpers'
import { Simulate } from 'react-dom/test-utils'

describe('Help section', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<Help />)
    expect(container).toMatchSnapshot()
  })
  it('Answers load when question is clicked', async () => {
    const { container } = renderWithRouter(<Help />)
    const element = container.querySelectorAll('.Help__question-row')[0]
    Simulate.click(element)
    await new Promise((r) => setTimeout(r, 100))
    const div = container.querySelector('.Help__activeQuestionContainer')
    expect(div).toBeDefined()
  })
  it('Return to questions when right arrow is clicked', async () => {
    const { container } = renderWithRouter(<Help />)
    const element = container.querySelectorAll('.Help__question-row')[0]
    Simulate.click(element)
    await new Promise((r) => setTimeout(r, 100))
    const div = container.querySelector('.Help__activeQuestionContainer')!
    Simulate.click(div)
    expect(container.querySelector('Help__question-container')).toBeDefined()
  })
})
