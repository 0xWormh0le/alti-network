import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Filter, { FilterProps, FilterItem, mapFilterItems } from './Filter'
import noop from 'lodash/noop'

const filterItems1: FilterItem[] = [
  {
    id: '1',
    value: '1',
    selected: true,
    label: 'Content workflow abnomal download activity'
  },
  {
    id: '2',
    value: '2',
    selected: true,
    label: 'Content workflow sharing policy violation'
  },
  {
    id: '3',
    value: '3',
    selected: true,
    label: 'Content workflow upload policy voilation'
  }
]

const filterItems2: FilterItem[] = [
  {
    id: 'high',
    value: 'high',
    selected: true,
    renderComponent: <div>High</div>
  },
  {
    id: 'medium',
    value: 'medium',
    selected: true,
    renderComponent: <div>Medium</div>
  },
  {
    id: 'low',
    value: 'low',
    selected: false,
    renderComponent: <div>Low</div>
  }
]

const filterItems3: FilterItem[] = [
  {
    id: 'gsuite',
    value: 'gsuite',
    selected: false,
    renderComponent: (
      <div>
        <span style={{ marginLeft: '0.5rem' }}>Google Workspace</span>
      </div>
    )
  },
  {
    id: 'o365',
    value: 'o365',
    selected: false,
    renderComponent: (
      <div>
        <span style={{ marginLeft: '0.5rem' }}>Micsoft 365</span>
      </div>
    )
  }
]

const filterItems4: FilterItem[] = [
  {
    id: 'gsuite',
    value: 'gsuite',
    selected: true,
    label: 'Google Workspace',
    renderComponent: (
      <div>
        <span style={{ marginLeft: '0.5rem' }}>Google Workspace</span>
      </div>
    )
  },
  {
    id: 'o365',
    value: 'o365',
    selected: false,
    label: 'Microsoft 365',
    renderComponent: (
      <div>
        <span style={{ marginLeft: '0.5rem' }}>Microsoft 365</span>
      </div>
    )
  }
]

const props: FilterProps = {
  headerLabel: 'Filter Header Label',
  displayAllOption: true,
  items: filterItems1,
  onSubmit: noop
}

