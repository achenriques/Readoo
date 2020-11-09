import { initialState } from './index';
import { actionTypes } from '../actions';
import { successType } from '../../utils/appUtils';
import * as constants from '../../constants/appConstants';

export default (state = initialState.tabs, { type, payload, data }) => {
    switch (type) {
          case actionTypes.TAB_CHANGE:
              return {
                  ...state,
                  currentTabID: payload.newTabID
              };
  
          case successType(actionTypes.DO_REGISTER):
              return {
                  ...state,
                  currentTabID: constants.pages.PROFILE
              }
              
          case (actionTypes.GO_CHAT_WITH):
              return {
                  ...state,
                  currentTabID: constants.pages.CHAT
              } 
  
          case successType(actionTypes.CHECK_TOKEN):
              if (data.data && data.data.tabSelector != null) {
                  return {
                      ...state,
                      currentTabID: +data.data.tabSelector
                  }
              } else {
                  return state;
              }
  
          default:
              return state;
      }
  }