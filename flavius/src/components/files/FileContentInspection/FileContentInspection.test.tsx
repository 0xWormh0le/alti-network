import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import FileContentInspection from './FileContentInspection'
import { FileContentInspectionData } from 'test/mocks'
import { act, waitForElement, render } from '@testing-library/react'

const props: any = {
  sensitiveKeywords: FileContentInspectionData.propsWithRisks.sensitivePhrases.sensitiveKeywords,
  ccn: FileContentInspectionData.propsWithRisks.sensitivePhrases.ccNum,
  ssn: FileContentInspectionData.propsWithRisks.sensitivePhrases.ssn,
  loading: false
}

describe('SensitiveFileCell', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<FileContentInspection {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders a ccn count of 6', async () => {
    const { getByTestId } = render(<FileContentInspection {...props} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('ccnCount'))
      expect(element).toHaveTextContent('6 instances found')
    })
  })

  it('renders sensitivekeyword "merit"', async () => {
    const { getByTestId } = render(<FileContentInspection {...props} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('keyword-0'))
      expect(element).toHaveTextContent('merit')
    })
  })
})
