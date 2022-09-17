import React, { useState, useEffect } from 'react'
import {
  useAsyncState,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  BaseAvatar,
  ModernTable,
  Tab,
  TabList,
  Tabs,
  TabPanel
} from 'altitude-component-library'
// import 'altitude-component-library/dist/index.css'
// import SidebarTest from './Sidebar'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'altitude-component-library/dist/scss/components/elements/Sidebar.scss'
import 'altitude-component-library/dist/scss/components/base/BaseAvatar.scss'
import 'altitude-component-library/dist/scss/components/elements/Accordion.scss'
import 'altitude-component-library/dist/scss/components/elements/ModernTable.scss'
import 'altitude-component-library/dist/scss/components/widgets/Spinner.scss'
import 'altitude-component-library/dist/scss/components/elements/Button.scss'
import 'altitude-component-library/dist/scss/components/elements/ErrorBox.scss'
import 'altitude-component-library/dist/scss/components/elements/Tab.scss'
import SidebarTest from './Sidebar'

const TestHook: React.FC = () => {
  const [results] = useAsyncState<{ something: string }>(
    () => fetch('https://jsonplaceholder.typicode.com/comments/1').then((rs) => rs.json()),
    []
  )

  const [res, error] = useAsyncState(
    () => fetch('http://sadoijasdoijasdoiasjdoiasjdoiajdoiasdjasoij.com').then((rs) => rs.json()),
    []
  )

  const [, , isLoading] = useAsyncState(() => null)

  return (
    <div>
      <div>{JSON.stringify(results)}</div>
      <div>
        {JSON.stringify(error)} {JSON.stringify(res)}
      </div>
      <div>{`It should never be loading: ${isLoading}`}</div>
    </div>
  )
}

const App = () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => ({
    field1: v,
    field2: v.toString().repeat(v),
    field3: v * 863
  }))

  const [sort, setSort] = useState<'desc' | 'asc'>('desc')
  const [orderBy, setOrderBy] = useState<string>('field1')
  const [accordionContentSize, setAccordionContentSize] = useState(1)

  const [renderedItems, setRenderedItems] = useState(items)

  useEffect(() => {
    setRenderedItems(renderedItems.reverse())
  }, [renderedItems])

  return (
    <BrowserRouter>
      <Switch>
        {/* <Route exact path='/Sidebar'>
          <SidebarTest />
        </Route> */}
        <Route exact path='/brand'>
          <div className='Button Button--primary'>2</div>
          <div style={{ display: 'flex', margin: '1em' }}>
            <BaseAvatar colorList={['#AAFFAA']} name='Test e' />
            <span>Test with proper name value</span>
          </div>
          <div style={{ display: 'flex', margin: '1em' }}>
            <BaseAvatar colorList={['#AAFFAA']} name=' Test  e ' />
            <span>Test with broken name value</span>
          </div>
          <div style={{ display: 'flex', margin: '1em' }}>
            <BaseAvatar colorList={['#AAFFAA']} name='' />
            <span>Test with no name value</span>
          </div>

          <div style={{ display: 'flex', margin: '1em' }}>
            <BaseAvatar name='Bobbie Hawaii' src={{ url: 'https://thispersondoesnotexist.com/image' }} />
            <span>Bobbie Hawawii</span>
          </div>
        </Route>
        <Route exact path='/hooks'>
          <TestHook />
        </Route>
        <Route exact path='/table'>
          <div>
            <div style={{ width: '100vw', display: 'grid', placeItems: 'center' }}>
              <div style={{ width: '50%' }}>
                <ModernTable
                  fields={['field1', 'field2', 'field3']}
                  // defaultSortingHeaderState='asc'
                  items={renderedItems}
                  sortingHeaders={['field1', 'field2']}
                  setSort={setSort}
                  sort={sort}
                  setOrderBy={setOrderBy}
                  orderBy={orderBy}
                  scopedSlots={{
                    field1: (data) => {
                      return (
                        <img
                          alt=''
                          src='https://thispersondoesnotexist.com/image'
                          width={`${data.field1 * 10}em`}
                          height={`${data.field1 * 10}em`}
                        />
                      )
                    }
                  }}>
                  Test stuff <div>Test Stuff 2</div>
                </ModernTable>
                <ModernTable
                  items={[]}
                  fields={['field1', 'field2', 'field3']}
                  isLoading={true}
                  loadingComponent={<div>It's loading and stuffs.</div>}
                />
                <ModernTable items={[]} fields={['field1', 'field2', 'field3']} isLoading={false} />
                <ModernTable
                  noResultsMessage={'Nothing found oh no!'}
                  items={[]}
                  fields={['field1', 'field2', 'field3']}
                />
              </div>
            </div>
          </div>
        </Route>
        <Route exact path='/accordion'>
          <>
            <Accordion>
              <AccordionSummary>
                <p>Accordion Summary Default collapsed</p>
              </AccordionSummary>
              <AccordionDetails>Accordion Details here...</AccordionDetails>
            </Accordion>
            <Accordion expanded={true}>
              <AccordionSummary>
                <p>Accordion Summary Default expanded</p>
              </AccordionSummary>
              <AccordionDetails>
                Accordion Details here...
                {Array(accordionContentSize).fill(0).map((_, key) => (
                  <p key={key}>
                    Porta lorem mollis aliquam ut porttitor leo. Non sodales neque sodales ut etiam sit amet nisl purus.
                    Ut tellus elementum sagittis vitae et leo duis ut diam. Fringilla urna porttitor rhoncus dolor purus
                    non enim praesent elementum. Arcu felis bibendum ut tristique et egestas quis., sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
              </AccordionSummary>
              <AccordionDetails>
                <p>
                  Porta lorem mollis aliquam ut porttitor leo. Non sodales neque sodales ut etiam sit amet nisl purus.
                  Ut tellus elementum sagittis vitae et leo duis ut diam. Fringilla urna porttitor rhoncus dolor purus
                  non enim praesent elementum. Arcu felis bibendum ut tristique et egestas quis., sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              </AccordionDetails>
            </Accordion>
            <button onClick={() => setAccordionContentSize(prev => prev + 1)}>
              Add content
            </button>
          </>
        </Route>
        <Route exact path='/tab'>
          <Tabs width={400} remountOnSelect>
            <TabList>
              <Tab>First</Tab>
              <Tab>Second</Tab>
              <Tab>Third</Tab>
              <Tab>Fourth</Tab>
            </TabList>
            <TabPanel>React</TabPanel>
            <TabPanel>Angular</TabPanel>
            <TabPanel>Vue</TabPanel>
            <TabPanel>jQuery</TabPanel>
          </Tabs>
        </Route>
        <Route exact path='/sidebar'>
          <SidebarTest />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
