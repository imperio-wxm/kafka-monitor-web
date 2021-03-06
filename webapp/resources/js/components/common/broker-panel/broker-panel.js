/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'
import { render } from 'react-dom'

// 引入React-Router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'
import { Card, Col, Row } from 'antd';
import { Table } from 'antd';
import { Menu, Breadcrumb, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

import { Tabs, Select } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

import BrokerInfoTable from '../../tables/broker-info-table/broker-info-table.js'
import HTTPUtil from '../../../actions/fetch/fetch.js'
import d3Util from '../../../actions/d3-script/d3-chart.js'

// 引入主体样式文件
import './style/style.css'


//添加或者修改json数据
function setJson(jsonStr,name,value) {
    if(!jsonStr)jsonStr="{}";
    var jsonObj = JSON.parse(jsonStr);
    jsonObj[name] = value;
        return JSON.stringify(jsonObj);
}

export default class BrokerPanel extends React.Component {
    //初始化

    //{"brokerName":"0","host":"192.168.18.74","port":"9092","version":"1","jmx_port":"-1","createdTimestamp":"1481857477680","modifyTimestamp":"1481857477680","timestamp":"1481857477678","controller":true}
    constructor(props) {
        super(props)
        this.state = {
            brokersNum: 0,
            brokerInfo: []
        }
    }

    componentDidMount() {
        var urls = [
          "http://localhost:8088/monitor/brokerDetailsView.do"
        ];

        HTTPUtil.URLs(urls).then((text) => {
           //处理 请求success
           if(text.size != 0 ){
               //我们假设业务定义code为0时，数据正常
               var brokersObj = JSON.parse(text[0]);
               var brokerDetails = [];

               for(var o in brokersObj){
                   brokerDetails.push(brokersObj[o]);
               }

               this.setState({
                  brokersNum : brokersObj.length,
                  brokerInfo : brokerDetails
               })
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
        let brokerInfoList = this.state.brokerInfo;
        let childrenList = [];
        for(let o in brokerInfoList) {
           childrenList.push({"name":brokerInfoList[o].host + " : " + brokerInfoList[o].port,"isController":brokerInfoList[o].controller});
        }
        childrenList.push({"name":"192.168.152.23" + " : " + "1025"});
        childrenList.push({"name":"192.168.152.23" + " : " + "1025"});
        childrenList.push({"name":"192.168.152.23" + " : " + "1025"});
        childrenList.push({"name":"192.168.152.23" + " : " + "1025"});
        childrenList.push({"name":"192.168.152.23" + " : " + "1025"});
        childrenList.push({"name":"192.168.152.23" + " : " + "1025"});
        childrenList.push({"name":"192.168.152.23" + " : " + "1025"});
        childrenList.push({"name":"192.168.152.23" + " : " + "1025"});


        let nodeJsonStr = {"r":{"name":"Brokers","children":childrenList}};

        return (
          <div className="ant-layout-wrapper">
             <div className="ant-layout-breadcrumb">
               <Breadcrumb separator=">">
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="">Brokers</Breadcrumb.Item>
              </Breadcrumb>
             </div>
             <div className="ant-layout-container">
               <Tabs tabPosition={"left"}>
                 <TabPane tab={<span><Icon type="line-chart" />Broker集群图形</span>} key="1">
                   {
                      d3Util.getClusterNode(nodeJsonStr)
                   }
                 </TabPane>
                 <TabPane tab={<span><Icon type="file-text" />Broker详细信息</span>} key="2">
                    <BrokerInfoTable brokerNum={this.state.brokersNum} brokerInfo={this.state.brokerInfo}/>
                 </TabPane>
               </Tabs>
             </div>
        </div>
        );
    }
}
