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

import PaginationTable from '../../tables/pagination-table/pagination-table.js'
import HTTPUtil from '../../../actions/fetch/fetch.js'

// 引入主体样式文件
import './style/style.css'


export default class TopicPanel extends React.Component{
    //初始化

    //{"brokerName":"0","host":"192.168.18.74","port":"9092","version":"1","jmx_port":"-1","createdTimestamp":"1481857477680","modifyTimestamp":"1481857477680","timestamp":"1481857477678","controller":true}
    constructor(props) {
        super(props)
        this.state = {
            topicNameList: []
        }
    }

    componentDidMount() {
        var urls = [
          "http://localhost:8080/monitor/topicListView.do"
        ];

        HTTPUtil.URLs(urls).then((text) => {
          console.log(text);
           //处理 请求success
           if(text.size != 0 ){
               //我们假设业务定义code为0时，数据正常
               let topicList = JSON.parse(text[0]);

               this.setState({
                  topicNameList : topicList
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
        return (
          <div className="ant-layout-wrapper">
             <div className="ant-layout-breadcrumb">
               <Breadcrumb separator=">">
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="">Topics</Breadcrumb.Item>
              </Breadcrumb>
             </div>
             <div className="ant-layout-container">
                <div className="pagination-table">
                  <PaginationTable topicNameList={this.state.topicNameList}/>
                </div>
             </div>
        </div>
        );
    }
}
