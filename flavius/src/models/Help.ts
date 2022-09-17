import UI_STRINGS from 'util/ui-strings'

export interface IHelpQuestion {
  question: string
  risk_ids: RiskTypeId[]
}

export const HelpQuestionsList: IHelpQuestion[] = [
  {
    question: UI_STRINGS.HELP.SHARING_RISKS,
    risk_ids: [1011, 1013, 1020, 1021, 1022, 1023]
  },
  {
    question: UI_STRINGS.HELP.RELATIONSHIP_RISKS,
    risk_ids: [2000, 2001, 2002, 2003]
  },
  {
    question: UI_STRINGS.HELP.ACTIVITY_RISKS,
    risk_ids: [3100, 3200, 3010, 3012]
  },
  {
    question: UI_STRINGS.HELP.INFORMATIONAL_RISKS,
    risk_ids: [0, 10, 11]
  }
]
