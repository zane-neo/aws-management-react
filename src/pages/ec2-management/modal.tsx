import React from "react"
import { connect } from "react-redux"
import { ModalInnerButtonDiv, ModalInnerCancelButton, ModalInnerConfirmButton, ModalInnerInputDiv, ModalInnerInputWrapper, ModalInnerLabel } from "../../components/modal/ModalInnerComponents"
import { InstanceResult } from "../../store/ec2-management/types"
import NodeCreationDiv from "../../components/modal/NodeCreationDiv"
import { ApplicationState, ConnectedReduxProps } from "../../store"
import { nodeCreationRequest } from "../../store/ec2-management/actions"
import NodeCreationInner from "../../components/modal/NodeCreationInner"


interface CreationState {
  groupName: string
  nodeType: string
  nodePurpose: string
  ebsSize: number
  instanceCount: number
  opensearchVersion: string
  opensearchPlatform: string
  opensearchSource: string
  buildNo: string
}

interface StateFromProps {
  instanceData: InstanceResult[],
  groups: String[],
  closeModal: Function
}

interface PropsFromDispatch {
  nodeCreationRequest: typeof nodeCreationRequest
}

type AllProps = StateFromProps & PropsFromDispatch & ConnectedReduxProps

class CreationModal extends React.Component<AllProps, CreationState> {
  constructor(props: AllProps) {
    super(props)
    this.state = {
      groupName: '',
      nodeType: '',
      nodePurpose: '',
      ebsSize: 50,
      instanceCount: 1,
      opensearchVersion: '',
      opensearchPlatform: '',
      buildNo: '',
      opensearchSource: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(type: string, event: React.ChangeEvent) {
    /**
     * refer to this link to resolve warning: Property 'value' does not exist on type 'EventTarget'.
     * https://stackoverflow.com/a/49515812
     */
    const target = event.target as HTMLInputElement;
    switch (type) {
      case 'opensearchVersion': {
        this.setState({opensearchVersion: target.value})
        break
      }
      case 'opensearchPlatform': {
        this.setState({opensearchPlatform: target.value})
        break
      }
      case 'buildNo': {
        this.setState({buildNo: target.value})
        break
      }
      case 'opensearchSource': {
        this.setState({opensearchSource: target.value})
        break
      }
      case 'nodeType': {
        this.setState({nodeType: target.value})
        break
      }
      case 'nodePurpose': {
        this.setState({nodePurpose: target.value})
        break
      }
      case 'groupName': {
        this.setState({groupName: target.value})
        break
      }
      case 'instanceCount': {
        this.setState({instanceCount: parseInt(target.value, 10)})
        break
      }
      case 'ebsSize': {
        this.setState({ebsSize: parseInt(target.value, 10)})
        break
      }
    }
  }

  handleSubmit = (op: string, event: React.MouseEvent) => {
    event.preventDefault()
    if(!this.props.groups.includes(this.state.groupName)) {
      this.props.closeModal()
      const params = {...this.state}
      params['clusterIps'] = ''
      console.log("request params are: " + JSON.stringify(params))
      this.props.nodeCreationRequest({operation: op, ...params})
    } else {
      alert("The input group already exist!")
    }
  }

  public render() {
      return (
        <NodeCreationDiv style={{"left": "70px"}}>
            <form>
              <NodeCreationInner>
                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>opensearch version: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='opensearchVersion' name='opensearchVersion' onChange={(e) => this.handleChange('opensearchVersion', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>opensearch platform: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='opensearchPlatform' name='opensearchPlatform' onChange={(e) => this.handleChange('opensearchPlatform', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>opensearch source: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='opensearchSource' name='opensearchSource' onChange={(e) => this.handleChange('opensearchSource', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>build no: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='buildNo' name='buildNo' onChange={(e) => this.handleChange('buildNo', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>node type: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='nodeType' name='nodeType' onChange={(e) => this.handleChange('nodeType', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>node purpose: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='nodePurpose' name='nodePurpose' onChange={(e) => this.handleChange('nodePurpose', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>group name: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='groupName' name='groupName' onChange={(e) => this.handleChange('groupName', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>instance count: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='instanceCount' name='instanceCount' onChange={(e) => this.handleChange('instanceCount', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerInputDiv>
                  <ModalInnerLabel>
                    <label>EBS size: </label>
                  </ModalInnerLabel>
                  <ModalInnerInputWrapper>
                    <input type='text' id='ebsSize' name='ebsSize' onChange={(e) => this.handleChange('ebsSize', e) }></input>
                  </ModalInnerInputWrapper>
                </ModalInnerInputDiv>

                <ModalInnerButtonDiv>
                  <ModalInnerConfirmButton onClick={(e) => this.handleSubmit('group', e)}>
                    Ok
                  </ModalInnerConfirmButton>
                  <ModalInnerCancelButton onClick={() => {
                   this.props.closeModal()
                  }}>
                    Cancel
                  </ModalInnerCancelButton>
                </ModalInnerButtonDiv>

              </NodeCreationInner>
            </form>
        </NodeCreationDiv>

      )
  }

}

const mapStateToProps = ({ instance }: ApplicationState) => {
  //Note this another approach to return object for this method.
  return { instanceData: instance.instanceData }
}

const mapDispatchToProps = {
  nodeCreationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(CreationModal)
