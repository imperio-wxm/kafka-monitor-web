import * as kafka from '../../constants/kafka-constants.js'

/*
 * action 函数 
 */
export function getBrokerInfo(text){
  return {type : kafka.GET_BROKER_INFO, text}
}
