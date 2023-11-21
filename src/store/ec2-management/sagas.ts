import { delay } from "redux-saga"
import { all, call, put, takeEvery, fork, select, take} from "redux-saga/effects"
import { PayloadAction } from "typesafe-actions/dist/types"
import { ApplicationState } from ".."
import { callApi_1 } from "../../utils/api_1"
import { callApi } from "../../utils/api"
import { fetchError, fetchSuccess, restartFailure, instanceOpFailure,
  clusterNodeStatusFailure, nodeCreationFailure, nodeCreationSuccess, clusterConfigCheckingSuccess, clusterConfigCheckingFailure, installPluginFailure, installPluginSuccess, installPluginFilesFailure, installPluginFilesSuccess, pluginQueryFailure, pluginQuerySuccess } from "./actions"
import { ClusterNodeStatus, InstanceResult, InstanceTypes, RestartRequest, RestartResult, ClusterConfig, ClusterConfigRequest, InstallPluginRequest, InstallPluginFilesListResponse, InstallPluginResponse, PluginQueryResponse } from "./types"

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000'

const getInstanceData = (state: ApplicationState) => state.instance.instanceData
const getClusterNodeStatus = (state: ApplicationState) => state.instance.clusterNodeStatus

function processGroupNames(data: InstanceResult[]): String[] {
  const groupNames: String[] = []
  data.forEach(x => {
      if(groupNames.indexOf(x.group_name) === -1) {
        groupNames.push(x.group_name)
      }
    })
    console.log("processed group names are!!!!!! : " + JSON.stringify(groupNames))
    return groupNames
}

function* handleFetch() {
  try {
    const instanceData: InstanceResult[] = yield select(getInstanceData)
    // console.log("read instance data are: " + JSON.stringify(instanceData))
    if (instanceData !== undefined && instanceData.length !== 0) {
      const groupNames = processGroupNames(instanceData)
      yield put(fetchSuccess({"instanceResult": instanceData, "groups": groupNames}))
    } else {
      const res: {result: InstanceResult[], error: string} = yield call(callApi_1, 'get', API_ENDPOINT, '/')
      if (res.error) {
        yield put(fetchError(res.error))
        alert("operation failed")
      } else {
        const groupNames = processGroupNames(res.result)
        yield put(fetchSuccess({"instanceResult": res.result, "groups": groupNames}))
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err.stack!))
    } else {
      yield put(fetchError('An unknown error occured'))
    }
  }
}

/**
 * Check the action defined in actions.ts can find the action method returns a type of: PayloadAction<T, P>
 * So the input parameter should be this type, PayloadAction itself has two generic types: T extends StringType
 * and P: any and P stands for payload, so we can create a type and pass it here, then we can use payload's defined
 * fields.
 * */
function* handleRestart(action: PayloadAction<string, RestartRequest>) {
  try {
    const params = new Map()
    params.set("public_dns_name", action.payload.ip)
    const res: RestartResult = yield call(callApi_1, 'get', API_ENDPOINT, '/application/' + action.payload.operation, params)
    console.log("restart response is:" + JSON.stringify(res))
    if (res.error) {
      yield put(restartFailure(res.error))
      alert(res.error)
    } else {
      yield delay(5000)
      const instanceD: {result: InstanceResult[], error: string} = yield select(getInstanceData)
        const clusterNodesStatusData: ClusterNodeStatus[] = yield select(getClusterNodeStatus)
        instanceD.result.forEach(x => {
          clusterNodesStatusData.forEach(y => {
            if (x.private_ip_address === y.ip) {
              x.is_manager = y.cluster_manager
              x.node_id = y.nodeId
            }
          })
        })
      const groupNames = processGroupNames(instanceD.result)
      yield put(fetchSuccess({"instanceResult": instanceD.result, "groups": groupNames}))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(restartFailure(err.stack!))
    }
    yield put(restartFailure("Unknow error!"))
  }
}

