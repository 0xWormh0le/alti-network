// import { render } from '@testing-library/react'
import { renderWithRouter } from 'test/support/helpers'
import tabs from './index'

const keys = [
  'filesAccessible',
  'risks',
  'personDownloads',
  'appDownloads',
  'atRiskFilesOwned',
  'risksCreated',
  'collaborators',
  'filesSharedWith',
  'filesSharedBy',
  'allActivity'
]

describe('Spotlight Tabs', () => {
  it('renders correctly', () => {
    tabs[0].renderDetailsTable('sample-person-id')
    const { container } = renderWithRouter(tabs[0].renderDetailsTable('sample-person-id'))
    expect(container).toMatchSnapshot()
  })

  test.each(keys)('renderes correctly with %s tab', (key) => {
    const { container } = renderWithRouter(tabs[keys.indexOf(key)].renderDetailsTable('sample-person-id'))
    expect(container.querySelector('.Table')).toBeInTheDocument()
  })
})
