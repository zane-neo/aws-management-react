import { action } from "typesafe-actions";
import { ClusterConfig, ClusterNodeStatus, InstanceResultGroupWrapper, InstanceTypes, RestartResult, ClusterConfigRequest, InstallPluginRequest, InstallPluginResponse, PluginQueryResponse, InstanceResult } from "./types";

export const fetchRequest = () => action(InstanceTypes.FETCH_REQUEST)
export const fetchSuccess = (data: InstanceResultGroupWrapper) => action(InstanceTypes.FETCH_SUCCESS, data)
export const fetchError = (message: string) => action(InstanceTypes.FETCH_FAILURE, message)

export const restartRequest = (ip: string, operation: string) => action(InstanceTypes.RESTART, {ip, operation})
export const restartSuccess = (data: RestartResult) => action(InstanceTypes.RESTART_SUCCESS, data)
export const restartFailure = (message: string) => action(InstanceTypes.RESTART_FAILURE, message)

export const instanceOpRequest = (instance_ids: string, operation: string) => action(InstanceTypes.INSTANCE_OP_REQUEST, {instance_ids, operation})
export const instanceOpSuccess = (data: RestartResult) => action(InstanceTypes.INSTANCE_OP_SUCEESS, data)
export const instanceOpFailure = (message: string) => action(InstanceTypes.INSTANCE_OP_FAILURE, message)

export const clusterNodeStatusRequest = () => action(InstanceTypes.CLUSTER_NODE_STATUS_REQUEST)
export const clusterNodeStatusSuccess = (data: ClusterNodeStatus[]) => action(InstanceTypes.CLUSTER_NODE_STATUS_SUCCESS, data)
export const clusterNodeStatusFailure = (message: string) => action(InstanceTypes.CLUSTER_NODE_STATUS_FAILURE, message)

export const nodeCreationRequest = (data: any) => action(InstanceTypes.NODE_CREATION_REQUEST, data)
export const nodeCreationSuccess = (data: RestartResult) => action(InstanceTypes.NODE_CREATION_SUCCESS, data)
export const nodeCreationFailure = (message: string) => action(InstanceTypes.NODE_CREATION_FAILURE, message)

export const clusterConfigCheckingRequest = (data: ClusterConfigRequest) => action(InstanceTypes.CLUSTER_CONFIG_CHECKING_REQUEST, data)
export const clusterConfigCheckingSuccess = (data: ClusterConfig) => action(InstanceTypes.CLUSTER_CONFIG_CHECKING_SUCCESS, data)
export const clusterConfigCheckingFailure = (message: string) => action(InstanceTypes.CLUSTER_CONFIG_CHECKING_FAILURE, message)

export const installPluginRequest = (data: InstallPluginRequest) => action(InstanceTypes.INSTALL_PLUGIN_REQUEST, data)
export const installPluginSuccess = (data: InstallPluginResponse) => action(InstanceTypes.INSTALL_PLUGIN_SUCCESS, data)
export const installPluginFailure = (message: string) => action(InstanceTypes.INSTALL_PLUGIN_FAILURE, message)

export const installPluginFilesRequest = (pluginType: string) => action(InstanceTypes.INSTALL_PLUGIN_LOCAL_FILES_REQUEST, pluginType)
export const installPluginFilesSuccess = (res: string[]) => action(InstanceTypes.INSTALL_PLUGIN_LOCAL_FILES_SUCCESS, res)
export const installPluginFilesFailure = (res: string) => action(InstanceTypes.INSTALL_PLUGIN_LOCAL_FILES_FAILURE, res)

export const pluginQueryRequest = (pluginName: string) => action(InstanceTypes.PLUGIN_QUERY_REQUEST, pluginName)
export const pluginQuerySuccess = (data: InstanceResult[]) => action(InstanceTypes.PLUGIN_QUERY_SUCCESS, data)
export const pluginQueryFailure = (message: string) => action(InstanceTypes.PLUGIN_QUERY_FAILUER, message)
