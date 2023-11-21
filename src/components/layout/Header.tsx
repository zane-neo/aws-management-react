import * as React from 'react'
import { NavLink } from 'react-router-dom'
import styled from '../../utils/styled'
import {Container} from './Container'
import { css } from 'emotion'

interface HeaderProps {
  title: string
}

const Header: React.SFC<HeaderProps> = ({ title }) => (
  <Wrapper>
    <HeaderInner>
      <HeaderLeft>
        <Title>{title}</Title>
      </HeaderLeft>
      <HeaderNav>
        <HeaderNavLink exact to="/home" activeClassName={HeaderLinkActive}>
          Home
        </HeaderNavLink>
        <HeaderNavLink to="/groups" activeClassName={HeaderLinkActive}>
          Groups
        </HeaderNavLink>
        <HeaderNavLink to="/nodes/all" activeClassName={HeaderLinkActive}>
          Nodes
        </HeaderNavLink>
      </HeaderNav>
      <HeaderRight>
        {/* <LayoutContainer>
          {({ theme, setTheme }) => (
            <React.Fragment>
              <CurrentTheme>Current theme: {theme}</CurrentTheme>
              <ThemeSwitcherButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                Switch theme
              </ThemeSwitcherButton>
            </React.Fragment>
          )}
        </LayoutContainer> */}
      </HeaderRight>
    </HeaderInner>
  </Wrapper>
)

export default Header

const Wrapper = styled('header')`
  padding: 0.5rem 1.5rem;
  background-color: ${props => props.theme.colors.brand};
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.fonts.headings};
  // width: 1880px;
`

const HeaderInner = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    flex-direction: row;
  }
`

const HeaderLeft = styled('div')`
  padding-right: 1rem;
`

const HeaderNav = styled('nav')`
  flex: 1 1 auto;
  margin: 1rem 0;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    margin: 0;
  }
`

const HeaderNavLink = styled(NavLink)`
  margin: 0 1rem;
`

const HeaderLinkActive = css`
  text-decoration: underline;
`

const HeaderRight = styled('div')`
  padding-left: 5rem;
`

const Title = styled('h2')`
  margin: 0;
  font-weight: 500;
`

const CurrentTheme = styled('span')`
  margin-right: 1rem;
`

const ThemeSwitcherButton = styled('button')`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.colors.white};
  border-radius: 3px;
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.brand};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover,
  &:focus {
    background-color: transparent;
    color: ${props => props.theme.colors.white};
  }
`
const GroupDropDownListTitle = styled('div')`
  display: inline-block;
`
const GroupDropDownLists = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.white};
  font-size: 0.8rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover,
  &:focus {
    background-color: transparent;
  }
`
const GroupDropDownListDiv = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  padding-left: 30px;
  background-color: ${props => props.theme.colors.brand};
  color: ${props => props.theme.colors.white};
  &:hover,
  &:focus {

  }
`
