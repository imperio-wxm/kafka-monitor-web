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

import CollapseTable from '../../tables/collapse-table/collapse-table.js'


export default class BrokerPanel extends React.Component{
    //初始化

    //{"brokerName":"0","host":"192.168.18.74","port":"9092","version":"1","jmx_port":"-1","createdTimestamp":"1481857477680","modifyTimestamp":"1481857477680","timestamp":"1481857477678","controller":true}
    constructor(props) {
        super(props)
        this.state = {
            brokersNum: 0,
            brokerNameList: [],
            hostList: [],
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
        )).then(respList => {
            var brokersObj = JSON.parse(respList[0]);
            var topicsObj = JSON.parse(respList[1]);
            var groupObj = JSON.parse(respList[2]);
            var allConsumersNum = 0;

            for(var o in groupObj){
                allConsumersNum += parseInt(groupObj[o].consumersNum);
                console.log(groupObj[o].groupName + " : " + groupObj[o].consumersNum)
            }

            this.setState({
               brokersNum : brokersObj.length,
               topicsNum : topicsObj.length,
               groupsNum : groupObj.length,
               consumersNum : allConsumersNum
            })
          })
          .catch((e) => {
            console.log(e.message)
          })
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

    render() {
        return (
          <div>
             <div className="ant-layout-breadcrumb">
               <Breadcrumb separator=">">
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="">Brokers</Breadcrumb.Item>
              </Breadcrumb>
             </div>
             <div className="ant-layout-container">
                <div id="broker-panel">
                 <aside className="ant-layout-sider">
                   <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
                     <SubMenu key="sub1" title={<span><Icon type="user" />Broker详情</span>}>
                       <Menu.Item key="1">图形概览</Menu.Item>
                       <Menu.Item key="2"><Link to="/collapseTable">详细信息</Link></Menu.Item>
                     </SubMenu>
                   </Menu>
                 </aside>
                 <div className="ant-layout-content">
                      { this.props.children }
                 </div>
               </div>
             </div>
        </div>
        );
    }
}

// 配置路由
render((
    <Router history={hashHistory} >
        <Route path="collapseTable" component={CollapseTable} />
    </Router>
), document.getElementById("children-panel"));
