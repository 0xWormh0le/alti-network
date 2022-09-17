import React from 'react'
import InformationCard from 'components/elements/InformationCard'
import LightBulb from 'icons/LightBulb'
import UI_STRINGS from 'util/ui-strings'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import './InfoCards.scss'

export const ClassifySensitiveFilesInfo: React.FC = () => (
  <InformationCard
    icon={<LightBulb color='blue' />}
    iconLocation='top'
    className='InfoCards__details'
    summary={UI_STRINGS.RISK_SETTINGS.SENSITIVE_FILE_CLASSIFICATION.TITLE}>
    <div className='InfoCards__description'>
      <Typography variant={TypographyVariant.BODY} component='div'>
        <ul className='InfoCards__ul'>
          <li>{UI_STRINGS.RISK_SETTINGS.SENSITIVE_FILE_CLASSIFICATION.AUTOMATICALLY_CLASSIFIES}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.SENSITIVE_FILE_CLASSIFICATION.THE_CLASSIFIER_ENGINE}</li>
        </ul>
      </Typography>
    </div>
  </InformationCard>
)

export const ManageSensitivePhrasesInfo: React.FC = () => (
  <InformationCard
    icon={<LightBulb color='yellow' />}
    className='InfoCards__details'
    summary={UI_STRINGS.RISK_SETTINGS.MANAGING_SENSITIVE_PHRASES.TITLE}>
    <div className='InfoCards__description'>
      <Typography variant={TypographyVariant.BODY} component='div'>
        {UI_STRINGS.RISK_SETTINGS.MANAGING_SENSITIVE_PHRASES.RISK_ENGINE_LOOKS_FOR_THESE_PHRASE}
      </Typography>
      <Typography variant={TypographyVariant.BODY} component='div'>
        <ul className='InfoCards__ul'>
          <li>{UI_STRINGS.RISK_SETTINGS.MANAGING_SENSITIVE_PHRASES.FILENAMES_AND_FILE_CONTENT}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.MANAGING_SENSITIVE_PHRASES.ANY_CHARACTERS_WILL_BE_TREATED_LITERALLY}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.MANAGING_SENSITIVE_PHRASES.SENSITIVE_PHRASES_IGNORE_CAPITALIZATION}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.MANAGING_SENSITIVE_PHRASES.EXACT_MATCHING}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.MANAGING_SENSITIVE_PHRASES.PARTIAL_MATCHING}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.MANAGING_SENSITIVE_PHRASES.MAXIMUM_20_PHRASES_SUPPORTED}</li>
        </ul>
      </Typography>
    </div>
  </InformationCard>
)

export const DownloadsRiskThresholdAppliedInfo: React.FC = () => (
  <InformationCard
    icon={<LightBulb color='blue' />}
    iconLocation='top'
    className='InfoCards__details'
    summary={UI_STRINGS.RISK_SETTINGS.DOWNLOADS_RISK_THRESHOLD_APPLIED.TITLE}>
    <div className='InfoCards__description'>
      <Typography variant={TypographyVariant.BODY} component='div'>
        <ul className='InfoCards__ul'>
          <li>{UI_STRINGS.RISK_SETTINGS.DOWNLOADS_RISK_THRESHOLD_APPLIED.DOWNLOAD_THRESHOLD}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.DOWNLOADS_RISK_THRESHOLD_APPLIED.INTERNAL_DOWNLAOD}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.DOWNLOADS_RISK_THRESHOLD_APPLIED.EXTERNAL_DOWNLOAD}</li>
        </ul>
      </Typography>
    </div>
  </InformationCard>
)

export const RiskTypeSettingInfo: React.FC = () => (
  <InformationCard
    icon={<LightBulb color='blue' />}
    iconLocation='top'
    className='InfoCards__details'
    summary={UI_STRINGS.RISK_SETTINGS.RISK_TYPE_SETTINGS.TITLE}>
    <div className='InfoCards__description'>
      <Typography variant={TypographyVariant.BODY} component='div'>
        <ul className='InfoCards__ul'>
          <li>{UI_STRINGS.RISK_SETTINGS.RISK_TYPE_SETTINGS.DESCRIPTION}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.RISK_TYPE_SETTINGS.MORE_DETAIL}</li>
        </ul>
      </Typography>
    </div>
  </InformationCard>
)

export const WhitelistInfo: React.FC = () => (
  <InformationCard
    icon={<LightBulb color='blue' />}
    iconLocation='top'
    className='InfoCards__details'
    summary={UI_STRINGS.RISK_SETTINGS.WHAT_ARE_WHITELIST_HOW_APPLIED.TITLE}>
    <div className='InfoCards__description'>
      <Typography variant={TypographyVariant.BODY} component='div'>
        <ul className='InfoCards__ul'>
          <li>{UI_STRINGS.RISK_SETTINGS.WHAT_ARE_WHITELIST_HOW_APPLIED.INTRODUCTION}</li>
          <li>{UI_STRINGS.RISK_SETTINGS.WHAT_ARE_WHITELIST_HOW_APPLIED.EXAMPLE}</li>
        </ul>
      </Typography>
    </div>
  </InformationCard>
)

export const InternalDomainInfo: React.FC = () => (
  <InformationCard
    icon={<LightBulb color='blue' />}
    iconLocation='top'
    className='InfoCards__details'
    summary={UI_STRINGS.RISK_SETTINGS.WHAT_ARE_INTERNAL_DOMAINS_HOW_DIFFERENT.TITLE}>
    <div className='InfoCards__description'>
      <Typography variant={TypographyVariant.BODY} component='div'>
        <ul className='InfoCards__ul'>
          <li>{UI_STRINGS.RISK_SETTINGS.WHAT_ARE_INTERNAL_DOMAINS_HOW_DIFFERENT.INTRODUCTION}</li>
        </ul>
      </Typography>
    </div>
  </InformationCard>
)
