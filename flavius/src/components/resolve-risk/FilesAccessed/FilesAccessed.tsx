import React from 'react'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { searchWithoutModalParams, isExternalEmail, modalBasePath, truncateText, pluralize } from 'util/helpers'
import { UserContextConsumer } from 'models/UserContext'
import ButtonCell from 'components/elements/ButtonCell'
import Tooltip from 'components/widgets/Tooltip'
import UI_STRINGS from 'util/ui-strings'
import { ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import noop from 'lodash/noop'
import './FilesAccessed.scss'

export interface FilesAccessedProps extends RouteComponentProps {
  files: IFile[]
  pageSize: number
  pageCount: number
  pageNumber: number
  entityCount: number
  loading: boolean
  email?: string
  onPageChange: (nextPage: number) => void
}

const FilesAccessed: React.FC<FilesAccessedProps> = (props) => {
  const { match, files, pageSize, pageCount, pageNumber, entityCount, loading, onPageChange, email } = props

  return (
    <div className='FilesAccessed'>
      {!!entityCount && !loading && (
        <Typography variant={TypographyVariant.LABEL} component='div' weight='normal' className='FilesAccessed__label'>
          {entityCount} {pluralize('file', entityCount)} in total
        </Typography>
      )}
      <ModernTable
        isLoading={loading}
        loadingComponent={<TableLoading />}
        items={files}
        fields={['file']}
        scopedSlots={{
          file: (val) => {
            return (
              <span className='DescriptionCell'>
                <Link to={`${modalBasePath()}/file/${encodeURIComponent(val.fileId)}${searchWithoutModalParams()}`}>
                  {truncateText(val.fileName, 60)}
                </Link>
              </span>
            )
          }
        }}
        actions={(val) => {
          return (
            <Link
              to={{
                pathname: `${match.url}/permissions/${val.fileId}`,
                search: searchWithoutModalParams({ modalPage: pageNumber }), // has to pass in modalPage here, because the ResolveRisk responds to modalPage, while this link will leads to another modal on top of the existing modal. Try test like this, Resolve Risk Modal -> Go to page 2 -> Edit Permissions, the table behind the permissions table won't reload
                state: {
                  email,
                  fileCount: entityCount
                }
              }}>
              <UserContextConsumer>
                {({ domains }) => {
                  let tooltip = ''
                  if (val.createdBy) {
                    tooltip = isExternalEmail(domains, val.createdBy.primaryEmail?.address ?? '')
                      ? UI_STRINGS.RESOLVE_RISK.PERMISSIONS_EXTERNALLY_OWNED_CANT_BE_REMOVED_HERE(val.platformId)
                      : ''
                  } else {
                    tooltip = UI_STRINGS.RESOLVE_RISK.PERMISSIONS_SHARED_CANT_BE_REMOVED_HERE(val.platformId)
                  }

                  return tooltip === '' ? (
                    <ButtonCell
                      value={{
                        text: 'Edit Permissions'
                      }}
                      onClick={noop}
                    />
                  ) : (
                    <Tooltip text={tooltip}>
                      <span className='TooltipButton'>
                        <ButtonCell
                          value={{
                            text: 'Edit Permissions'
                          }}
                          onClick={noop}
                          className='Button--disabled'
                        />
                      </span>
                    </Tooltip>
                  )
                }}
              </UserContextConsumer>
            </Link>
          )
        }}>
        <EntityCountPagination
          entityCount={entityCount}
          onPageChange={onPageChange}
          pageCount={pageCount}
          pageNumber={pageNumber}
          pageSize={pageSize}
        />
      </ModernTable>
    </div>
  )
}

export default withRouter(FilesAccessed)