describe('Filter', () => {
  // Begin multi select mode test
  it('renders correctly', () => {
    const { container } = render(<Filter {...props} />)

    expect(container.querySelector('.Filter__container')).toBeVisible()
    expect(container.querySelector('.Filter__header')).toBeVisible()
    expect(container.querySelector('.Filter__header-selected-text')).toHaveTextContent('All')
    expect(container.querySelector('.Filter__header-arrow-up')).not.toBeTruthy()
    expect(container.querySelector('.Filter__header-arrow-down')).toBeTruthy()
    expect(container.querySelector('.Filter__dropdown')).toBeVisible()
    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')
    expect(container.querySelector('.Filter__dropdown')).toHaveAttribute('style', `max-height: 0px;`)
    expect(container.querySelector('.Filter__action')).toBeVisible()
    expect(container.querySelectorAll('.Filter__dropdown-item').length).toBe(4)
    expect(container.querySelector('hr')).toBeVisible()
    expect(container.querySelectorAll('.Filter__dropdown-item input')[0]).toBeChecked()
    expect(container.querySelectorAll('.Filter__dropdown-item')[0]).toHaveTextContent(
      'Content workflow abnomal download activity'
    )
    expect(container.querySelectorAll('.Filter__dropdown-item input')[1]).toBeChecked()
    expect(container.querySelectorAll('.Filter__dropdown-item')[1]).toHaveTextContent(
      'Content workflow sharing policy violation'
    )
    expect(container.querySelectorAll('.Filter__dropdown-item input')[2]).toBeChecked()
    expect(container.querySelectorAll('.Filter__dropdown-item')[2]).toHaveTextContent(
      'Content workflow upload policy voilation'
    )
    expect(container.querySelectorAll('.Filter__dropdown-item input')[3]).toBeChecked()
    expect(container.querySelectorAll('.Filter__dropdown-item')[3]).toHaveTextContent('All')
    expect(container.querySelector('.Filter__action-apply')).toHaveTextContent('Apply')
    expect(container.querySelector('.Filter__action-reset')).toHaveTextContent('Reset filter')
  })

  it('renders the dropdown once click on header', async () => {
    const { container } = render(<Filter {...props} />)

    expect(container.querySelector('.Filter__header-arrow-up')).not.toBeTruthy()
    expect(container.querySelector('.Filter__header-arrow-down')).toBeTruthy()
    expect(container.querySelector('.Filter__dropdown')).toBeVisible()
    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')
    expect(container.querySelector('.Filter__dropdown')).toHaveAttribute('style', `max-height: 0px;`)

    await fireEvent.click(container.querySelector('.Filter__header') as Element)
    expect(container.querySelector('.Filter__header-arrow-up')).toBeTruthy()
    expect(container.querySelector('.Filter__header-arrow-down')).not.toBeTruthy()
    expect(container.querySelector('.Filter__dropdown')).toBeVisible()
    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-open')
  })

  it('renders headerLabel', () => {
    const { container } = render(<Filter {...props} />)

    expect(container.querySelector('.Filter__header-label')).toHaveTextContent('Filter Header Label')
  })

  it('renders all option if displayAllOption is true', () => {
    const { container } = render(<Filter {...props} />)

    expect(container.querySelectorAll('.Filter__dropdown-item').length).toBe(4)
    expect(container.querySelector('hr')).toBeVisible()
    expect(container.querySelectorAll('.Filter__dropdown-item')[3]).toHaveTextContent('All')
  })

  it('does not render all option if displayAllOption is false', () => {
    const { container } = render(<Filter {...props} displayAllOption={false} />)

    expect(container.querySelectorAll('.Filter__dropdown-item').length).toBe(3)
    expect(container.querySelector('hr')).toBeNull()
  })

  it('should uncheck all if not all items are checked', () => {
    const { container } = render(<Filter {...props} items={filterItems2} />)

    expect(container.querySelectorAll('.Filter__dropdown-item input')[3]).not.toBeChecked()
  })

  it('should include tooltip if tooltipText is defined', () => {
    const { container } = render(<Filter {...props} tooltipText='tooltip text' />)

    expect(container.querySelector('.trigger')).toBeDefined()
  })

  it('renders NUM selected if partial items are checked', () => {
    const { container } = render(<Filter {...props} items={filterItems2} />)

    expect(container.querySelector('.Filter__header-selected-text')).toHaveTextContent('2 selected')
  })

  it('renders no filters applied if no filter items are checked', () => {
    const { container } = render(<Filter {...props} items={filterItems3} />)

    expect(container.querySelector('.Filter__header-selected-text')).toHaveTextContent('- no filters applied')
  })

  it('should include containerClass if defined', () => {
    const { container } = render(<Filter {...props} containerClass='container-class-name' />)

    expect(container.querySelector('.container-class-name')).toBeTruthy()
  })

  it('should include dropdownClass if defined', () => {
    const { container } = render(<Filter {...props} dropdownClass='dropdown-class-name' />)

    expect(container.querySelector('.dropdown-class-name')).toBeTruthy()
  })

  it('should call onSubmit with an array of items data and close filter dropdown once click on apply button', async () => {
    const onSubmit = jest.fn()
    const { container, getByText } = render(<Filter {...props} onSubmit={onSubmit} />)

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')

    await fireEvent.click(container.querySelector('.Filter__header') as Element)

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-open')

    await fireEvent.click(container.querySelectorAll('.Filter__dropdown-item input')[0])
    await fireEvent.click(getByText('Apply'))

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')

    const newFilterItems = mapFilterItems(filterItems1)
    newFilterItems[0].selected = false
    expect(onSubmit).toHaveBeenCalledWith(newFilterItems)
  })

  it('should call onSubmit with an array of items data and close filter dropdown once click outside the filter component if there is any filter change', async () => {
    const onSubmit = jest.fn()
    const { container } = render(<Filter {...props} onSubmit={onSubmit} />)

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')

    await fireEvent.click(container.querySelector('.Filter__header') as Element)

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-open')

    await fireEvent.click(container.querySelectorAll('.Filter__dropdown-item input')[0])
    await fireEvent(document, new MouseEvent('mousedown'))

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')

    const newFilterItems = mapFilterItems(filterItems1)
    newFilterItems[0].selected = false
    expect(onSubmit).toHaveBeenCalledWith(newFilterItems)
  })

  it('should not call onSubmit with an array of items data and close filter dropdown once click outside the filter component if there is no filter change', async () => {
    const onSubmit = jest.fn()
    const { container } = render(<Filter {...props} onSubmit={onSubmit} />)

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')

    await fireEvent.click(container.querySelector('.Filter__header') as Element)

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-open')

    await fireEvent(document, new MouseEvent('mousedown'))

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')

    expect(onSubmit).not.toHaveBeenCalledWith()
  })

  it('should not call onSubmit once click outside the filter component when filter dropdown is not open', async () => {
    const onSubmit = jest.fn()
    const { container } = render(<Filter {...props} onSubmit={onSubmit} />)

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')

    await fireEvent(document, new MouseEvent('mousedown'))

    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')

    expect(onSubmit).not.toHaveBeenCalled()
  })

  // Begin single select mode test
  it('should render single select mode correctly', () => {
    const { container } = render(<Filter {...props} items={filterItems4} isSingleSelect={true} />)

    expect(container.querySelector('.Filter__container')).toBeVisible()
    expect(container.querySelector('.Filter__header')).toBeVisible()
    expect(container.querySelector('.Filter__header-selected-text')).toHaveTextContent('Google Workspace')
    expect(container.querySelector('.Filter__header-arrow-up')).not.toBeTruthy()
    expect(container.querySelector('.Filter__header-arrow-down')).toBeTruthy()
    expect(container.querySelector('.Filter__dropdown')).toBeVisible()
    expect(container.querySelector('.Filter__dropdown')).toHaveClass('Filter__dropdown-close')
    expect(container.querySelector('.Filter__dropdown')).toHaveAttribute('style', `max-height: 0px;`)
    expect(container.querySelector('.Filter__action')).toBeNull()
    expect(container.querySelectorAll('.Filter__dropdown-item').length).toBe(2)
    expect(container.querySelector('hr')).toBeNull()
    expect(container.querySelectorAll('.Filter__dropdown-item input')[0]).toBeUndefined()
    expect(container.querySelectorAll('.Filter__dropdown-item')[0]).toHaveTextContent('Google Workspace')
    expect(container.querySelectorAll('.Filter__dropdown-item input')[1]).toBeUndefined()
    expect(container.querySelectorAll('.Filter__dropdown-item')[1]).toHaveTextContent('Microsoft 365')
    expect(container.querySelector('.Filter__action-apply')).toBeNull()
    expect(container.querySelector('.Filter__action-reset')).toBeNull()
  })

  it('should call onSubmit with single item data once click on any of the option', async () => {
    const onSubmit = jest.fn()
    const { container } = render(<Filter {...props} items={filterItems4} isSingleSelect={true} onSubmit={onSubmit} />)

    await fireEvent.click(container.querySelector('.Filter__header') as Element)
    await fireEvent.click(container.querySelectorAll('.Filter__dropdown-item')[1])

    const newFilterItems = mapFilterItems(filterItems4)
    newFilterItems[1].selected = true
    expect(onSubmit).toHaveBeenCalledWith([newFilterItems[1]])
  })
})
