import styled from '../../utils/styled'

export const Container = styled('div')`
  margin: 0 2rem;
  width: auto;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  max-width: ${props => props.theme.widths.xl};

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    max-width: ${props => props.theme.widths.lg};
  }

  @media (min-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${props => props.theme.widths.xl};
  }
`

export const TableWrapper = styled('div')`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  max-width: ${props => props.theme.widths.xl};
`

export const TableLoadding = styled('tr')`
td {
  height: 48px;
  text-align: center;
}
`

export const ManagerButton = styled('button')`
display: inline-block;
padding: .25rem .25rem;
border: 1px solid ${props => props.theme.colors.white};
border-radius: 3px;
background-color: ${props => props.theme.colors.white};
color: ${props => props.theme.colors.brand};
font-size: .7rem;
text-transform: uppercase;
letter-spacing: 1px;
cursor: pointer;
transition: all .3s ease;
width: 120px;
margin: .5rem;


&:hover,
&:focus {
  background-color: transparent;
  color: ${props => props.theme.colors.white};
}
`

export const ManagerCheckDiv = styled('div')`
  display: flex;
  flex-flow: row wrap;
  algin-item: center;
  justify-content: flex-end;
`
