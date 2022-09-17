import React, { useState, Dispatch, useContext } from 'react'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import { HelpQuestionsList, IHelpQuestion } from 'models/Help'
import ArrowIcon from 'icons/ArrowIcon'
import noop from 'lodash'
import { HELP_STRINGS } from 'util/help-strings'
import './Help.scss'

interface IContextValues {
  riskIds: RiskTypeId[]
  displayAnswers: boolean
  setDisplayAnswers: Dispatch<boolean>
  setRiskIds: Dispatch<RiskTypeId[]>
  activeQuestion: string
  setActiveQuestion: Dispatch<string>
}
const initialContext: IContextValues = {
  riskIds: [],
  displayAnswers: false,
  setDisplayAnswers: noop,
  setRiskIds: noop,
  activeQuestion: '',
  setActiveQuestion: noop
}
const HelpContext = React.createContext(initialContext)

interface HelpQuestionRowProps {
  question: string
  riskIds: RiskTypeId[]
}

const HelpQuestionRow: React.FC<HelpQuestionRowProps> = ({ question, riskIds }) => {
  const { setDisplayAnswers, setRiskIds, setActiveQuestion } = useContext(HelpContext)
  const clickHandler = () => {
    setDisplayAnswers(true)
    setRiskIds(riskIds)
    setActiveQuestion(question)
  }
  return (
    <div className='Help__question-row' onClick={clickHandler}>
      <div>{question}</div>
      <div>
        <ArrowIcon direction='right' className='Help__arrow' />
      </div>
    </div>
  )
}

const HelpQuestions: React.FC<{}> = () => (
  <div>
    <Typography variant={TypographyVariant.H4} weight='bold' className='Help__header'>
      {UI_STRINGS.HELP.TITLE}
    </Typography>
    <div className='Help__question-container'>
      {HelpQuestionsList.map((questionItem: IHelpQuestion) => (
        <HelpQuestionRow key={questionItem.question} question={questionItem.question} riskIds={questionItem.risk_ids} />
      ))}
    </div>
  </div>
)

const HelpAnswers: React.FC = () => {
  const { activeQuestion, riskIds, setDisplayAnswers } = useContext(HelpContext)

  return (
    <div>
      <div className='Help__activeQuestionContainer' onClick={() => setDisplayAnswers(false)}>
        <div>
          <ArrowIcon direction='left' className='Help__arrow' />
        </div>
        <div>{activeQuestion}</div>
      </div>
      <div className='Help__answerContainer'>
        {riskIds.map((riskId: number) => {
          const name = HELP_STRINGS.RISK_CATALOG[`RISK_${riskId}_NAME`]
          const description = HELP_STRINGS.RISK_CATALOG[`RISK_${riskId}_DESCRIPTION`]
          return (
            <div key={riskId}>
              <Typography variant={TypographyVariant.LABEL_LARGE}>{name}</Typography>
              <div>
                <Typography variant={TypographyVariant.BODY_LARGE}>{description}</Typography>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Help: React.FC<{}> = () => {
  const [displayAnswers, setDisplayAnswers] = useState(false)
  const [riskIds, setRiskIds] = useState<RiskTypeId[]>([])
  const [activeQuestion, setActiveQuestion] = useState('')
  const values: IContextValues = {
    riskIds,
    displayAnswers,
    setDisplayAnswers,
    setRiskIds,
    activeQuestion,
    setActiveQuestion
  }
  return (
    <HelpContext.Provider value={values}>
      <div className='Help__wrapper'>{displayAnswers ? <HelpAnswers /> : <HelpQuestions />}</div>
    </HelpContext.Provider>
  )
}

export default Help
