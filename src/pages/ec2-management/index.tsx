import React from 'react'
import { connect } from 'react-redux'
import { ApplicationState, ConnectedReduxProps } from '../../store'
import { fetchRequest, restartRequest, instanceOpRequest, clusterNodeStatusRequest, restartSuccess, nodeCreationRequest, clusterConfigCheckingRequest, pluginQueryRequest } from '../../store/ec2-management/actions'
import Page from '../../components/layout/Page'
import {Container, ManagerButton, ManagerCheckDiv, TableLoadding, TableWrapper} from '../../components/layout/Container'
import LoadingOverlay from '../../components/data/LoadingOverlay'
import LoadingOverlayInner from '../../components/data/LoadingOverlayInner'
import LoadingSpinner from '../../components/data/LoadingSpinner'
import styled from '../../utils/styled'
import DataTable from '../../components/layout/DataTable'
import NodeCreationDiv from '../../components/modal/NodeCreationDiv'
import NodeCreationInner from '../../components/modal/NodeCreationInner'
import { ModalInnerInputDiv, ModalInnerLabel, ModalInnerInputWrapper, ModalInnerConfirmButton, ModalInnerButtonDiv, ModalInnerCancelButton } from '../../components/modal/ModalInnerComponents'
import { ClusterConfig, InstallPluginResponse, InstanceResult, PluginQueryResponse, RestartResult } from '../../store/ec2-management/types'
import { RouteComponentProps, RouteProps } from 'react-router'
import ConfigModal from './configModal'
import DropDown from './DropDown'

interface PropsFromState {
  loading: boolean
  instanceData: InstanceResult[]
  errors?: string
  param?: string
  restartData: RestartResult | undefined
  clusterConfig: ClusterConfig | undefined
  installPluginResponse: InstallPluginResponse | undefined
  pluginQueryResponse: PluginQueryResponse[]
}

interface PropsFromDispatch {
  fetchRequest: typeof fetchRequest
  restartRequest: typeof restartRequest
  restartSuccess: typeof restartSuccess
  instanceOpRequest: typeof instanceOpRequest
  clusterNodeStatusRequest: typeof clusterNodeStatusRequest
  nodeCreationRequest: typeof nodeCreationRequest
  clusterConfigCheckingRequest: typeof clusterConfigCheckingRequest
  pluginQueryRequest: typeof pluginQueryRequest
}

/**
 * refer this linke to resolve: this.props.match.params.group's match warning: Property 'match' does not exist on type 'Readonly<AllProps> & Readonly<{ children?: ReactNode; }>'.
 * https://stackoverflow.com/a/62712326
*/
interface IReactRouterParams {
  group: string
}

type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps & RouteProps & RouteComponentProps<IReactRouterParams>

interface ClusterPageState {
  showNodeCreationModal?: boolean
  nodePurpose: string
  instanceCount: number
  groupName: string
  nodeType: string
  ebsSize: number
  lastOperation: string
  errorMessage: string
  selectd: string[]
  clusterConfigModal: boolean
  bootInstanceIndexMap: Map<string, number>
  instanceOperationDone: boolean
  opensearchPlatform: string
  prompts: string[]
  dataNodePublicIp: string
}

