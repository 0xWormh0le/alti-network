import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { Accordion, AccordionSummary, AccordionDetails, AccordionProps } from './index'

export default {
  title: 'Elements/Accordion',
  component: Accordion
} as Meta

const Template: Story<AccordionProps> = (args) => (
  <>
    <Accordion {...args}>
      <AccordionSummary>
        <p>Accordion Summary Default collapsed</p>
      </AccordionSummary>
      <AccordionDetails>Accordion Details here...</AccordionDetails>
    </Accordion>
    <Accordion {...args} expanded={true}>
      <AccordionSummary>
        <p>Accordion Summary Default expanded</p>
      </AccordionSummary>
      <AccordionDetails>Accordion Details here...</AccordionDetails>
    </Accordion>
    <Accordion {...args}>
      <AccordionSummary>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          Porta lorem mollis aliquam ut porttitor leo. Non sodales neque sodales ut etiam sit amet nisl purus. Ut tellus
          elementum sagittis vitae et leo duis ut diam. Fringilla urna porttitor rhoncus dolor purus non enim praesent
          elementum. Arcu felis bibendum ut tristique et egestas quis., sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua.
        </p>
        <p>
          Vivamus arcu felis bibendum ut. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras
          tincidunt. Dolor sit amet consectetur adipiscing elit pellentesque. Pulvinar sapien et ligula ullamcorper
          malesuada proin libero nunc. Gravida rutrum quisque non tellus. Massa vitae tortor condimentum lacinia quis
          vel eros.
        </p>
      </AccordionDetails>
    </Accordion>
  </>
)

export const Default = Template.bind({})
Default.args = {
  expanded: false
}
