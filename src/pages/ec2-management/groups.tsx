import { Container, ManagerButton, ManagerCheckDiv, TableLoadding, TableWrapper } from "../../components/layout/Container";
import Page from "../../components/layout/Page";
import { ApplicationState, ConnectedReduxProps } from "../../store";
import { fetchRequest, instanceOpRequest } from "../../store/ec2-management/actions";
import { InstanceResult, RestartResult } from "../../store/ec2-management/types";
import LoadingOverlay from "../../components/data/LoadingOverlay";
import LoadingOverlayInner from "../../components/data/LoadingOverlayInner";
import LoadingSpinner from "../../components/data/LoadingSpinner";
import DataTable from "../../components/layout/DataTable";
import { connect } from "react-redux";
import styled from "../../utils/styled";
import { Link } from "react-router-dom";
import React from "react";
import CreationModal from "./modal";

interface PropsFromState {
  loading: boolean
  instanceData: InstanceResult[]
  groups: String[]
  errors?: string
  showNodeCreationModa: boolean
  restartData: RestartResult | undefined
}

interface PropsFromDispatch {
  fetchRequest: typeof fetchRequest
  instanceOpRequest: typeof instanceOpRequest
}

interface GroupNames {
  groupNames: String[],
  showNodeCreationModal: boolean
}

type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps

/**
 * First generic type is properties, and the second one is the current page's state.
 * Current page state needs a interface definition in current file.
 */
class GroupPage extends React.Component<AllProps, GroupNames> {
  constructor(props: AllProps) {
    super(props)
    this.state = {
      groupNames: [],
      showNodeCreationModal: false
    }
  }

  public componentDidMount(): void {
      const res = this.props.fetchRequest()
      setInterval(this.scheduledShutDownAll, 60 * 60 * 1000)
      console.log("component did mound completed" + JSON.stringify(res))
  }

  public closeModal = () => {
      this.setState({showNodeCreationModal: false})
  }

  public scheduledShutDownAll = () => {
    console.log("entered a scheduled shutdown method")
    const currentDate = new Date();
    const time = currentDate.getHours()
    console.log("fetched current time is: " + time)
    // if (time === 17) {
    //   alert("remember to shut down all instances!")
    // }
  }

  public shutDownAll = () => {
    console.log("######################started to shut down all instances!######################")
    const instance_ids: String[] = []
    this.props.instanceData.map(x => {
      instance_ids.push(x.instance_id)
    })
    console.log("built instance ids:" + JSON.stringify(instance_ids.join(',')))
    this.props.instanceOpRequest(instance_ids.join(','), "OFF")
  }

  public render() {
      const { loading } = this.props
      return (
        <Page>
          <ManagerCheckDiv>
            <ManagerButton onClick={() => this.setState({showNodeCreationModal: true})}>
              Add group
            </ManagerButton>
            <ManagerButton onClick={() => this.shutDownAll()}>
              Stop all instances
            </ManagerButton>
          </ManagerCheckDiv>
          <Container style={{maxWidth: '850px', "marginLeft": "450px"}}>
            <TableWrapper style={{"width": "850px", "minHeight": "700px"}}>
              {
                // Below is an example shows how to pass parameters to child components, please note that pure value should be passed with curly brackets only, not a method.
                this.state.showNodeCreationModal && <CreationModal closeModal={() => this.closeModal()} groups={this.props.groups}/>
              }
              {
                loading && (
                  <LoadingOverlay>
                    <LoadingOverlayInner>
                      <LoadingSpinner/>
                    </LoadingOverlayInner>
                  </LoadingOverlay>
                )
              }
              {this.renderData()}
            </TableWrapper>
          </Container>
        </Page>
      )
  }

  private renderData() {
    const { loading, groups } = this.props
    return (
      <DataTable columns={['group_name', 'details']} widths={['50px', '50px']}>
        {loading == true && (
          <TableLoadding>
            <td colSpan={3}>Loading...</td>
          </TableLoadding>
        )}
        {
         groups !== undefined && groups.map(res => (
            <tr key={res.toString()}>
              <td style={{"textAlign": "center"}}>{res.toString()}</td>
              <td style={{"textAlign": "center"}}>
                <DetailsStyle to={{pathname: `/nodes/${res.toString()}`}} >
                  details
                </DetailsStyle>
              </td>
            </tr>
         ))
        }
      </DataTable>
    )
  }
}

const mapStateToProps = ({ instance }: ApplicationState) => ({
  instanceData: instance.instanceData,
  restartData: instance.restartData,
  loading: instance.loading,
  errors: instance.errors,
  groups: instance.groups
})

const mapDispatchToProps = {
  fetchRequest,
  instanceOpRequest
}

const DetailsStyle = styled(Link)`
  color: ${props => props.theme.colors.brand};
  cursor: pointer;
  margin: 0.3rem;
`

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage)
