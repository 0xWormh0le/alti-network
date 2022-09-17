import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { generateRoutePath } from 'util/helpers'
import Tooltip from 'components/widgets/Tooltip'
// import BaseIcon from 'icons/BaseIcon'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { getNavigationItems, getSupportItems } from 'models/Visibility'
import { UserContextConsumer } from 'models/UserContext'
import UI_STRINGS from 'util/ui-strings'
import { Sidebar, SidebarSection, SidebarItem, SidebarNavMenu } from '@altitudenetworks/component-library'
import '@altitudenetworks/component-library/dist/scss/components/elements/Sidebar.scss'

const RouteItem = (props: { item: any; pathname: string }) => {
  const { item, pathname } = props

  if (item.disabled)
    return (
      <Tooltip text={UI_STRINGS.SIDEBAR.PAGE_NOT_ACTIVATED} id={`tooltip-sidebar-disabled-${item.label}-id`}>
        <div className='Sidebar__item Sidebar__link Sidebar__link--disabled'>
          {item.icon}
          <Typography variant={TypographyVariant.LABEL} weight='medium' className='align-middle'>
            {item.label}
          </Typography>
        </div>
      </Tooltip>
    )

  return (
    <Link className='Sidebar__link' to={generateRoutePath(item.routePath || item.label)}>
      <SidebarItem key={item.label} Icon={item.icon} isActive={pathname === generateRoutePath(item.label)}>
        {item.label}
      </SidebarItem>
    </Link>
  )
}

const MainSidebar: React.FC = () => {
  const { pathname } = useLocation()

  return (
    <UserContextConsumer>
      {({ authenticatedUser }) => (
        <Sidebar>
          <SidebarSection title={UI_STRINGS.SIDEBAR.MAIN_MENU}>
            {getNavigationItems(authenticatedUser).map((item) =>
              item.subItems && item.subItems.length ? (
                <SidebarNavMenu key={item.key} title={item.label} Icon={item.icon}>
                  {item.subItems.map((subItem) => (
                    <RouteItem key={subItem.key} item={subItem} pathname={pathname} />
                  ))}
                </SidebarNavMenu>
              ) : (
                <RouteItem key={item.key} item={item} pathname={pathname} />
              )
            )}
          </SidebarSection>

          <SidebarSection title={UI_STRINGS.SIDEBAR.SUPPORT}>
            {getSupportItems(authenticatedUser).map((item) => (
              <RouteItem key={item.label} item={item} pathname={pathname} />
            ))}
          </SidebarSection>
        </Sidebar>
      )}
    </UserContextConsumer>
  )
}

export default MainSidebar
