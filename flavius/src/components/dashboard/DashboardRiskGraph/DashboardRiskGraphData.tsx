import CSS from 'csstype'
import UI_STRINGS from 'util/ui-strings'

// const bezierStepType = 'bezier'
const darkGrey = '#354052'
const externalColor = '#F9773D' // orange
const sensitiveColor = '#E23115' // red

interface ArrowProperties extends CSS.Properties {
  down?: CSS.Properties
  up?: CSS.Properties
  orange?: CSS.Properties
  blue?: CSS.Properties
  black?: CSS.Properties
}

interface ISourceTarget {
  positionType?: string
  id?: string
  style?: any
}

interface IEdge {
  id: string
  source: string
  sourceHandle?: string
  target: string
  targetHandle?: string
  style: CSS.Properties
  className?: string
  type: 'default' | 'straight' | 'smoothstep' | 'step'
  animated?: boolean
}

interface IEdgeConnectors {
  [key: string]: {
    background?: string
    border?: string
    positionType?: string
    id?: string
    style?: string
    right?: ArrowProperties
    left?: ArrowProperties
    up?: ArrowProperties
    down?: ArrowProperties
  }
}

interface INodeData {
  label?: string
  dataId: string
  stat: string | number | null
  statLabel?: string
  statColor?: string
  circleClassname?: string
  labelClassname?: string
  sources?: ISourceTarget[]
  targets?: ISourceTarget[]
}

export interface INode {
  id: string
  type: string
  position?: object
  data: INodeData
}

export const edgeConnectors: IEdgeConnectors = {
  circleOrange: {
    background: '#fff',
    border: `1px solid ${externalColor}`
  },
  none: {
    background: 'transparent',
    border: 'none'
  },
  arrows: {
    right: {
      width: '0',
      height: '0',
      border: 'none',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      background: 'white',
      borderRadius: '0',
      orange: {
        borderLeft: `6px solid ${externalColor}`
      },
      blue: {
        borderLeft: `6px solid ${externalColor}`
      },
      black: {
        borderLeft: `6px solid ${darkGrey}`
      }
    },
    down: {
      width: '0',
      height: '0',
      border: 'none',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: 'none',
      background: 'transparent',
      borderRadius: '0',
      orange: {
        borderTop: `6px solid ${externalColor}`
      },
      black: {
        borderTop: `6px solid ${darkGrey}`
      }
    },
    up: {
      width: '0',
      height: '0',
      border: 'none',
      borderTop: 'none',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      background: 'transparent',
      borderRadius: '0',
      orange: {
        borderBottom: `6px solid ${externalColor}`
      },
      blue: {
        borderBottom: `6px solid ${externalColor}`
      },
      black: {
        borderBottom: `6px solid ${darkGrey}`
      }
    }
  }
}

