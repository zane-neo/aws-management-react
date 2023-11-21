import styled from 'react-emotion'

export const ModalInnerInputDiv = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`

export const ModalInnerButtonDiv = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`

export const ModalInnerConfirmButton = styled('button')`
  display: inline-block;
  padding: .25rem .25rem;
  border: 1px solid ${props => props.theme.colors.brand};
  border-radius: 3px;
  color: white;
  background-color: ${props => props.theme.colors.brand};
  font-size: 1rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all .3s ease;
  width: 70px;
  margin: .3rem 1rem;

  &:hover,
  &:focus {
    background-color: transparent;
  }
`

export const ModalInnerCancelButton = styled('button')`
  display: inline-block;
  padding: .25rem .25rem;
  border: 1px solid ${props => props.theme.colors.background};
  border-radius: 3px;
  color: black;
  background-color: ${props => props.theme.colors.background};
  font-size: 1rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all .3s ease;
  width: 70px;
  margin: .3rem 1rem;

  &:hover,
  &:focus {
    background-color: transparent;
  }
`

export const ModalInnerLabel = styled('label')`
  margin-right: .3rem;
`

export const ModalInnerInputWrapper = styled('div')`
  display: block;
`

export const ModalInnerInput = styled('div')`
  input {
    border-color: "#d9d9d9";
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
  }
`
