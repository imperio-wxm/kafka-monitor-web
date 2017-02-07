import React from 'react'
import { render } from 'react-dom'

// 引入React-Router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'

// 引入Antd的导航组件
import { Menu, Icon, Breadcrumb,Switch } from 'antd'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

import 'font-awesome/css/font-awesome.min.css'

// 引入主体样式文件
import './main.css'

// import 自定义组件
import MainPanel from './components/common/main-panel/main-panel.js'
import BrokerPanel from './components/common/broker-panel/broker-panel.js'
import TopicPanel from './components/common/topic-panel/topic-panel.js'
import GroupPanel from './components/common/group-panel/group-panel.js'

const ACTIVE = { color: 'red' }

// menu
class MainMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: ''
        }
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    }

    componentDidMount() {
    }

    render() {
        return (
          <div className="ant-layout-topaside">
              <div className="ant-layout-header">
                <div className="ant-layout-wrapper">
                    <div className="ant-layout-logo"></div>
                    <Menu theme="dark" onClick={this.handleClick} mode="horizontal"
                        style={{lineHeight: '64px'}}>
                        <Menu.Item key="1">
                            <Link to="/"><Icon type="home" />Home</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/brokerPanel"><Icon type="appstore"/>Brokers</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/groupPanel"><Icon type="appstore"/>Groups</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/topicPanel"><Icon type="appstore"/>Topics</Link>
                        </Menu.Item>
                    </Menu>
                </div>
              </div>

              <div className="ant-layout-content">
                <div className="children-panel">
                  { this.props.children }
                </div>
              </div>
          </div>
        )
    }
}

// 配置路由
render((
    <Router history={hashHistory} >
        <Route path="/" component={MainMenu}>
          <IndexRoute component={MainPanel} />
          <Route path="brokerPanel" component={BrokerPanel} />
          <Route path="topicPanel" component={TopicPanel} />
          <Route path="groupPanel" component={GroupPanel} />
        </Route>
    </Router>
), document.getElementById("app"));
