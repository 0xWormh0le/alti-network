import React from 'react'
import ContentLoader from 'react-content-loader'
import { ellipsify } from 'util/helpers'

export const truncatedFileName = (fileName: string): string => ellipsify(fileName, 60)

export const shouldTruncate = (fileName: string): boolean =>
  fileName !== truncatedFileName(fileName) && truncatedFileName(fileName).indexOf(' ') < 0

interface FileAttributeProps {
  label: string
  value: JSX.Element
}

export const FileAttribute: React.FC<FileAttributeProps> = ({ label, value }) => (
  <span className='EditFilePermissionHeader__file-attribute'>
    <span>{label}</span>
    {value}
  </span>
)

export const EditFilePermissionHeaderLoading = () => (
  <div className='EditFilePermissionHeaderLoading'>
    <ContentLoader
      backgroundColor='#f0f0f0'
      foregroundColor='#f7f7f7'
      height={67}
      width={520}
      className='EditFilePermissionHeaderLoading__content'
      uniqueKey='EditFilePermissionHeaderLoading__content'>
      <rect x={0} y={12} width={520} height={20} rx={4} ry={4} />
      <rect x={0} y={48} width={380} height={15} rx={4} ry={4} />
    </ContentLoader>
    {/* <LinkSharingIndicator className='EditFilePermissionHeaderLoading__sharing-indicator' value='none' loading={true} /> */}
  </div>
)