class HelloWorldPage extends React.Component<AllProps, ClusterPageState> {
  constructor(props: AllProps) {
    super(props);
    this.state = {
      showNodeCreationModal: false,
      nodePurpose: '',
      instanceCount: 1,
      groupName: '',
      opensearchPlatform: '',
      nodeType: '',
      ebsSize: 50,
      lastOperation: '',
      errorMessage: '',
      selectd: [],
      clusterConfigModal: false,
      bootInstanceIndexMap: new Map(),
      instanceOperationDone: false,
      prompts: [],
      dataNodePublicIp: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private myInterval: NodeJS.Timeout | undefined

  public componentDidMount() {
    this.props.fetchRequest()
  }

  handleChange(type: string, event: React.ChangeEvent) {
    /**
     * refer to this link to resolve warning: Property 'value' does not exist on type 'EventTarget'.
     * https://stackoverflow.com/a/49515812
     */
    const target = event.target as HTMLInputElement;
    switch (type) {
      case 'nodeType': {
        this.setState({nodeType: target.value})
        break
      }
      case 'nodePurpose': {
        this.setState({nodePurpose: target.value})
        break
      }
      case 'opensearchPlatform': {
        this.setState({opensearchPlatform: target.value})
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

    const data_node: InstanceResult | undefined = this
                .props
                .instanceData
                .filter(x => x.group_name === this.props.match.params.group)
                .find(x => x.node_purpose === 'data_node' || x.node_purpose === 'cluster_manager')
    // alert("found data node is: " + JSON.stringify(data_node))
    if (data_node === undefined || data_node.public_dns_name === undefined) {
      alert("No data node found, can't process")
      return
    }
    console.log("data node public ip is: {}" + data_node.public_dns_name)
    const params = {...this.state}
    // refer this blog to resolve: The operand of a 'delete' operator must be optional
    // https://bobbyhadz.com/blog/typescript-operand-of-delete-operator-must-be-optional
    delete params.showNodeCreationModal

    const cluster_ips: string[] = []
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group).forEach(x => cluster_ips.push(x.private_dns_name))
    const cluster_ips_str = cluster_ips.join(',')
    params['clusterIps'] = cluster_ips_str
    params['dataNodePublicIp'] = data_node.public_dns_name
    params['groupName'] = this.props.match.params.group
    console.log("request params are: " + JSON.stringify(params))
    this.props.nodeCreationRequest({operation: op, ...params})
    this.setState({showNodeCreationModal: false})
  }

  public createNewSSHTunnelForGroup = () => {
    const { instanceData } = this.props
    console.log("entered create ssh tunnel function")
    /**
     * Check the method find first and it's return type is [T | undefined], and if only set firstDataNode type to InstanceResult there'll be a warning.
     * Change the type to [InstanceResult | undefined] can fix this, which also means the firstDataNode could be undefined(not found).
     */
    const firstDataNode: InstanceResult | undefined = instanceData.find(x => x.group_name === this.props.match.params.group && x.node_purpose === 'data_node')
    console.log("found first data node:" + JSON.stringify(firstDataNode))
    if(firstDataNode !== undefined) {
      this.props.restartRequest(firstDataNode.public_dns_name, "createSSHTunnel")
    }
  }

  public generateSSHCommand = (publicDnsName: string) => {
    alert("ssh -i ~/zaniu-ec2-nopass.pem ec2-user@" + publicDnsName)
  }

  public generateSSHTunnel = (publicDnsName: string, localPort: number, remotePort: number) => {
    alert("ssh -i /Users/zaniu/zaniu-ec2-nopass.pem -L " + localPort + ":127.0.0.1:" + remotePort
    + " ec2-user@" + publicDnsName)
  }

  public handleOperationAndChangeColor = (instanceId: string, ip: string, op: string) => {
    if (ip === undefined || ip === '') {
      alert("public dns name is empty")
    } else {
      this.setState({lastOperation: instanceId})
      this.props.restartRequest(ip, op)
    }
  }

  public handleInstanceAndChangeColor = (instanceId: string, op: string) => {
    this.state.prompts.push("Instance operation completed, please refresh page to check latest status")
    this.setState({lastOperation: instanceId, instanceOperationDone: true})
    this.props.instanceOpRequest(instanceId, op)
  }

  public postClusterProcessing = () => {
    if (this.state.selectd.length === 0) {
      alert('no instances selected!')
    }
    const cluster_ips: string[] = []
    const public_ips: string[] = []
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group
      && this.state.selectd.find(y => y === x.public_dns_name)).forEach(x => {
      cluster_ips.push(x.private_dns_name)
      if (x.public_dns_name !== undefined && x.public_dns_name != '') {
        public_ips.push(x.public_dns_name)
      }
    })
    const cluster_ips_str = cluster_ips.join(',')
    const public_ips_str = public_ips.join(',')
    console.log("built public ips string is: " + public_ips_str)
    this.props.nodeCreationRequest({operation: 'postprocessing', clusterIps: cluster_ips_str, publicIps: public_ips_str})
  }

  public installMLPluginsForCurrentGroup = () => {
    if (this.state.selectd.length === 0) {
      alert('no instances selected!')
    }
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group
      && this.state.selectd.find(y => x.public_dns_name === y)).forEach(x => {
      this.props.restartRequest(x.public_dns_name, 'installml')
    })
  }

  public installNeuralSearchPluginsForCurrentGroup = () => {
    if (this.state.selectd.length === 0) {
      alert('no instances selected!')
    }
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group
      && this.state.selectd.find(y => x.public_dns_name === y)).forEach(x => {
      this.props.restartRequest(x.public_dns_name, 'installneural')
    })
  }

