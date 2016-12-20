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

import GroupTopicTable from '../../tables/group-topic-table/group-topic-table.js'

// 引入主体样式文件
import './style/style.css'


export default class GroupPanel extends React.Component{
    //初始化

    //{"brokerName":"0","host":"192.168.18.74","port":"9092","version":"1","jmx_port":"-1","createdTimestamp":"1481857477680","modifyTimestamp":"1481857477680","timestamp":"1481857477678","controller":true}
    constructor(props) {
        super(props)
        this.state = {
            tabPosition: 'top',
        }
    }

    // 获取数据
    fetchFn = () => {
        var urls = [
          "http://localhost:8080/monitor/brokerDetailsView.do",
          "http://localhost:8080/monitor/topicListView.do",
          "http://localhost:8080/monitor/groupDetailView.do"
        ];

        // fetch('http://localhost:8080/monitor/brokerDetailsView.do')
        //     .then((res) => {
        //       return res.json()
        //     })
        //     .then((data) => {
        //       var data = data;
        //       this.setState({
        //         brokerNum : data.length
        //       })
        //     })
        //     .catch((e) => {
        //       console.log(e.message)
        //     })

        var allConsumersNum = 0;

        Promise.all(urls.map(url =>
            fetch(url).then(resp => resp.text())
        )).then(respList => {}).catch((e) => {console.log(e.message)})
    }

    componentDidMount() {
        //this.fetchFn()
    }
    //  <Table
    //    columns={columns}
    //    expandedRowRender={record => <InsideTable />}
    //    dataSource={data}
    //    className="table"
    //  />

    callback = (key) =>  {
      console.log(key);
    }

    changeTabPosition = (tabPosition) => {
      this.setState({ tabPosition });
    }

    render() {
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
                 <TabPane tab={<span><Icon type="folder" />Group_1</span>} key="1">
                    <GroupTopicTable />
                 </TabPane>
                 <TabPane tab={<span><Icon type="folder-open" />Group_2</span>} key="2">
                    <GroupTopicTable />
                 </TabPane>
                 <TabPane tab={<span><Icon type="folder" />Group_3</span>} key="3">
                    <GroupTopicTable />
                 </TabPane>
                 <TabPane tab={<span><Icon type="folder-open" />Group_4</span>} key="4">
                    <GroupTopicTable />
                 </TabPane>
                 <TabPane tab={<span><Icon type="folder" />Group_5</span>} key="5">
                    <GroupTopicTable />
                 </TabPane>
                 <TabPane tab={<span><Icon type="folder-open" />Group_6</span>} key="6">
                    <GroupTopicTable />
                 </TabPane>
               </Tabs>
             </div>
        </div>
        );
    }
}
