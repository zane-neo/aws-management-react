import React from "react";
import { connect } from "react-redux";
import styled from "../../utils/styled";
import { ApplicationState, ConnectedReduxProps } from "../../store";
import { installPluginFilesRequest, installPluginRequest } from "../../store/ec2-management/actions";
import { ManagerButton } from "../../components/layout/Container";

interface PropsFromState {
  showType: string
  checkedPublicIps: string[]
  buttonText: string,
  dropDownFiles: string[]
}

interface PropsFromDispatch {
  installPluginFilesRequest: typeof installPluginFilesRequest
  installPluginRequest: typeof installPluginRequest
}

interface DropDownState {
  show: boolean
}

type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps

class DropDown extends React.Component<AllProps, DropDownState> {
  constructor(props: AllProps) {
    super(props)
    this.state = {
      show: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  public handleSubmit = (event: React.MouseEvent, chosenFilePath: string) => {
    if (this.props.checkedPublicIps.length === 0) {
      alert("Please select at least one node")
      return
    }
    console.log("checked public ips are: " + this.props.checkedPublicIps)
    if (chosenFilePath === '' || chosenFilePath === undefined) {
      alert("please choose a file path")
      return
    }
    event.preventDefault()
    console.log("entered handle submit method" + ",show type is: " + this.props.showType + ", file path is:" + chosenFilePath + ",public is:" + this.props.checkedPublicIps)
    this.props.installPluginRequest({"type": this.props.showType, "filePath": chosenFilePath, "publicIps": this.props.checkedPublicIps})
  }

  public fetchMenu = () => {
    this.props.installPluginFilesRequest(this.props.showType)
  }

  public render() {
    const { buttonText } = this.props
    return (
      <DropDownWrapper onMouseLeave={() => this.setState({show: false})}>
        <ManagerButton style={{"height": "50px"}} onClick={() => {
            this.setState({show: this.state.show ? false : true})
            this.fetchMenu()
          }}>
          {buttonText}
        </ManagerButton>
        {this.state.show && <form>
          <div style={{"position": "absolute", "backgroundColor": "white"}}>
            {this.props.dropDownFiles.map(x => {
              return (
                <DropDownDiv key={x} onClick={(e) => {
                      console.log("started to set state, chosen file path is:" + x)
                      this.setState({show: false})
                      this.handleSubmit(e, x)
                    }
                  }>
                {x}
              </DropDownDiv>
              )
            })}
          </div>
        </form>
        }
      </DropDownWrapper>
    )
  }
}

const DropDownWrapper = styled('div')`
  position: relative;
  z-index: 5;
`

const DropDownDiv = styled('div')`
  cursor: pointer;
  font-size: .7rem;
  &:hover,
  &:focus {
    background-color: #f1f1f1
  }
`

const mapStateToProps = ( { instance } : ApplicationState) => {
  return {
    loading: instance.loading,
    instanceData: instance.instanceData,
    dropDownFiles: instance.dropDownFiles
  }
}

const mapDispatchToProps = {
  installPluginFilesRequest,
  installPluginRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(DropDown)
