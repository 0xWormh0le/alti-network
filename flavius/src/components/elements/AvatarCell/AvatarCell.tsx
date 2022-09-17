import React from 'react'
import Person from 'models/Person'
import { BaseAvatar } from '@altitudenetworks/component-library/'
import CONSTANTS from 'util/constants'

export interface AvatarCellProps {
  person: Person
}

const AvatarCell: React.FC<AvatarCellProps> = ({ person }) => (
  <div className='AvatarCell'>
    <BaseAvatar src={person.avatar} name={person.displayName} colorList={CONSTANTS.COLOR_LIST} />
  </div>
)

export default AvatarCell