export const nodes: INode[] = [
  {
    id: 'node-user-accounts',
    type: 'special',
    position: { x: 30, y: 0 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.USER_ACCOUNTS,
      dataId: 'numAccounts',
      stat: '',
      circleClassname: 'circleNode circleMedium nodeBlack',
      labelClassname: 'nodeLabel',
      statColor: darkGrey,
      sources: [
        {
          positionType: 'right',
          id: 'node-user-accounts-source-right',
          style: edgeConnectors.none
        }
      ]
    }
  },
  {
    id: 'node-apps',
    type: 'special',
    position: { x: 5, y: 110 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.EXTERNAL_APPS_ACCESSING_FILES,
      dataId: 'numExternalAppsAccessingFiles',
      labelClassname: 'nodeLabel',
      stat: '',
      circleClassname: 'circleNode circleMedium nodeOrange',
      statColor: externalColor,
      sources: [
        {
          id: 'node-apps-source',
          positionType: 'right',
          style: { ...edgeConnectors.none, top: '40px', right: '25px' }
        }
      ]
    }
  },
  {
    id: 'node-2',
    type: 'special',
    position: { x: 160, y: 180 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.COMPANY_FILES,
      dataId: 'numFiles',
      stat: '',
      circleClassname: 'circleNode circleLarge nodeBlack',
      labelClassname: 'nodeLabel',
      statColor: darkGrey,
      sources: [
        {
          positionType: 'right',
          id: 'node-2-source',
          style: edgeConnectors.none
        },
        {
          positionType: 'left',
          id: 'node-2-source-left',
          style: edgeConnectors.none
        }
      ],
      targets: [
        {
          positionType: 'top',
          id: 'node-2-target-top',
          style: { ...edgeConnectors.arrows.down, ...edgeConnectors.arrows.down?.black }
        },
        {
          positionType: 'bottom',
          id: 'node-2-target-bottom',
          style: { ...edgeConnectors.arrows.up, ...edgeConnectors.arrows.up?.orange }
        },
        {
          positionType: 'left',
          id: 'node-2-target-upper-left',
          style: { ...edgeConnectors.arrows.right, ...edgeConnectors.arrows.right?.orange, top: '50px', left: '2px' }
        },
        {
          positionType: 'left',
          id: 'node-2-target-lower-left',
          style: { ...edgeConnectors.arrows.right, ...edgeConnectors.arrows.right?.orange, top: '80px', left: '2px' }
        }
      ]
    }
  },
  {
    id: 'external-users',
    type: 'special',
    position: { x: 7, y: 235 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.EXTERNAL_USERS_ACCESSING_FILES,
      dataId: 'numExternalUsersAccessingFiles',
      labelClassname: 'nodeLabel',
      stat: '',
      circleClassname: 'circleNode circleMedium nodeOrange',
      statColor: externalColor,
      sources: [
        {
          id: 'external-users-source',
          positionType: 'right',
          style: { ...edgeConnectors.none, ...{ right: '20px' } }
        }
      ]
    }
  },
  {
    id: 'node-3',
    type: 'special',
    position: { x: 7, y: 365 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.EXTERNAL_USERS_WITH_POTENTIAL_FILE_ACCESS,
      dataId: 'numExternalUsersWithPotentialFileAccess',
      stat: '',
      circleClassname: 'circleNode circleMedium nodeOrange',
      labelClassname: 'nodeLabel',
      statColor: externalColor,
      sources: [
        {
          positionType: 'right',
          id: 'node-3-source',
          style: edgeConnectors.none
        }
      ]
    }
  },
  {
    id: 'node-4',
    type: 'special',
    position: { x: 350, y: 40 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.FILES_SHARED_BY_LINK_INTERNALLY,
      dataId: 'numFilesSharedByLinkInternally',
      stat: '',
      circleClassname: 'circleNode circleMedium nodeBlack',
      labelClassname: 'nodeLabel',
      statColor: darkGrey,
      targets: [
        {
          positionType: 'left',
          id: 'node-4-target',
          style: { ...edgeConnectors.arrows.right, ...edgeConnectors.arrows.right?.black }
        }
      ],
      sources: [
        {
          positionType: 'right',
          id: 'node-4-source',
          style: { ...edgeConnectors.none, ...{ top: '53.5px', right: '15px' } }
        }
      ]
    }
  },
  {
    id: 'node-5',
    type: 'special',
    position: { x: 350, y: 190 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.FILES_SHARED_BY_LINK_EXTERNALLY,
      dataId: 'numFilesSharedByLinkExternally',
      stat: '',
      circleClassname: 'circleNode circleMedium nodeOrange',
      labelClassname: 'nodeLabel',
      statColor: externalColor,
      sources: [
        {
          positionType: 'right',
          id: 'node-5-source',
          style: { ...edgeConnectors.none, ...{ top: '55px', right: '15px' } }
        }
      ],
      targets: [
        {
          positionType: 'left',
          id: 'node-5-target',
          style: { ...edgeConnectors.arrows.right, ...edgeConnectors.arrows.right?.black }
        }
      ]
    }
  },
  {
    id: 'node-6',
    type: 'special',
    position: { x: 350, y: 330 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.FILES_SHARED_TO_PERSONAL_ACCOUNT,
      dataId: 'numFilesSharedToPersonal',
      stat: '',
      circleClassname: 'circleNode circleMedium nodeOrange',
      labelClassname: 'nodeLabel',
      statColor: externalColor,
      sources: [
        {
          positionType: 'right',
          id: 'node-6-source',
          style: { ...edgeConnectors.none, ...{ top: '55px', right: '15px' } }
        }
      ],
      targets: [
        {
          positionType: 'left',
          id: 'node-6-target',
          style: { ...edgeConnectors.arrows.right, ...edgeConnectors.arrows.right?.black }
        }
      ]
    }
  },
  {
    id: 'node-7',
    type: 'special',
    position: { x: 550, y: 55 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.SENSITIVE_FILES_AT_RISK_INTERNALLY,
      dataId: 'numSensitiveFilesSharedByLinkInternally',
      stat: '',
      circleClassname: 'circleNode circleSmall nodeRed',
      labelClassname: 'nodeLabel',
      statColor: sensitiveColor,
      targets: [
        {
          positionType: 'left',
          id: 'node-7-target',
          style: {
            ...edgeConnectors.none,
            ...{ top: '39px', left: '25px' },
            ...edgeConnectors.arrows.right,
            ...edgeConnectors.arrows.right?.black
          }
        }
      ]
    }
  },
  {
    id: 'node-8',
    type: 'special',
    position: { x: 550, y: 198 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.SENSITIVE_FILES_AT_RISK_EXTERNALLY,
      dataId: 'numSensitiveFilesSharedByLinkExternally',
      stat: '',
      circleClassname: 'circleNode circleSmall nodeRed',
      labelClassname: 'nodeLabel',
      statColor: sensitiveColor,
      targets: [
        {
          positionType: 'left',
          id: 'node-8-target',
          style: {
            ...edgeConnectors.none,
            ...{ top: '47px', left: '25px' },
            ...edgeConnectors.arrows.right,
            ...edgeConnectors.arrows.right?.orange
          }
        }
      ]
    }
  },
  {
    id: 'node-9',
    type: 'special',
    position: { x: 555, y: 350 },
    data: {
      label: UI_STRINGS.DASHBOARD_GRAPH.SENSITIVE_FILES_SHARED_TO_PERSONAL_ACCOUNT,
      dataId: 'numSensitiveFilesSharedToPersonal',
      stat: '',
      circleClassname: 'circleNode circleSmall nodeRed',
      labelClassname: 'nodeLabel',
      statColor: sensitiveColor,
      targets: [
        {
          positionType: 'left',
          id: 'node-9-target',
          style: {
            ...edgeConnectors.none,
            ...{ top: '35px', left: '25px' },
            ...edgeConnectors.arrows.right,
            ...edgeConnectors.arrows.right?.orange
          }
        }
      ]
    }
  }
]

