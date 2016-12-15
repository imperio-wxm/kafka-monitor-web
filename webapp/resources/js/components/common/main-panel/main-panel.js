/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Card, Col, Row } from 'antd';

// 引入主体样式文件
import './style/style.css'

const MainPanel = React.createClass({
    render() {
        return (
          <div style={{ background: '#ECECEC', padding: '30px' }}>
              <Row>
                <Col span="8">
                  <Card title="Card title" bordered={false}>Card content</Card>
                </Col>
                <Col span="8">
                  <Card title="Card title" bordered={false}>Card content</Card>
                </Col>
                <Col span="8">
                  <Card title="Card title" bordered={false}>Card content</Card>
                </Col>
              </Row>
          </div>
        );
    }
});

export default MainPanel;
