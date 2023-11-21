import React from "react";
import { connect } from "react-redux";
import styled from "../../utils/styled";
import { ApplicationState, ConnectedReduxProps } from "../../store";
import { ClusterConfig } from "../../store/ec2-management/types";

interface StateFromProps {
  clusterConfig: ClusterConfig | undefined
  closeClusterConfigModal: Function
  loading: boolean
}

interface ClusterConfigState {

}


type AllProps = StateFromProps & ConnectedReduxProps

class ConfigModal extends React.Component<AllProps, ClusterConfigState> {
  constructor(props: AllProps) {
    super(props)
  }

  public render() {
    console.log("entered config modal component")
    const { clusterConfig, loading } = this.props
      return !loading && clusterConfig !== undefined && (
        <div style={{"zIndex": 6, "position": "absolute", "backgroundColor": "white",
        "width": "300px", "left": "800px", "right": "900px", "display": "flex",
        "flexFlow": "column nowrap", "alignItems": "center", "top": "200px", "borderRadius": "5px",
        "marginTop": "1rem"}}>
          <CLusterConfigInnerDiv>
            <ClusterConfigInnerLeftDiv>opensearch version:</ClusterConfigInnerLeftDiv>
            <ClusterConfigInnerRightDiv>{clusterConfig.opensearch_version}</ClusterConfigInnerRightDiv>
          </CLusterConfigInnerDiv>
          <CLusterConfigInnerDiv>
            <ClusterConfigInnerLeftDiv>opensearch source:</ClusterConfigInnerLeftDiv>
            <ClusterConfigInnerRightDiv>{clusterConfig.opensearch_source}</ClusterConfigInnerRightDiv>
          </CLusterConfigInnerDiv>
          <CLusterConfigInnerDiv>
            <ClusterConfigInnerLeftDiv>build no:</ClusterConfigInnerLeftDiv>
            <ClusterConfigInnerRightDiv>{clusterConfig.ci_build_no}</ClusterConfigInnerRightDiv>
          </CLusterConfigInnerDiv>
          <CLusterConfigInnerDiv>
            <ClusterConfigInnerLeftDiv>platform:</ClusterConfigInnerLeftDiv>
            <ClusterConfigInnerRightDiv>{clusterConfig.platform}</ClusterConfigInnerRightDiv>
          </CLusterConfigInnerDiv>
          <button style={{"marginBottom": "1rem", "marginTop": "20px"}} onClick={() => this.props.closeClusterConfigModal()}>close</button>
        </div>
      )
  }

}

const mapStateToProps = ({ instance }: ApplicationState) => {
  return { clusterConfig: instance.clusterConfig }
}

const CLusterConfigInnerDiv = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;
`

const ClusterConfigInnerLeftDiv = styled('div')`
  margin-right: 5px;
  width: 150px;
  text-align: right;
`
const ClusterConfigInnerRightDiv  = styled('div')`
  margin-left: 5px;
  width: 50px;
  text-align: left;
`

export default connect(mapStateToProps)(ConfigModal)
