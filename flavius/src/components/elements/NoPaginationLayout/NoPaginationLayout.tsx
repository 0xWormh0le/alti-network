import React from 'react'

export interface NoPaginationLayoutProps {
  Table: (...args: any[]) => any
}

export const NoPaginationLayout: React.FC<NoPaginationLayoutProps> = ({ Table }) => (
  <div>
    <Table />
  </div>
)

export default NoPaginationLayout
