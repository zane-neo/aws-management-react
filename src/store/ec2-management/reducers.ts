import { Reducer } from "redux";
import { InstanceState, InstanceTypes } from "./types";


export const initialState: InstanceState = {
  instanceData: [],
  param: undefined,
  restartData: undefined,
  clusterNodeStatus: [],
  loading: false,
  errors: undefined,
  groups: [],
  clusterConfig: undefined,
  dropDownFiles: [],
  installPluginResponse: undefined,
  pluginQueryResponse: []
}

const reducer: Reducer<InstanceState> = (state = initialState, action) => {
  switch (action.type) {
    case InstanceTypes.FETCH_REQUEST: {
      return { ...state, loading: true}
    }
    case InstanceTypes.FETCH_SUCCESS: {
      return { ...state, loading: false, instanceData: action.payload.instanceResult, groups: action.payload.groups, restartData: action.payload.restartResult}
    }
    case InstanceTypes.FETCH_FAILURE: {
      return { ...state, loading: false, errors: action.payload }
    }

    case InstanceTypes.RESTART: {
      return {...state, loading: true, param: action.payload}
    }
    case InstanceTypes.RESTART_SUCCESS: {
      return {...state, loading: false, restartData: action.payload}
    }
    case InstanceTypes.RESTART_FAILURE: {
      return {...state, loading: false, errors: action.payload}
    }


    case InstanceTypes.INSTANCE_OP_REQUEST: {
      return {...state, loading: true}
    }
    case InstanceTypes.INSTANCE_OP_SUCEESS: {
      return {...state, loading: false, restartData: action.payload}
    }
    case InstanceTypes.INSTANCE_OP_FAILURE: {
      return {...state, loading: false, errors: action.payload}
    }

    case InstanceTypes.CLUSTER_NODE_STATUS_REQUEST: {
      return {...state, loading: true}
    }
    case InstanceTypes.CLUSTER_NODE_STATUS_SUCCESS: {
      return {...state, loading: false, clusterNodeStatus: action.payload}
    }
    case InstanceTypes.CLUSTER_NODE_STATUS_FAILURE: {
      return {...state, loading: false, errors: action.payload}
    }

    case InstanceTypes.NODE_CREATION_REQUEST: {
      return {...state, loading: true}
    }
    case InstanceTypes.NODE_CREATION_SUCCESS: {
      return {...state, loading: false, restartData: action.payload}
    }
    case InstanceTypes.NODE_CREATION_FAILURE: {
      return {...state, loading: false, errors: action.payload}
    }

    case InstanceTypes.CLUSTER_CONFIG_CHECKING_REQUEST: {
      return {...state, loading: true}
    }
    case InstanceTypes.CLUSTER_CONFIG_CHECKING_SUCCESS: {
      return {...state, loading: false, clusterConfig: action.payload}
    }
    case InstanceTypes.CLUSTER_CONFIG_CHECKING_FAILURE: {
      return {...state, loading: false, errors: action.payload}
    }

    case InstanceTypes.INSTALL_PLUGIN_REQUEST: {
      return {...state, loading: true}
    }
    case InstanceTypes.INSTALL_PLUGIN_SUCCESS: {
      return {...state, loading: false, installPluginResponse: action.payload}
    }
    case InstanceTypes.CLUSTER_CONFIG_CHECKING_FAILURE: {
      return {...state, loading: false, error: action.payload}
    }

    case InstanceTypes.INSTALL_PLUGIN_LOCAL_FILES_REQUEST: {
      return {...state, loading: true}
    }
    case InstanceTypes.INSTALL_PLUGIN_LOCAL_FILES_SUCCESS: {
      return {...state, loading: false, dropDownFiles: action.payload}
    }
    case InstanceTypes.INSTALL_PLUGIN_LOCAL_FILES_FAILURE: {
      return {...state, loading: false, error: action.payload}
    }

    case InstanceTypes.PLUGIN_QUERY_REQUEST: {
      return {...state, loading: true}
    }
    case InstanceTypes.PLUGIN_QUERY_SUCCESS: {
      return {...state, loading: false, pluginQueryResponse: action.payload}
    }
    case InstanceTypes.PLUGIN_QUERY_FAILUER: {
      return {...state, loading: true, error: action.payload}
    }

    default: {
      return state
    }
  }
}

export { reducer as instanceReducer }