function* handleInstanceOperation(action: PayloadAction<string, {instance_ids: string, operation: string}>) {
  try {
    const params = new Map()
    params.set("instance_ids", action.payload.instance_ids)
    console.log("entered handle instance operation function, the action is:" + JSON.stringify(action))
    const res: RestartResult = yield call(callApi_1, 'get', API_ENDPOINT, '/instance/' + action.payload.operation, params)
    // console.log("restart result get from request directly:" + JSON.stringify(res))
    if (res.error) {
      yield put(instanceOpFailure(res.error))
    } else {
      yield delay(1000)
      const instanceData: InstanceResult[] = yield select(getInstanceData)
      const groupNames = processGroupNames(instanceData)
      yield put(fetchSuccess({"instanceResult": instanceData, "groups": groupNames, "restartResult": {"acknowledge": true, "error": ""}}))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(instanceOpFailure(err.stack!))
    } else {
      yield put(instanceOpFailure("Unknow error"))
    }
  }
}

function* handleClusterNodeStatusRequest() {
  try {
    const res: {result: ClusterNodeStatus[], error: string} = yield call(callApi_1, 'get', API_ENDPOINT, '/cluster_node_status/_cat/nodes?format=JSON&full_id=true&h=nodeId,ip,cluster_manager,node.roles')
    if (res.error) {
      // console.log("into res.error block")
      yield put(clusterNodeStatusFailure(res.error))
      alert(res.error)
    } else {
      let instanceData: InstanceResult[] = yield select(getInstanceData);
      // console.log("fetched response is: " + JSON.stringify(res))
      // console.log("read instance data is: " + JSON.stringify(instanceData))
      res.result.forEach(x => {
        console.log("into foreach block" + JSON.stringify(x))
        instanceData.forEach(y => {
          if (x.ip === y.private_ip_address) {
            y.is_manager = x.cluster_manager
            y.node_id = x.nodeId
          }
        })
      })
      const nonIntersect = instanceData.filter(x => !res.result.some(y => y.ip === x.private_ip_address));
      nonIntersect.forEach(x => {
        x.is_manager = ''
        x.node_id = ''
      })

      // console.log("after putting the cluster manager status into the state:" + JSON.stringify(instanceData))
      const groupNames = processGroupNames(instanceData)
      yield put((fetchSuccess({"instanceResult": instanceData, "groups": groupNames})))
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log("into exception catch block, the err is:" + err)
      yield put(clusterNodeStatusFailure(err.stack!))
    } else {
      yield put(clusterNodeStatusFailure("unknown error"))
    }
  }
}

function* handleNodeCreationRequest(action: PayloadAction<string, {operation: string, data_node: string}>) {
  try {
    console.log("request parameters are: " + JSON.stringify(action.payload))
    const res: RestartResult = yield call(callApi_1, 'post', API_ENDPOINT, '/node_creation/' + action.payload.operation, action.payload)
    if (res.error) {
      yield put(nodeCreationFailure(res.error))
    } else {
      yield put(nodeCreationSuccess(res))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(nodeCreationFailure(err.stack!))
    } else {
      yield put(nodeCreationFailure("unknow error"))
    }
  }
}

function* handleClusterConfigCheckingRequest(action: PayloadAction<string, ClusterConfigRequest>) {
  try {
    console.log("entered handle cluster config checking method, action: "  + JSON.stringify(action))
    // Please note that if missing / before the `node_creation`, the build url in callApi_1 won't raise exception, and the method just breaks.
    const res: ClusterConfig = yield call(callApi_1, 'post', API_ENDPOINT, '/node_creation/' + action.payload.operation, action.payload)
    console.log("fetched configs are :"+ JSON.stringify(res))
    if (res.error) {
      yield put(clusterConfigCheckingFailure(res.error))
    } else {
      yield put(clusterConfigCheckingSuccess(res))
    }
  } catch(err) {
    if (err instanceof Error) {
      yield put(clusterConfigCheckingFailure(err.stack!))
    } else {
      yield put(clusterConfigCheckingFailure("unknown error"))
    }
  }
}

