/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Card, Col, Row } from 'antd';

// 引入主体样式文件
import './style/style.css'
import HTTPUtil from '../../../actions/fetch/fetch.js'

export default class MainPanel extends React.Component{
    //初始化
    constructor(props) {
        super(props)
        this.state = {
            brokersNum: 0,
            topicsNum: 0,
            groupsNum: 0,
            consumersNum: 0
        }
    }

    componentDidMount() {
        var urls = [
          "http://localhost:8080/monitor/brokerDetailsView.do",
          "http://localhost:8080/monitor/topicListView.do",
          "http://localhost:8080/monitor/groupDetailView.do"
        ];
        
        HTTPUtil.URLs(urls).then((text) => {
          console.log(text);
           //处理 请求success
           if(text.size != 0 ){
               //我们假设业务定义code为0时，数据正常
               var brokersObj = JSON.parse(text[0]);
               var topicsObj = JSON.parse(text[1]);
               var groupObj = JSON.parse(text[2]);
               var allConsumersNum = 0;

               for(var o in groupObj){
                   allConsumersNum += parseInt(groupObj[o].consumersNum);
                   console.log(groupObj[o].groupName + " : " + groupObj[o].consumersNum);
               }

               this.setState({
                  brokersNum : brokersObj.length,
                  topicsNum : topicsObj.length,
                  groupsNum : groupObj.length,
                  consumersNum : allConsumersNum
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
          <div className="ant-layout-container">
            <div className= "main-panel" style={{ background: '#ECECEC', padding: '10px' }}>
                <Row>
                  <Col span="6">
                    <Card title="Broker 总数" extra={<a href="#">详情</a>} bordered={false}>
                        <div className="panel-image">
                          <img alt="example" src="https://avatars2.githubusercontent.com/u/12928352?v=3&s=460" />
                          <span>{this.state.brokersNum}</span>
                        </div>
                    </Card>
                  </Col>
                  <Col span="6">
                    <Card title="Group 总数" extra={<a href="#">详情</a>} bordered={false}>
                      <div className="panel-image">
                        <img alt="example" src="https://avatars2.githubusercontent.com/u/12928352?v=3&s=460" />
                        <span>{this.state.groupsNum}</span>
                      </div>
                    </Card>
                  </Col>
                  <Col span="6">
                    <Card title="Topic 总数" extra={<a href="#">详情</a>} bordered={false}>
                      <div className="panel-image">
                        <img alt="example" src="https://avatars2.githubusercontent.com/u/12928352?v=3&s=460" />
                        <span>{this.state.topicsNum}</span>
                      </div>
                    </Card>
                  </Col>
                  <Col span="6">
                    <Card title="Consumer 总数" extra={<a href="#">详情</a>} bordered={false}>
                      <div className="panel-image">
                        <img alt="example" src="https://avatars2.githubusercontent.com/u/12928352?v=3&s=460" />
                        <span>{this.state.consumersNum}</span>
                      </div>
                    </Card>
                  </Col>
                </Row>
            </div>
          </div>
        );
    }
}
