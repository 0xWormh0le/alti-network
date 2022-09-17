import React from 'react'
import { Sidebar, SidebarItem, SidebarNavMenu, SidebarSection } from 'altitude-component-library'
import { Link } from 'react-router-dom'
import 'altitude-component-library/dist/scss/components/elements/Sidebar.scss'
import { useLocation } from 'react-router'
// import { Sidebar, SidebarSection, SidebarLink, Icons } from 'altitude-component-library'

const DumbIcon = () => {
  return (
    <svg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 239 239'>
      <g>
        <path
          d='M235.91,117.885l-26.319-19.132l-36.961-45.007c-1.424-1.734-3.551-2.74-5.796-2.74H7.5
		c-4.142,0-7.5,3.357-7.5,7.5v106.779c0,4.143,3.358,7.5,7.5,7.5h19.736c3.105,8.846,11.536,15.209,21.43,15.209
		s18.325-6.363,21.43-15.209h96.141c3.105,8.846,11.536,15.209,21.43,15.209c9.894,0,18.325-6.363,21.43-15.209H231.5
		c4.142,0,7.5-3.357,7.5-7.5v-41.334C239,121.551,237.851,119.296,235.91,117.885z M48.666,172.994
		c-4.251,0-7.709-3.458-7.709-7.709s3.458-7.709,7.709-7.709s7.709,3.458,7.709,7.709S52.917,172.994,48.666,172.994z
		 M187.667,172.994c-4.251,0-7.709-3.458-7.709-7.709s3.458-7.709,7.709-7.709c4.25,0,7.708,3.458,7.708,7.709
		S191.918,172.994,187.667,172.994z M224,157.785h-14.896c-3.104-8.848-11.541-15.209-21.436-15.209
		c-9.895,0-18.332,6.361-21.437,15.209H70.103c-3.104-8.848-11.542-15.209-21.437-15.209s-18.332,6.361-21.437,15.209H15V66.006
		h148.288l35.321,43.009c0.405,0.493,0.87,0.932,1.386,1.307L224,127.771V157.785z'
        />
        <path
          d='M162.469,75.551c-2.01-2.448-5.341-3.367-8.324-2.302c-2.982,1.068-4.972,3.894-4.972,7.062v25.766
		c0,4.143,3.358,7.5,7.5,7.5h21.16c0.007,0,0.013,0,0.02,0c4.142,0,7.5-3.357,7.5-7.5c0-1.98-0.768-3.781-2.021-5.122
		L162.469,75.551z'
        />
      </g>
    </svg>
  )
}

const SidebarTest = () => {
  const { pathname } = useLocation()
  const mainLinks = ['/someplace1', '/someplace2', '/someplace3']
  const navLinks = ['/navplace1', '/navplace2']

  console.log({ pathname })
  return (
    <div>
      <Sidebar>
        <SidebarSection title='Main'>
          {mainLinks.map((link) => (
            <SidebarItem key={link} isActive={pathname === link} Icon={<DumbIcon />}>
              <Link to={link}>{link}</Link>
            </SidebarItem>
          ))}
          <SidebarNavMenu
            Icon={
              <img
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Microsoft_Office_logo_%282013%E2%80%932019%29.svg/1200px-Microsoft_Office_logo_%282013%E2%80%932019%29.svg.png'
                alt='micro'
              />
            }
            title='SomeNavMenu'>
            {navLinks.map((link) => (
              <SidebarItem key={link} isActive={pathname === link} Icon={<DumbIcon />}>
                <Link to={link}>{link}</Link>
              </SidebarItem>
            ))}
          </SidebarNavMenu>
        </SidebarSection>
        <SidebarSection title='Settings'>
          <SidebarItem
            Icon={
              <img
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Microsoft_Office_logo_%282013%E2%80%932019%29.svg/1200px-Microsoft_Office_logo_%282013%E2%80%932019%29.svg.png'
                alt='micro'
              />
            }>
            <Link to='/somewhere'>Somewhere</Link>
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
    </div>
  )
}

export default SidebarTest
