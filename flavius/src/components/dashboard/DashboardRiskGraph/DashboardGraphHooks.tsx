import { useEffect, useState } from 'react'
import { INode } from './DashboardRiskGraphData'

export const useMapNodeData = (platformId: string, data: Maybe<DashviewStats>, nodes: INode[]) => {
  const [nodeElements, setNodeElements] = useState<any>([])

  useEffect(() => {
    nodes.forEach((node: any) => {
      if (node.hasOwnProperty('data')) {
        node.data.stat = 0
      }
    })
    setNodeElements([...nodes])
  }, [platformId, nodes])

  useEffect(() => {
    if (platformId && data) {
      const column = data[platformId]
      if (!column) {
        setNodeElements({})
      } else {
        const newNodes = nodes.slice()
        let total = 0
        for (const key in column) {
          if (column.hasOwnProperty(key)) {
            const idx = nodes.findIndex((node: any) => node.data?.dataId === key)
            if (idx > -1) {
              newNodes[idx].data.stat = column[key]
              const stat = column[key]
              if (typeof stat === 'number') {
                total += stat
              } else {
                const n = stat ? parseInt(stat, 10) : null
                if (n && !isNaN(n)) {
                  total += n
                }
              }
            }
          }
        }
        if (!total) {
          setNodeElements({})
        } else {
          setNodeElements(newNodes)
        }
      }
    }
  }, [data, setNodeElements, nodes, platformId])
  return [nodeElements]
}
