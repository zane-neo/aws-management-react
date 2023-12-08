export interface InstanceResult extends ApiResponse {
  node_purpose: string
  instance_id: string
  instance_type: string
  private_ip_address: string
  private_dns_name: string
  public_dns_name: string
  instance_state: string
  opensearch_running: boolean
  is_manager: string,
  node_id: string,
  group_name: string,
  errors?: string,
  plugin_version: string,
  launch_time: string
}

export interface ClusterNodeStatus extends ApiResponse {
  ip: string
  cluster_manager: string
  node_id: string
}

export interface InstanceResultGroupWrapper extends ApiResponse {
  instanceResult: InstanceResult[]
  groups: String[]
  restartResult?: RestartResult
}

export type ApiResponse = Record<string, any>

export type ApiRequest = Record<string, any>

export const enum InstanceTypes {
  FETCH_REQUEST = '@@helloworld/FETCH_REQUEST',
  FETCH_SUCCESS = '@@helloworld/FETCH_SUCCESS',
  FETCH_FAILURE = '@@helloworld/FETCH_FAILURE',

  RESTART = '@@helloworld/RESTART',
  RESTART_SUCCESS = '@@helloworld/RESTART_SUCCESS',
  RESTART_FAILURE = '@@helloworld/RESTART_FAILURE',

  INSTANCE_OP_REQUEST = '@@helloworld/INSTANCE_OP_REQUEST',
  INSTANCE_OP_SUCEESS = '@@helloworld/INSTANCE_OP_SUCCESS',
  INSTANCE_OP_FAILURE = '@@helloworld/INSTANCE_OP_FAILURE',

  CLUSTER_NODE_STATUS_REQUEST = '@@helloworld/CLUSTER_NODE_STATUS_REQUEST',
  CLUSTER_NODE_STATUS_SUCCESS = '@@helloworld/CLUSTER_NODE_STATUS_SUCCESS',
  CLUSTER_NODE_STATUS_FAILURE = '@@helloworld/CLUSTER_NODE_STATUS_FAILURE',

  NODE_CREATION_REQUEST = '@@helloworld/NODE_CREATION_REQUEST',
  NODE_CREATION_SUCCESS = '@@helloworld/NODE_CREATION_SUCCESS',
  NODE_CREATION_FAILURE = '@@helloworld/NODE_CREATION_FAILURE',

  CLUSTER_CONFIG_CHECKING_REQUEST = '@@helloworld/CLUSTER_CONFIG_CHECKING_REQUEST',
  CLUSTER_CONFIG_CHECKING_SUCCESS = '@@helloworld/CLUSTER_CONFIG_CHECKING_SUCCESS',
  CLUSTER_CONFIG_CHECKING_FAILURE = '@@helloworld/CLUSTER_CONFIG_CHECKING_FAILURE',

  INSTALL_PLUGIN_REQUEST = '@@helloworld/INSTALL_PLUGIN_REQUEST',
  INSTALL_PLUGIN_SUCCESS = '@@helloworld/INSTALL_PLUGIN_SUCCESS',
  INSTALL_PLUGIN_FAILURE = '@@helloworld/INSTALL_PLUGIN_FAILURE',

  INSTALL_PLUGIN_LOCAL_FILES_REQUEST = '@@helloworld/INSTALL_PLUGIN_LOCAL_FILES_REQUEST',
  INSTALL_PLUGIN_LOCAL_FILES_SUCCESS = '@@helloworld/INSTALL_PLUGIN_LOCAL_FILES_SUCCESS',
  INSTALL_PLUGIN_LOCAL_FILES_FAILURE = '@@helloworld/INSTALL_PLUGIN_LOCAL_FILES_FAILURE',

  PLUGIN_QUERY_REQUEST = '@@helloworld/PLUGIN_QUERY_REQUEST',
  PLUGIN_QUERY_SUCCESS = '@@helloworld/PLUGIN_QUERY_SUCCESS',
  PLUGIN_QUERY_FAILUER = '@@helloworld/PLUGIN_QUERY_FAILURE'
}

export interface RestartResult extends ApiResponse {
  acknowledge: boolean
  error: string
}

export interface ClusterConfigRequest extends ApiRequest {
  operation: string
  publicIps: string
  clusterIps: string
}

export interface ClusterConfig extends ApiResponse {
  opensearch_version: string
  opensearch_source: string
  ci_build_no: string
  platform: string
}

export interface RestartRequest {
  ip: string
  operation: string
}

export interface InstallPluginRequest {
  type: string
  filePath: string
  publicIps: string[]
}

export interface InstallPluginFilesListResponse {
  files: string[]
  error: string
}

export interface InstallPluginResponse {
  error: string
  failures: string[]
}

export interface PluginQueryResponse {
  name: string
  component: string
  version: string
}

export interface InstanceState {
  readonly loading: boolean
  readonly instanceData: InstanceResult[]
  readonly restartData: RestartResult | undefined
  readonly clusterNodeStatus?: ClusterNodeStatus[]
  readonly errors? : string
  readonly param?: string
  readonly groups: String[]
  readonly clusterConfig: ClusterConfig | undefined
  readonly dropDownFiles: string[]
  readonly installPluginResponse: InstallPluginResponse | undefined
  readonly pluginQueryResponse: PluginQueryResponse[]
}
