/**
 *
 * @authors luozh@snail.com
 * @date    2016-03-21 16:42:35
 * @description 主入口模块
 */

import React from 'react'
import { render } from 'react-dom'

// 引入React-Router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router'

// 引入Antd的导航组件
import { Menu, Icon, Breadcrumb,Switch } from 'antd'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

import 'font-awesome/css/font-awesome.min.css'

// 引入主体样式文件
import './main.css'

// import 自定义组件
import MainPanel from './components/common/main-panel/main-panel.js'

const ACTIVE = { color: 'red' }

// menu
class MainMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: '',
            username: ''
        }
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    }

    componentDidMount() {
        this.getUser()
    }

    getUser = () => {
        this.setState({
            username: 'luozh'
        })
    }

    render() {
        return (
          <div className="ant-layout-topaside">
              <div className="ant-layout-header">
                <div className="ant-layout-wrapper">
                    <div className="ant-layout-logo"></div>
                    <Menu theme="dark" onClick={this.handleClick} mode="horizontal"
                        defaultSelectedKeys={[this.state.current]} style={{lineHeight: '64px'}}>
                        <Menu.Item key="1">
                            <Link to="/MainPanel"><Icon type="appstore" />Brokers</Link>
                        </Menu.Item>
                        <Menu.Item key="app">
                            <Icon type="appstore"/>Navigation Two
                        </Menu.Item>
                        <Menu.Item key="alipay">
                            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
                        </Menu.Item>
                    </Menu>
                </div>
              </div>

              <div className="ant-layout-wrapper">
                <div className="ant-layout-breadcrumb">
                  <Breadcrumb>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>应用列表</Breadcrumb.Item>
                    <Breadcrumb.Item>某应用</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <div className="ant-layout-container">
                  <div className="ant-layout-content">
                    <div style={{ height: 240 }}>
                      { this.props.children }
                    </div>
                  </div>
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
            <IndexRoute path="MainPanel" component={MainPanel} />
        </Route>
    </Router>
), document.getElementById('app'));
