import React from 'react'
import ContentLoader from 'react-content-loader'
import RiskCatalog from 'models/RiskCatalog'
import RiskIndicator from 'components/elements/RiskIndicator'
import { routePathNames, largeNumberDisplay } from 'util/helpers'
import NavButton from 'components/elements/NavButton'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import './RiskTypesList.scss'

interface RiskTypeRowProps {
  riskType: RiskTypeSummary
}

const getRiskTypesQuery = (riskTypes: RiskTypeSummary[]): string =>
  `[${riskTypes.map((item) => item.riskTypeId).join()}]`

const RiskTypeRow: React.FC<RiskTypeRowProps> = ({ riskType }) => {
  const riskTypeInCatalog = Object.keys(RiskCatalog).find((key) => RiskCatalog[key].index === riskType.riskTypeId)
  if (riskTypeInCatalog) {
    const { name, shortName } = RiskCatalog[riskTypeInCatalog]
    return (
      <div className='RiskTypeRow'>
        <div className='RiskTypeRow--severity RiskTypesList--severity-column'>
          <RiskIndicator value={riskType.severity} />
        </div>
        <div className='RiskTypesList--type-column'>
          <Typography variant={TypographyVariant.BODY} weight='semibold' component='span'>
            {riskType.riskTypeId === RiskCatalog.ManyDownloadsByPersonInternal.index ||
            riskType.riskTypeId === RiskCatalog.ManyDownloadsByPersonExternal.index
              ? shortName
              : name}
          </Typography>
        </div>
        <div className='RiskTypesList--count-column'>
          <Typography variant={TypographyVariant.H2} component='span'>
            {largeNumberDisplay(riskType.count)}
          </Typography>
        </div>
        <div className='RiskTypesList--actions-column'>
          <NavButton
            route={`${routePathNames.RISKS}?riskTypeIds=[${riskType.riskTypeId}]`}
            action='secondary'
            text={UI_STRINGS.DASHBOARD.SEE_ALL}
          />
        </div>
      </div>
    )
  } else {
    return null
  }
}

export interface RiskTypesListProps {
  riskTypes: RiskTypeSummary[]
  loading?: boolean
  categoryLabel: string
}

export const RiskTypesList: React.FC<RiskTypesListProps> = ({ riskTypes, categoryLabel, loading }) => (
  <div className='RiskTypesList'>
    <div className='RiskTypesList__table'>
      <div className='RiskTypesList__headers'>
        <Typography
          variant={TypographyVariant.BODY_SMALL}
          weight='bold'
          component='div'
          uppercase={true}
          className='RiskTypesList__heading-cell RiskTypesList--severity-column'>
          {UI_STRINGS.DASHBOARD.RISK_SEVERITY}
        </Typography>
        <Typography
          variant={TypographyVariant.BODY_SMALL}
          weight='bold'
          component='div'
          uppercase={true}
          className='RiskTypesList__heading-cell RiskTypesList--type-column'>
          {UI_STRINGS.DASHBOARD.RISK_TYPE}
        </Typography>
        <Typography
          variant={TypographyVariant.BODY_SMALL}
          weight='bold'
          component='div'
          uppercase={true}
          className='RiskTypesList__heading-cell RiskTypesList--count-column'>
          {UI_STRINGS.DASHBOARD.RISK_COUNT}
        </Typography>
        <div className='RiskTypesList__heading-cell RiskTypesList--actions-column' />
      </div>
      <div className='RiskTypesList__rows'>
        {loading && (
          <ContentLoader
            backgroundColor='#eeeeee'
            foregroundColor='#fdfdfd'
            height={172}
            className='RiskTypesList__loader'
            uniqueKey='RiskTypesList__loader'>
            <rect x={0} y={15} width='100%' height={30} />
            <rect x={0} y={76} width='100%' height={30} />
            <rect x={0} y={137} width='100%' height={30} />
          </ContentLoader>
        )}
        {!loading &&
          riskTypes
            .sort((a, b) => b.severity - a.severity) // sort by descending severity
            .map((riskType) => <RiskTypeRow key={riskType.riskTypeId} riskType={riskType} />)}
        {!loading && riskTypes.length === 0 && (
          <Typography variant={TypographyVariant.H3} className='RiskTypesList__empty-message' component='div'>
            {UI_STRINGS.DASHBOARD.NO_RISK_TYPES_FOUND_FOR_CATEGORY}
          </Typography>
        )}
      </div>
    </div>
    {!loading && riskTypes.length > 0 && (
      <NavButton
        route={`${routePathNames.RISKS}?riskTypeIds=${getRiskTypesQuery(riskTypes)}`}
        action='primary'
        size='large'
        aria-label='show all risks'
        text={UI_STRINGS.DASHBOARD.SHOW_ALL_BY(categoryLabel)}
        disabled={loading}
        className='RiskTypesList__show-all-button'
      />
    )}
  </div>
)

export default RiskTypesList