  installOpensearchDashboard(public_dns_name: string): void {
    this.props.restartRequest(public_dns_name, "installOSDashboard")
  }

  public selectOnChange = (instanceStatus: string, publicDnsName: string) => {
    if (instanceStatus === 'stopped') {
      alert("Current instance status is stopped")
      return
    }
    let index = this.state.selectd.indexOf(publicDnsName)
    if (index !== -1) {
      const newList = [...this.state.selectd]
      newList.splice(index, 1)
      this.setState({selectd: newList})
    } else {
      const newList = [...this.state.selectd]
      newList.push(publicDnsName)
      this.setState({selectd: newList})
    }

  }

  public selectAll = () => {
    const selectTemp: string[] = []
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group)
    .forEach(x => {
      selectTemp.push(x.public_dns_name)
    })
    this.setState({selectd: selectTemp})
  }

  public unSelectAll = () => {
    this.setState({selectd: []})
  }

  public checkClusterConfigs = () => {
    if (this.props.clusterConfig !== undefined) {
      this.setState({clusterConfigModal: true})
    } else {
      const publicIps: string[] = []
      this.props.instanceData.filter(x => x.group_name === this.props.match.params.group && x.node_purpose === 'data_node')
      .forEach(x => publicIps.push(x.public_dns_name))
      if (publicIps.length === 0) {
        alert("public dns names are empty!")
      } else {
        this.props.clusterConfigCheckingRequest({operation: "checkClusterConfig", publicIps: publicIps[0], clusterIps: ""})
        this.setState({clusterConfigModal: true})
      }
    }
  }

  public closeClusterConfigModal= () => {
    this.setState({clusterConfigModal: false})
  }

  public startOpensearchService = () => {
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group).forEach(x =>
      this.handleOperationAndChangeColor(x.instance_id, x.public_dns_name, "restart"))
  }

  public startOpenSearchDashboard = () => {
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group &&
        x.node_purpose === 'data_node').forEach(x =>
      this.handleOperationAndChangeColor(x.instance_id, x.public_dns_name, "startDashboard"))
  }

  public stopOpensearchService = () => {
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group).forEach(x =>
      this.handleOperationAndChangeColor(x.instance_id, x.public_dns_name, "stop"))
  }

  public bootAllInstances = () => {
    console.log("starting to create my interval")
    this.myInterval = setInterval(this.bootAInstance, 3000)
  }

  public bootAInstance = () => {
    const instanceData: InstanceResult | undefined = this.popAnElement()
    if (instanceData !== undefined) {
      this.props.instanceOpRequest(instanceData.instance_id, "ON")
    } else {
      console.log('started to clear my interval')
      if (this.myInterval !== undefined) {
        clearInterval(this.myInterval)
        this.myInterval = undefined
        console.log("instance operation completed, start writing data to prompts")
        this.state.prompts.push("Instance operation completed, please refresh page to check latest status")
        this.setState({instanceOperationDone: true})
      }
    }
  }

  public popAnElement = () => {
    const curIndex = this.state.bootInstanceIndexMap.get(this.props.match.params.group)
    if (curIndex === undefined) {
      this.state.bootInstanceIndexMap.set(this.props.match.params.group, 0)
    } else {
      this.state.bootInstanceIndexMap.set(this.props.match.params.group, curIndex + 1)
    }
    const matches: InstanceResult[] = this.props.instanceData.filter(x => x.group_name === this.props.match.params.group)
    const nextIndex: number | undefined = this.state.bootInstanceIndexMap.get(this.props.match.params.group)
    if (nextIndex !== undefined && nextIndex < matches.length) {
      return matches[nextIndex]
    } else {
      this.state.bootInstanceIndexMap.delete(this.props.match.params.group)
    }
  }

  public shutDownInstances = () => {
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group).forEach(x => {
      this.props.instanceOpRequest(x.instance_id, 'OFF')
    })
    console.log("instance operation completed, start writing data to prompts")
    this.state.prompts.push("Instance operation completed, please refresh page to check latest status")
    this.setState({instanceOperationDone: true})
  }

  public mySetIntervalWithFixTimes = (func: Function, interval: number, times: number) => {
    let time = 0;
    let innerInterval = setInterval(() => {
      func()
      if (++time === times) {
        clearInterval(innerInterval)
      }
    }, interval)
  }

  public copyAllInstancesIps = () => {
    const publicIps: string[] = []
    this.props.instanceData.filter(x => x.group_name === this.props.match.params.group).forEach(x => {
      publicIps.push(x.public_dns_name)
    })
    alert(publicIps)
  }

  public render() {
      const { loading } = this.props
      return (
      <Page>
        <Container>
          <ManagerCheckDiv>
            <ManagerButton onClick={() => this.postClusterProcessing()}>
                    Post cluster processing
            </ManagerButton>
            <ManagerButton onClick={() => this.setState({showNodeCreationModal: true})}>
                    Add node
            </ManagerButton>
            <ManagerButton onClick={() => this.props.clusterNodeStatusRequest()}>
                    Check Manager
            </ManagerButton>
            <ManagerButton onClick={() => this.createNewSSHTunnelForGroup()}>
                    Create SSH for data node
            </ManagerButton>
            {/* <ManagerButton onClick={() => this.installMLPluginsForCurrentGroup()}>
                    Install ml plugin
            </ManagerButton>
            <ManagerButton onClick={() => this.installMLPluginsForCurrentGroup()}>
                    Install neural search plugin
            </ManagerButton> */}
            <ManagerButton onClick={() => this.checkClusterConfigs()}>
                    Check cluster configs
            </ManagerButton>
            <ManagerButton onClick={() => this.bootAllInstances()}>
                    Boot instances
            </ManagerButton>
            <ManagerButton onClick={() => this.shutDownInstances()}>
                    Shutdown instances
            </ManagerButton>
            <ManagerButton onClick={() => this.startOpensearchService()}>
                    Restart opensearch service
            </ManagerButton>
            <ManagerButton onClick={() => this.startOpenSearchDashboard()}>
                    Start opensearch dashboard
            </ManagerButton>
            <ManagerButton onClick={() => this.stopOpensearchService()}>
                    Stop opensearch service
            </ManagerButton>
            <ManagerButton onClick={() => this.copyAllInstancesIps()}>
                    Copy all instance IPs
            </ManagerButton>
            {/* <ManagerButton onClick={() => this.props.pluginQueryRequest('neural-search')}>
                    Check neuralsearch plugins
            </ManagerButton> */}
            <DropDown showType="ml" checkedPublicIps={[...this.state.selectd]} buttonText="install ml plugin">
            </DropDown>
            <DropDown showType="neuralsearch" checkedPublicIps={[...this.state.selectd]} buttonText="install neural-search plugin">
            </DropDown>
          </ManagerCheckDiv>
          <ManagerCheckDiv style={{"alignItems": "left"}}>
            <ManagerButton onClick={() => this.selectAll()}>
                    Check all
            </ManagerButton>
            <ManagerButton onClick={() => this.unSelectAll()}>
                    UnCheck all
            </ManagerButton>
          </ManagerCheckDiv>
          {
            this.state.instanceOperationDone && this.state.prompts.length !== 0 && !this.props.loading && this.state.prompts.map((y, i) => {
              return (
              <div key={i} style={{"display": "flex", "flexFlow": "row nowrap", "backgroundColor": "#00ffff", "width": "100%"}}>
              <div style={{"height": "25px",
              "textAlign": "center", "display": "block", "paddingTop": "3px",
              "flexGrow": 30}}>
                {y}
            </div>
              <a onClick={() => {
                this.state.prompts.splice(i, 1)
                this.setState({instanceOperationDone: false})
              }}
              style={{"paddingRight": "20px", "cursor": "pointer", "textAlign": "right"}}>x</a>
            </div>
            )})
          }
          {
            this.props.installPluginResponse != undefined && this.props.installPluginResponse.failures != undefined
            && this.props.installPluginResponse.failures.length !== 0 && alert("there're failures:" + JSON.stringify(this.props.installPluginResponse.failures))
          }
          <TableWrapper>
            {
              this.state.showNodeCreationModal && (
                <NodeCreationDiv>
                  <form>
                    <NodeCreationInner>
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
                          <label>opensearch platform: </label>
                        </ModalInnerLabel>
                        <ModalInnerInputWrapper>
                          <input type='text' id='opensearchPlatform' name='opensearchPlatform' onChange={(e) => this.handleChange('opensearchPlatform', e) }></input>
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
                        <ModalInnerConfirmButton onClick={(e) => this.handleSubmit('instance', e)}>
                          Ok
                        </ModalInnerConfirmButton>
                        <ModalInnerCancelButton onClick={() => this.setState({showNodeCreationModal: false})}>
                          Cancel
                        </ModalInnerCancelButton>
                      </ModalInnerButtonDiv>

                    </NodeCreationInner>
                  </form>
                </NodeCreationDiv>
              )
            }
            {this.state.clusterConfigModal && <ConfigModal closeClusterConfigModal={() => this.closeClusterConfigModal()}
              clusterConfig={this.props.clusterConfig} loading={this.props.loading}></ConfigModal>}
            {loading && (
              <LoadingOverlay>
                <LoadingOverlayInner>
                  <LoadingSpinner />
                </LoadingOverlayInner>
              </LoadingOverlay>
            )}
            {this.renderData()}
          </TableWrapper>
        </Container>
      </Page>
      )
  }

  private renderData() {
    const { loading, instanceData } = this.props

    return (
      <DataTable columns={['select', 'group_name', 'node_id', 'node_purpose', 'instance_type', 'public_dns_name',
      'private_ip_address', 'instance_state', 'os_running', 'manager', 'operations']}
      widths={['20px','20px', '20px', '20px', '20px', '20px', '20px', '20px', '20px', '150px']}>
          { loading == true && instanceData.length === 0 && (
            <TableLoadding>
              <td colSpan={3}>Loading...</td>
            </TableLoadding>
          )}
          {
            // This is how to use props or state in inline style: https://stackoverflow.com/a/37827390
            instanceData.filter(x => x.group_name === this.props.match.params.group || this.props.match.params.group === "all").map(res => (
              <tr key={res.instance_id} style={{"backgroundColor": this.state.lastOperation === res.instance_id ? "	#bfff00":"", "textAlign": "center"}}>
                <td><input type='checkbox' name="checkbox" id={res.public_dns_name} value={res.public_dns_name}
                onChange= {() => this.selectOnChange(res.instance_state, res.public_dns_name)}
                checked={this.state.selectd.indexOf(`${res.public_dns_name}`) !== -1} ></input></td>
                <td>{res.group_name}</td>
                <td>{res.node_id}</td>
                <td>{res.node_purpose}</td>
                <td>{res.instance_type}</td>
                <td>{res.public_dns_name}</td>
                <td>{res.private_ip_address}</td>
                <td>{res.instance_state}</td>
                <td>{res.opensearch_running}</td>
                <td>{res.is_manager}</td>
                <OperationStyle>
                  <OperationWrapperStyle>
                    <Operation>
                      <a onClick={() => this.handleOperationAndChangeColor(res.instance_id, res.public_dns_name, "restart")}>restart</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.handleOperationAndChangeColor(res.instance_id, res.public_dns_name, "stop")}>stop</a>
                    </Operation>
                    {/* <Operation>
                      <a onClick={() => this.handleRestartAndChangeColor(res.instance_id, res.public_dns_name, "installml")}>installml</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.handleRestartAndChangeColor(res.instance_id, res.public_dns_name, "installneural")}>installneural</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.handleRestartAndChangeColor(res.instance_id, res.public_dns_name, "updateConfig")}>updateconfig</a>
                    </Operation> */}
                    {/* <Operation>
                      <a onClick={() => this.handleOperationAndChangeColor(res.instance_id, res.public_dns_name, "reinstallos")}>reinstallos</a>
                    </Operation> */}
                    <Operation>
                      <a onClick={() => this.installOpensearchDashboard(res.public_dns_name)}>install OS dashboard</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.generateSSHTunnel(res.public_dns_name, 5601, 5601)}>5601 tunnel</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.generateSSHCommand(res.public_dns_name)}>generateSSH</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.generateSSHTunnel(res.public_dns_name, 9200, 9200)}>9200 tunnel</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.generateSSHTunnel(res.public_dns_name, 9251, 9251)}>9251 tunnel</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.handleInstanceAndChangeColor(res.instance_id, "ON")}>ON</a>
                    </Operation>
                    <Operation>
                      <a onClick={() => this.handleInstanceAndChangeColor(res.instance_id, "OFF")}>OFF</a>
                    </Operation>
                  </OperationWrapperStyle>
                </OperationStyle>
              </tr>
            ))
          }
      </DataTable>
    )
  }
}

