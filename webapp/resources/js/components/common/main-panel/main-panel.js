/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Card, Col, Row } from 'antd';

// 引入主体样式文件
import './style/style.css'

export default class MainPanel extends React.Component{
    //初始化
    constructor(props) {
        super(props)
        this.state = {
            brokerNum: 1
        }
    }

    // 获取数据
    fetchFn = () => {
        var urls = ["html1.html", "html2.html"];
        fetch('http://localhost:8080/monitor/brokerDetailsView.do')
            .then((res) => {
              return res.json()
            })
            .then((data) => {
              var data = data;
              this.setState({
                brokerNum : data.length
              })
            })
            .catch((e) => {
              console.log(e.message)
            })
    }

    componentDidMount() {
        this.fetchFn()
    }

    render() {
        return (
          <div className= "main-panel" style={{ background: '#ECECEC', padding: '10px' }}>
              <Row>
                <Col span="6">
                  <Card title="Broker 总数" extra={<a href="#">详情</a>} bordered={false}>
                      <div className="panel-image">
                        <img alt="example" src="https://avatars2.githubusercontent.com/u/12928352?v=3&s=460" />
                        <span>{this.state.brokerNum}</span>
                      </div>
                  </Card>
                </Col>
                <Col span="6">
                  <Card title="Group 总数" extra={<a href="#">详情</a>} bordered={false}>
                    <div className="panel-image">
                      <img alt="example" src="https://avatars2.githubusercontent.com/u/12928352?v=3&s=460" />
                      <span>{this.state.brokerNum}</span>
                    </div>
                  </Card>
                </Col>
                <Col span="6">
                  <Card title="Topic 总数" extra={<a href="#">详情</a>} bordered={false}>
                    <div className="panel-image">
                      <img alt="example" src="https://avatars2.githubusercontent.com/u/12928352?v=3&s=460" />
                      <span>{this.state.brokerNum}</span>
                    </div>
                  </Card>
                </Col>
                <Col span="6">
                  <Card title="Consumer 总数" extra={<a href="#">详情</a>} bordered={false}>
                    <div className="panel-image">
                      <img alt="example" src="https://avatars2.githubusercontent.com/u/12928352?v=3&s=460" />
                      <span>{this.state.brokerNum}</span>
                    </div>
                  </Card>
                </Col>
              </Row>
          </div>
        );
    }
}
