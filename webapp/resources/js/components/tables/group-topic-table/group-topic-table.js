/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Link } from 'react-router';
import { Table } from 'antd';
import { Collapse } from 'antd';
import { Tabs, Select,Button  } from 'antd';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

import HTTPUtil from '../../../actions/fetch/fetch.js'
import RealTimeCharts from '../../../actions/highcharts-script/real-time-charts.js'
import HisTimeCharts from '../../../actions/highcharts-script/his-time-charts.js'
import CassandraCountCharts from '../../../actions/highcharts-script/cassandra-count-charts.js'
import './style/style.css'


function formatDate(datetime) {
    var year = datetime.getFullYear(),
    month = (datetime.getMonth() + 1 < 10) ? '0' + (datetime.getMonth() + 1):datetime.getMonth() + 1,
    day = datetime.getDate() < 10 ? '0' +  datetime.getDate() : datetime.getDate(),
    hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours(),
    min = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes(),
    sec = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}

//添加或者修改json数据
function setJson(jsonStr,name,value) {
    if(!jsonStr)jsonStr="{}";
    var jsonObj = JSON.parse(jsonStr);
    jsonObj[name] = value;
        return JSON.stringify(jsonObj);
}

function sortByField(x, y) {
    return x.topicName - y.topicName;
}

export default class GroupTopicTable extends React.Component{
    //初始化

    constructor(props) {
        super(props)
        this.state = {
            groupName : props.groupName,
            topicList : []
        }
    }

    componentDidMount() {
        let urls = [
          "http://localhost:8088/monitor/groupTopicsView.do?groupName=" + this.state.groupName
        ];

        HTTPUtil.URLs(urls).then((text) => {
           //处理 请求success
           if(text.size != 0 ){
               //我们假设业务定义code为0时，数据正常
               let topicObj = JSON.parse(text[0]);
               let topicList = [];

               for(var o in topicObj) {
                  topicList.push(topicObj[o]);
               }
               topicList.sort();
               this.getPartitionList(this.state.groupName, topicList);
           }else{
                //处理自定义异常
               console.log("fetch exception " + text.code);
           }
        },(text)=>{
            //TODO 处理请求fail
            console.log("fetch fail " + text.code);
        })
    }

    getOffsetInfo = (groupName,topicPartitionsList) => {
        let topicOffsetList = [];

        for(let i in topicPartitionsList) {
            let urls = [];
            let topicPartitions = JSON.parse(topicPartitionsList[i]);
            let topic = topicPartitions.topicName;
            let partitionIdList = topicPartitions.partitions;
            for(let partitionId in partitionIdList) {
              urls.push(
                "http://localhost:8088/monitor/offsetDetailView.do?groupName=" + groupName +
                      "&topicName=" + topic + "&partitionId=" + partitionId
              );
            }

            HTTPUtil.URLs(urls).then((text) => {
               //处理 请求success
               if(text.size != 0 ){
                 let topicOffset = setJson(null,"groupName",groupName);
                 topicOffset = setJson(topicOffset,"topicName",topic);
                 topicOffset = setJson(topicOffset,"offsetInfo",eval('[' + text.join(",") + ']'));
                 topicOffsetList.push(topicOffset);
               }else{
                    //处理自定义异常
                   console.log("fetch exception " + text.code);
               }
            },(text)=>{
                //TODO 处理请求fail
                console.log("fetch fail " + text.code);
            }).then(() => {
              this.setState({
                 topicList: topicOffsetList
              })
            })
        }
    }


    getPartitionList = (groupName,topicList) => {
          let urls = [];
          for(let i in topicList) {
              urls.push(
                "http://localhost:8088/monitor/topicDetailView.do?topicName=" + topicList[i]
              );
          }

          HTTPUtil.URLs(urls).then((text) => {
             //处理 请求success
             if(text.size != 0 ){
                 let topicInfoList = text;
                 let topicPartitionsList = [];

                 for(let i in topicInfoList) {
                   let topicInfo = JSON.parse(topicInfoList[i]);
                   var myjsonStr = setJson(null,"topicName",topicInfo.topicName);
                   myjsonStr = setJson(myjsonStr,"partitions",topicInfo.partitions);
                   topicPartitionsList.push(myjsonStr);
                 }
                 this.getOffsetInfo(groupName, topicPartitionsList);
             }else{
                  //处理自定义异常
                 console.log("fetch exception " + text.code);
             }
          },(text)=>{
              //TODO 处理请求fail
              console.log("fetch fail " + text.code);
          })
    }

    render() {
        let topicList = this.state.topicList;

        topicList.sort(sortByField);

        const operations = <Button shape="circle" icon="reload"></Button>;

        return (
          <div>
            <Collapse defaultActiveKey={['0']} accordion>
            {
                topicList.map((item, index)=>{
                    item = JSON.parse(item);


                    const offsetInfoColumns = [{
                          title: 'Partition Id',
                          dataIndex: 'partitionId',
                        }, {
                          title: 'Offset',
                          dataIndex: 'offset',
                        }, {
                          title: 'LogSize',
                          dataIndex: 'logSize',
                        }, {
                          title: 'Lag',
                          dataIndex: 'lag',
                        }, {
                          title: 'Qwner',
                          dataIndex: 'owner',
                        }, {
                          title: 'Created Time',
                          dataIndex: 'createdTimestamp',
                        }, {
                          title: 'Modify Time',
                          dataIndex: 'modifyTimestamp',
                        }
                    ];

                    const offsetInfoData = [];

                    return  <Panel header={item.topicName} key={index}>
                                {
                                  item.offsetInfo.map((item, index)=>{
                                      let createTime = formatDate(new Date(parseInt(item.createdTimestamp,10)));
                                      let modifyTime = formatDate(new Date(parseInt(item.modifyTimestamp,10)));
                                      offsetInfoData.push({
                                        partitionId: `${item.partitionId}`,
                                        offset: `${item.offset}`,
                                        logSize: `${item.logSize}`,
                                        lag: `${item.lag}`,
                                        owner: `${item.owner}`,
                                        createdTimestamp: `${createTime}`,
                                        modifyTimestamp: `${modifyTime}`
                                      });
                                  })
                                }

                                <Table columns={offsetInfoColumns} dataSource={offsetInfoData} size="middle" pagination={false}/>

                                <div className="charts-tabs">
                                  <Tabs type="card" tabBarExtraContent={operations}>
                                    <TabPane tab="实时" key="1">
                                        <RealTimeCharts topicName={item.topicName} groupName={this.state.groupName} ref="realTimeChart"/>
                                    </TabPane>
                                    <TabPane tab="历史" key="2">
                                        <HisTimeCharts topicName={item.topicName} groupName={this.state.groupName} ref="hisTimeCharts"/>
                                    </TabPane>
                                    <TabPane tab="Cassnadra 写入统计" key="3">
                                        <CassandraCountCharts topicName={item.topicName} groupName={this.state.groupName} ref="cassandraCountCharts"/>
                                    </TabPane>
                                  </Tabs>
                                </div>
                            </Panel>
                })
            }
            </Collapse>
          </div>
        );
    }
}
