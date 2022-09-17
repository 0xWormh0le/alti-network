import React from 'react'
import Marker, { MarkerType } from './Marker'
import { renderWithRouter } from 'test/support/helpers'

describe('Markers', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(
      <>
        <Marker type={MarkerType.Ext} />
        <Marker type={MarkerType.SensitiveContent} />
        <Marker type={MarkerType.EmailExteranl} />
        <Marker type={MarkerType.None} />
        <Marker type={MarkerType.Group} />
        <Marker type={MarkerType.User} />
        <Marker type={MarkerType.Unknown} />
        <Marker type={MarkerType.Internal} />
        <Marker type={MarkerType.InternalDiscoverable} />
        <Marker type={MarkerType.External} />
        <Marker type={MarkerType.ExternalDiscoverable} />
        <Marker type={MarkerType.Sensitive} />
      </>
    )
    expect(container).toMatchSnapshot()
  })
})