function* handleInstallPluginRequest(action: PayloadAction<string, InstallPluginRequest>) {
  try {
    console.log("entered handle install plugin request method:" + JSON.stringify(action.payload))
    const res: InstallPluginResponse = yield call(callApi_1, 'post', API_ENDPOINT, '/install_plugin/' + action.payload.type, action.payload)
    if (res.error) {
      yield put(installPluginFailure(res.error))
    } else {
      yield put(installPluginSuccess(res))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(installPluginFailure(err.stack!))
    } else {
      yield put(installPluginFailure("unknown error"))
    }
  }
}

function* handleInstallPluginFilesRequest(action: PayloadAction<string, string>) {
  try {
    const res: InstallPluginFilesListResponse  = yield call(callApi_1, 'get', API_ENDPOINT, '/install_plugin_file_list/' + action.payload)
    if (res.error) {
      yield put(installPluginFilesFailure(res.error))
    } else {
      yield put(installPluginFilesSuccess(res.files))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(installPluginFilesFailure(err.stack!))
    } else {
      yield put(installPluginFilesFailure("unknown error"))
    }
  }
}

function* handlePluginQueryRequest(action: PayloadAction<string, string>) {
  try {
    const res: PluginQueryResponse[] = yield call(callApi, 'get', 'http://localhost:3000/_cat/plugins', '')
    console.log("fetched response is : " + JSON.stringify(res))
    if (res !== undefined && res.length !== 0) {
      const pluginName = action.payload
      const filteredRes: PluginQueryResponse[] = []
      res.filter(x => {x.component.indexOf(pluginName) !== -1}).forEach(x => {
        filteredRes.push(x)
      })
      const instanceD: InstanceResult[] = yield select(getInstanceData)
      instanceD.forEach(x => {
        filteredRes.forEach(y => {
          if (x.private_dns_name === y.name) {
            x.plugin_version = y.version
          }
        })
      })
      yield put(pluginQuerySuccess(instanceD))
    } else {
      yield put(pluginQueryFailure("fetch plugin failure"))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(pluginQueryFailure(err.stack!))
    } else {
      yield put(pluginQueryFailure("unknown error"))
    }
  }
}

function* watchFetchRequest() {
  yield takeEvery(InstanceTypes.FETCH_REQUEST, handleFetch)
}

function* watchRestartRequest() {
  yield takeEvery(InstanceTypes.RESTART, handleRestart)
}

function* watchInstanceOperation() {
  yield takeEvery(InstanceTypes.INSTANCE_OP_REQUEST, handleInstanceOperation)
}

function* watchClusterNodeStatusRequest() {
  yield takeEvery(InstanceTypes.CLUSTER_NODE_STATUS_REQUEST, handleClusterNodeStatusRequest)
}

function* watchNodeCreationRequest() {
  yield takeEvery(InstanceTypes.NODE_CREATION_REQUEST, handleNodeCreationRequest)
}

function* watchClusterConfigCheckingRequest() {
  yield takeEvery(InstanceTypes.CLUSTER_CONFIG_CHECKING_REQUEST, handleClusterConfigCheckingRequest)
}

function* watchInstallPluginRequest() {
  console.log("entered watch install plugin request method")
  yield takeEvery(InstanceTypes.INSTALL_PLUGIN_REQUEST, handleInstallPluginRequest)
}

function* watchInstallPluginFilesListRequest() {
  yield takeEvery(InstanceTypes.INSTALL_PLUGIN_LOCAL_FILES_REQUEST, handleInstallPluginFilesRequest)
}

function* watchPluginQueryRequest() {
  yield takeEvery(InstanceTypes.PLUGIN_QUERY_REQUEST, handlePluginQueryRequest)
}

function* instanceSaga() {
  yield all([fork(watchFetchRequest),
    fork(watchRestartRequest),
    fork(watchInstanceOperation),
    fork(watchClusterNodeStatusRequest),
    fork(watchNodeCreationRequest),
    fork(watchClusterConfigCheckingRequest),
    fork(watchInstallPluginRequest),
    fork(watchInstallPluginFilesListRequest),
    fork(watchPluginQueryRequest)])
}

export default instanceSaga
