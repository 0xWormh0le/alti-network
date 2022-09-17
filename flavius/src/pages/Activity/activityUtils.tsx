import { FilterItem } from 'components/elements/Filter/Filter'
import { FileActivityType } from 'types/common'
import UI_STRINGS from 'util/ui-strings'

export const getFileActivityTypeLabel = (activityType: string): string =>
  activityType ? UI_STRINGS.ACVITITY.ACTIVITY_TYPE_LABEL[activityType] || '' : ''

const generateFileActivityOptions = (): FilterItem[] => {
  const optionsArr: FilterItem[] = []

  for (const value in FileActivityType) {
    if (value) {
      optionsArr.push({
        id: value,
        value,
        selected: true,
        label: getFileActivityTypeLabel(value)
      })
    }
  }

  return optionsArr
}

export const fileActivityOptions = generateFileActivityOptions()
