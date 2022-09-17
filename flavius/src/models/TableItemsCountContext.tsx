import React from 'react'

export const TableItemsCountContext = React.createContext({} as TableItemsCountContextProviderState)

interface TableItemsCountContextProviderProps {
  children: React.ReactNode
}

interface TableItemsCountContextProviderState {
  pageCount: number
  numberOfItemsInCurrentPage: number
  onPageLoaded?: (newPageCount: number, newNumberOfItemsInCurrentPage: number) => void
}

// Provider - it will keep track of the number of pages and the current number of items in the page
export class TableItemsCountContextProvider extends
  React.Component<TableItemsCountContextProviderProps, TableItemsCountContextProviderState> {

  public state = {
    pageCount: 0,
    numberOfItemsInCurrentPage: 0
  }

  public render () {
    const { pageCount, numberOfItemsInCurrentPage } = this.state

    return (
      <TableItemsCountContext.Provider
        value={{
          pageCount,
          numberOfItemsInCurrentPage,
          onPageLoaded: (newPageCount: number, newNumberOfItemsInCurrentPage: number) => {
            this.setState({
              pageCount: newPageCount,
              numberOfItemsInCurrentPage: newNumberOfItemsInCurrentPage
            })
          }
        }}>
        {this.props.children}
      </TableItemsCountContext.Provider>
    )
  }

}

// Consumer
export const TableItemsCountContextConsumer = TableItemsCountContext.Consumer