export const edges: IEdge[] = [
  {
    id: 'edge-1',
    source: 'node-user-accounts',
    sourceHandle: 'node-user-accounts-source-right',
    target: 'node-2',
    targetHandle: 'node-2-target-top',
    style: { stroke: darkGrey },
    className: 'edgeDashed ',
    type: 'smoothstep',
    animated: false
  },
  {
    id: 'edge-user-accounts',
    source: 'node-apps',
    sourceHandle: 'node-apps-source',
    target: 'node-2',
    targetHandle: 'node-2-target-upper-left',
    style: { stroke: externalColor },
    type: 'smoothstep',
    className: 'edgeDashed',
    animated: false
  },
  {
    id: 'edge-2',
    source: 'node-3',
    sourceHandle: 'node-3-source',
    target: 'node-2',
    targetHandle: 'node-2-target-bottom',
    style: { stroke: externalColor },
    className: 'edgeDashed',
    type: 'smoothstep',
    animated: false
  },
  {
    id: 'edge-4',
    source: 'node-2',
    sourceHandle: 'node-2-source',
    target: 'node-5',
    targetHandle: 'node-5-target',
    style: { stroke: darkGrey },
    className: 'edgeDashed',
    type: 'smoothstep'
  },
  {
    id: 'external-users-edge',
    source: 'external-users',
    sourceHandle: 'external-users-source',
    target: 'node-2',
    targetHandle: 'node-2-target-lower-left',
    style: { stroke: externalColor },
    className: 'edgeDashed',
    type: 'smoothstep',
    animated: false
  },
  {
    id: 'edge-5',
    source: 'node-2',
    sourceHandle: 'node-2-source',
    target: 'node-6',
    targetHandle: 'node-6-target',
    style: { stroke: darkGrey },
    className: 'edgeDashed',
    type: 'smoothstep'
  },
  {
    id: 'edge-3',
    source: 'node-2',
    sourceHandle: 'node-2-source',
    target: 'node-4',
    targetHandle: 'node-4-target',
    style: { stroke: darkGrey },
    className: 'edgeDashed',
    type: 'smoothstep'
  },
  {
    id: 'edge-6',
    source: 'node-4',
    sourceHandle: 'node-4-source',
    target: 'node-7',
    targetHandle: 'node-7-target',
    style: { stroke: darkGrey },
    className: 'edgeDashed ',
    type: 'smoothstep'
  },
  {
    id: 'edge-7',
    source: 'node-5',
    sourceHandle: 'node-5-source',
    target: 'node-8',
    targetHandle: 'node-8-target',
    style: { stroke: externalColor },
    className: 'edgeDashed ',
    type: 'smoothstep'
  },
  {
    id: 'edge-8',
    source: 'node-6',
    sourceHandle: 'node-6-source',
    target: 'node-9',
    targetHandle: 'node-9-target',
    style: { stroke: externalColor },
    className: 'edgeDashed ',
    type: 'smoothstep'
  }
]
