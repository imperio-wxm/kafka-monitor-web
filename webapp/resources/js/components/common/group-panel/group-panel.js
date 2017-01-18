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

import HTTPUtil from '../../../actions/fetch/fetch.js'
import GroupTopicTable from '../../tables/group-topic-table/group-topic-table.js'

// 引入主体样式文件
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

export default class GroupPanel extends React.Component{
    //初始化

    //{"brokerName":"0","host":"192.168.18.74","port":"9092","version":"1","jmx_port":"-1","createdTimestamp":"1481857477680","modifyTimestamp":"1481857477680","timestamp":"1481857477678","controller":true}
    constructor(props) {
        super(props)
        this.state = {
            groupNum: 0,
            groupInfo: []
        }
    }

    componentDidMount() {
        var urls = [
          "http://localhost:8088/monitor/groupDetailView.do"
        ];

        HTTPUtil.URLs(urls).then((text) => {
           //处理 请求success
           if(text.size != 0 ){
               //我们假设业务定义code为0时，数据正常
               var groupsObj = JSON.parse(text[0]);
               var groupDetails = [];

               for(var o in groupsObj){
                   groupDetails.push(groupsObj[o]);
               }

               this.setState({
                  groupNum : groupsObj.length,
                  groupInfo : groupDetails
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
        let groupInfo = this.state.groupInfo;

        return (
          <div className="ant-layout-wrapper">
             <div className="ant-layout-breadcrumb">
               <Breadcrumb separator=">">
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="">Group</Breadcrumb.Item>
              </Breadcrumb>
             </div>
             <div className="ant-layout-container">
               <Tabs tabPosition={"left"}  defaultActiveKey="0">
               {
                   groupInfo.map((item, index)=>{
                       const groupInfocolumns = [{
                         title: 'Consumers Number',
                         dataIndex: 'consumersNum',
                       },{
                         title: 'Topics Number',
                         dataIndex: 'topicsNum',
                       }];

                       const groupInfoData = [];

                       groupInfoData.push({
                         consumersNum: `${item.consumersNum}`,
                         topicsNum: `${item.topicsNum}`
                       });

                       return  <TabPane tab={<span><Icon type="folder" />{item.groupName}</span>} key={index} >
                                   <div style={{ background: '#fff', padding: '0px 0px 30px 0px ' }}>
                                     <Card title="详情" bordered >
                                       <Table columns={groupInfocolumns} dataSource={groupInfoData} pagination={false} bordered={false} size="small" style={{padding: '0px' }}/>
                                     </Card>
                                   </div>

                                   <GroupTopicTable groupName={item.groupName}/>
                               </TabPane>
                   })
               }
               </Tabs>
             </div>
        </div>
        );
    }
}