const OperationStyle = styled('td')`
  flex: 1 1 auto;
  width: 480px;
  height: 45px;
  display: flex;
  flex-direction: row;
`

const OperationWrapperStyle = styled('div')`
  flex: 1 1 auto;
  height: 45px;
  display: flex;
  flex-direction: row;
`

const Operation = styled('div')`
  flex: 1 1 auto;
  height: 45px;
  align-items: center;
  display: flex;
  a {
    color: ${props => props.theme.colors.brand};
    cursor: pointer;
    margin: .1rem
  }
`

// ApplicationState is an interface which has several fields: layout, heroes, teams, router etc.
// Here we extract the teams field in this class, and fetch the state into props.
const mapStateToProps = ({ instance }: ApplicationState) => ({
  instanceData: instance.instanceData,
  restartData: instance.restartData,
  clusterNodeStatus: instance.clusterNodeStatus,
  loading: instance.loading,
  errors: instance.errors,
  clusterConfig: instance.clusterConfig,
  installPluginResponse: instance.installPluginResponse,
  pluginQueryResponse: instance.pluginQueryResponse
})

const mapDispatchToProps = {
  fetchRequest,
  restartRequest,
  restartSuccess,
  instanceOpRequest,
  clusterNodeStatusRequest,
  nodeCreationRequest,
  clusterConfigCheckingRequest,
  pluginQueryRequest
}
// Connect the props we fetched above to current class.
export default connect(mapStateToProps, mapDispatchToProps)(HelloWorldPage)
