import React from 'react'
import Tooltip from 'components/widgets/Tooltip'

interface SvgProps {
  className: string
  alt?: string
  text: string
  secondaryText?: string
  onClick?: (...args: any[]) => void
}

class BaseTooltipIcon extends React.PureComponent<SvgProps> {
  public render() {
    const { text, secondaryText } = this.props
    const id = `tooltip-${text}-id`

    return (
      <Tooltip id={id} text={text} secondaryText={secondaryText}>
        {this.renderChild()}
      </Tooltip>
    )
  }

  protected renderChild(): JSX.Element {
    console.error('This method must be overriden')
    return <div />
  }
}

export default BaseTooltipIcon
