import React from 'react'
import ContentLoader from 'react-content-loader'
import cx from 'classnames'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { largeNumberDisplay } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import useQueryParam from 'util/hooks/useQueryParam'
import { isLitePlatform } from 'util/platforms'
import { FileGridNavType } from 'types/common'
import './FileGridNav.scss'

export interface FileGridNavProps {
  selectedNavKey: FileGridNavType
  loading: boolean
  onChangeSelection: (selection: FileGridNavType) => void
  internalCount?: number
  externalCount?: number
  isFolder: boolean
  filesInFolderCount?: number
}

export const FileGridNav: React.FC<FileGridNavProps> = ({
  selectedNavKey,
  onChangeSelection,
  loading,
  externalCount,
  internalCount,
  filesInFolderCount,
  isFolder
}) => {
  const [sensitive] = useQueryParam('sensitive', false)
  const [platformId] = useQueryParam('platformId', '')

  return (
    <div className='FileGridNav'>
      <div className='FileGridNav__group'>
        {sensitive && (
          <FileGridNavItem
            key={FileGridNavType.SENSITIVE}
            itemKey={FileGridNavType.SENSITIVE}
            label={UI_STRINGS.FILE.FILE_SENSITIVE_CONTENTS}
            selected={selectedNavKey === FileGridNavType.SENSITIVE}
            loading={loading}
            onSubNavClick={onChangeSelection}
          />
        )}
        {isLitePlatform(platformId) ? (
          <FileGridNavItem
            key={FileGridNavType.DETAILS}
            itemKey={FileGridNavType.DETAILS}
            label={UI_STRINGS.FILE.FILE_DETAILS}
            selected={selectedNavKey === FileGridNavType.DETAILS}
            loading={loading}
            onSubNavClick={onChangeSelection}
          />
        ) : (
          <>
            <FileGridNavItem
              key={FileGridNavType.TIMELINE}
              itemKey={FileGridNavType.TIMELINE}
              label={UI_STRINGS.FILE.FILE_ACTION_TIMELINE}
              selected={selectedNavKey === FileGridNavType.TIMELINE}
              loading={loading}
              onSubNavClick={onChangeSelection}
            />
            <FileGridNavItem
              key={FileGridNavType.INTERNAL}
              itemKey={FileGridNavType.INTERNAL}
              label={UI_STRINGS.FILE.INTERNAL_COLLABORATORS}
              selected={selectedNavKey === FileGridNavType.INTERNAL}
              loading={loading}
              value={internalCount}
              onSubNavClick={onChangeSelection}
            />
            <FileGridNavItem
              key={FileGridNavType.EXTERNAL}
              itemKey={FileGridNavType.EXTERNAL}
              label={UI_STRINGS.FILE.EXTERNAL_COLLABORATORS}
              selected={selectedNavKey === FileGridNavType.EXTERNAL}
              loading={loading}
              value={externalCount}
              onSubNavClick={onChangeSelection}
            />
          </>
        )}
        <FileGridNavItem
          key={FileGridNavType.FILES_IN_FOLDER}
          itemKey={FileGridNavType.FILES_IN_FOLDER}
          label={isFolder ? UI_STRINGS.FILE.FILES_IN_FOLDER : UI_STRINGS.FILE.ALL_FOLDER_CONTENTS}
          selected={selectedNavKey === FileGridNavType.FILES_IN_FOLDER}
          loading={loading}
          value={filesInFolderCount}
          onSubNavClick={onChangeSelection}
        />
      </div>
    </div>
  )
}

interface FileGridNavItemProps {
  label: string
  itemKey: FileGridNavType
  selected: boolean
  loading: boolean
  value?: number
  onSubNavClick: (key: FileGridNavType) => void
}

const FileGridNavItem: React.FC<FileGridNavItemProps> = ({
  itemKey,
  label,
  selected,
  loading,
  value,
  onSubNavClick
}) => (
  <nav
    key={itemKey}
    className={cx('FileGridNav__item', {
      'FileGridNav__item--selected': selected
    })}
    onClick={() => onSubNavClick(itemKey)}>
    <Typography variant={TypographyVariant.BODY_SMALL} component='span' className='FileGridNav__item-label'>
      {label}
    </Typography>
    <Typography
      variant={TypographyVariant.BODY_SMALL}
      weight='bold'
      component='span'
      className='FileGridNav__item-value'>
      {loading ? (
        <FileGridNavNumberLoading active={selected} />
      ) : typeof value === 'number' ? (
        largeNumberDisplay(value)
      ) : (
        ''
      )}
    </Typography>
  </nav>
)

const FileGridNavNumberLoading = ({ active }: { active: boolean }) => (
  <div className='FileGridNavNumberLoading'>
    <ContentLoader
      backgroundColor={active ? '#52a3ff' : '#F0F0F0'}
      foregroundColor={active ? '#d0e6ff' : '#F7F7F7'}
      height={45}
      width={32}
      uniqueKey={`FileGridNavNumberLoading-${active ? 'blue' : 'grey'}`}>
      <rect x={0} y={16} width={32} height={13} rx={4} ry={4} />
    </ContentLoader>
  </div>
)

export default FileGridNav
