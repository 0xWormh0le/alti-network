import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from 'test/support/helpers'
import { SensitiveFileCell, SensitiveFileCellProps } from './SensitiveFileCell'
import { render, act, waitForElement, fireEvent } from '@testing-library/react'
import { UI_STRINGS } from 'util/ui-strings'
import { sensitiveFileData } from 'test/mocks'

describe('SensitiveFileCell', () => {
  it('renders correctly', () => {
    const props: SensitiveFileCellProps = {
      sensitiveFile: {
        fileCount: 1,
        riskId: '12312oj',
        sensitivePhrases: {
          ccNumFileCount: 1,
          sensitiveKeywordsFileCount: 1,
          ssnFileCount: 1,
          sensitiveKeywords: undefined
        },
        riskTypeId: 2012
      }
    }
    const { container } = renderWithRouter(<SensitiveFileCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})

describe('Sensitive File Risk tests', () => {
  /* SINGLE FILE TESTS */
  it('renders a single file tooltip correctly', async () => {
    const singleItemProps = sensitiveFileData.singleValueProps
    const { getByTestId } = render(<SensitiveFileCell {...singleItemProps} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      expect(element).toBeDefined()
    })
  })
  it('Shows single file ssn to have 3 instances', async () => {
    const singleItemProps = sensitiveFileData.singleValueProps
    const { getByTestId } = render(<SensitiveFileCell sensitiveFile={singleItemProps.sensitiveFile} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      fireEvent.mouseOver(element)
      const component = await waitForElement(() => getByTestId('single-file-ssn'))
      expect(component).toHaveTextContent('3 instances found')
    })
  })
  it('Shows single file ccNum to have 6 instances', async () => {
    const singleItemProps = sensitiveFileData.singleValueProps
    const { getByTestId } = render(<SensitiveFileCell sensitiveFile={singleItemProps.sensitiveFile} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      fireEvent.mouseOver(element)
      const component = await waitForElement(() => getByTestId('single-file-ccNum'))
      expect(component).toHaveTextContent('6 instances found')
    })
  })
  it('Shows single file to have 8 instances of sensitive phrases: acme ', async () => {
    const singleItemProps = sensitiveFileData.singleValueProps
    const { getByTestId } = render(<SensitiveFileCell sensitiveFile={singleItemProps.sensitiveFile} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      fireEvent.mouseOver(element)
      const component = await waitForElement(() => getByTestId('sensitive-phrase-0'))
      expect(component).toHaveTextContent('8 instances')
    })
  })
  it('is a single risk, no sensitive phrases found', async () => {
    const singleItemPropsNoPhrases = sensitiveFileData.singleValuePropsNoPhrases
    const { getByTestId } = render(<SensitiveFileCell {...singleItemPropsNoPhrases} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      fireEvent.mouseOver(element)
      const component = await waitForElement(() => getByTestId('sensitive-phrases-none'))
      expect(component).toHaveTextContent(UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_NONE_DETECTED)
    })
  })
  it('is a single risk, no sensitive ssn or ccNum found', async () => {
    const singleValuePropsPhrasesOnly = sensitiveFileData.singleValuePropsPhrasesOnly
    const { getByTestId } = render(<SensitiveFileCell {...singleValuePropsPhrasesOnly} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      fireEvent.mouseOver(element)
      const component = await waitForElement(() => getByTestId('sensitive-no-ssn-or-ccNum'))
      expect(component).toHaveTextContent(UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_NONE_DETECTED)
    })
  })

  /* MULTIPLE FILE TESTS */
  it('is a multi-file risk with 6 files having ssn data', async () => {
    const multiValueProps = sensitiveFileData.multiValueProps
    const { getByTestId } = render(
      <Router>
        <SensitiveFileCell {...multiValueProps} />
      </Router>
    )
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      fireEvent.mouseOver(element)
      const component = await waitForElement(() => getByTestId('multi-ssn'))
      expect(component).toHaveTextContent('Found in 6 files')
    })
  })

  it('is a multi-file risk with 5 files having ccNum data', async () => {
    const multiValueProps = sensitiveFileData.multiValueProps
    const { getByTestId } = render(
      <Router>
        <SensitiveFileCell {...multiValueProps} />
      </Router>
    )
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      fireEvent.mouseOver(element)
      const component = await waitForElement(() => getByTestId('multi-ccNum'))
      expect(component).toHaveTextContent('Found in 5 files')
    })
  })

  it('is a multi-file risk with sensitive keywords data in 3 files', async () => {
    const multiValueProps = sensitiveFileData.multiValueProps
    const { getByTestId } = render(
      <Router>
        <SensitiveFileCell {...multiValueProps} />
      </Router>
    )
    await act(async () => {
      const element = await waitForElement(() => getByTestId('sensitiveFileAlert'))
      fireEvent.mouseOver(element)
      const component = await waitForElement(() => getByTestId('multi-keywords'))
      expect(component).toHaveTextContent('Found in 3 files')
    })
  })
})
