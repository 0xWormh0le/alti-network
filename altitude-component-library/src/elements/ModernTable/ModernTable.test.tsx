import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import ModernTable from './ModernTable'
import { DoubleArrow } from 'icons'

const itemsLength = 10
const mockFields = ['field1', 'field2', 'field3']
const mockContents = {
  fields: mockFields,
  items: Array.from(new Array(itemsLength).keys()).map((num) =>
    Object.fromEntries(mockFields.map((field, i) => [field, num * i]))
  )
}

describe('Modern Table Rendering', () => {
  it('Renders right amount of rows', () => {
    const { container }: { container: HTMLElement } = render(
      <ModernTable fields={mockContents.fields} items={mockContents.items} />
    ) as RenderResult
    expect(container.querySelectorAll('tbody tr').length).toBe(itemsLength)
  })

  it('Renders all headers', () => {
    const { container }: { container: HTMLElement } = render(
      <ModernTable fields={mockContents.fields} items={mockContents.items} />
    ) as RenderResult

    expect(container.querySelectorAll('th').length).toBe(mockFields.length)
  })
})

describe('Modern Table Loading', () => {
  it('Renders loading when loading', () => {
    const { container }: { container: HTMLElement } = render(
      <ModernTable isLoading={true} fields={mockContents.fields} items={mockContents.items} />
    ) as RenderResult

    expect(container.innerHTML.includes('Loading'))
  })

  it('Renders specialized loading component', () => {
    const testLoadingText = 'TestLoading'
    const { container }: { container: HTMLElement } = render(
      <ModernTable
        loadingComponent={<div>{testLoadingText}</div>}
        isLoading={true}
        fields={mockContents.fields}
        items={mockContents.items}
      />
    ) as RenderResult
    expect(container.innerHTML.includes(testLoadingText)).toBeTruthy()
  })
})

describe('No results', () => {
  it('Renders an ErrorBox when there are no results', () => {
    const { container }: { container: HTMLElement } = render(
      <ModernTable fields={mockContents.fields} items={[]} />
    ) as RenderResult
    expect(container.querySelector('.ErrorBox')).toBeTruthy()
    expect(container.querySelector('.ErrorBox')?.innerHTML.includes('No results'))
  })

  it('Loading overrides ErrorBox', () => {
    const { container }: { container: HTMLElement } = render(
      <ModernTable isLoading={true} fields={mockContents.fields} items={[]} />
    ) as RenderResult

    expect(container.innerHTML.includes('Loading'))
  })

  it('Shows custom message', () => {
    const message = 'Nothing found foobar'
    const { container }: { container: HTMLElement } = render(
      <ModernTable isLoading={false} noResultsMessage={message} fields={mockContents.fields} items={[]} />
    ) as RenderResult

    expect(container.innerHTML.includes(message))
  })
})

describe('Sorting headers', () => {
  it('Renders double arrow for non selected sorting header', () => {
    const { container }: { container: HTMLElement } = render(
      <ModernTable
        isLoading={false}
        sortingHeaders={[mockContents.fields[0], mockContents.fields[1]]}
        sort={'desc'}
        fields={mockContents.fields}
        items={mockContents.items}
      />
    ) as RenderResult

    const { container: doubleArrowContainer } = render(<DoubleArrow className='' />)

    expect(container.querySelectorAll('th').item(1).querySelector('svg')?.outerHTML).toBe(
      doubleArrowContainer.innerHTML
    )
  })

  it('Renders down arrow for selected sorting header and sort is desc', () => {
    const { container }: { container: HTMLElement } = render(
      <ModernTable
        isLoading={false}
        sortingHeaders={[mockContents.fields[0], mockContents.fields[1]]}
        orderBy={mockContents.fields[0]}
        sort={'desc'}
        fields={mockContents.fields}
        items={mockContents.items}
      />
    ) as RenderResult

    expect(container.querySelectorAll('th').item(0).innerHTML.includes('↓')).toBeTruthy()
  })

  it('Renders up arrow for selected sorting header and sort is asc', () => {
    const { container }: { container: HTMLElement } = render(
      <ModernTable
        isLoading={false}
        sortingHeaders={[mockContents.fields[0], mockContents.fields[1]]}
        orderBy={mockContents.fields[0]}
        sort={'asc'}
        fields={mockContents.fields}
        items={mockContents.items}
      />
    ) as RenderResult

    expect(container.querySelectorAll('th').item(0).innerHTML.includes('↑')).toBeTruthy()
  })
})
