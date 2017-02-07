import React from 'react'
import { render } from 'react-dom'

// 引入React-Router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink, browserHistory } from 'react-router'

// 引入Antd的导航组件
import { Menu, Icon, Breadcrumb,Switch,Layout,Input} from 'antd'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;

import 'font-awesome/css/font-awesome.min.css'

// import 自定义组件
import MainPanel from './components/common/main-panel/main-panel.js'
import BrokerPanel from './components/common/broker-panel/broker-panel.js'
import TopicPanel from './components/common/topic-panel/topic-panel.js'
import GroupPanel from './components/common/group-panel/group-panel.js'

// 引入主体样式文件
import './index.css'

class Index extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          current: ''
      }
  }

  render() {
    const collapse = this.state.collapse;
    return (
      <div className="layout-aside">
        <aside className="layout-sider">
          <div className="layout-logo"></div>

          <div className="layout-search">
            <Search
              placeholder="input search text"
              onSearch={value => console.log(value)}
            />

          </div>
          <Menu mode="inline" theme="dark"
            defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
            <Menu.Item key="home">
              <Link to="/">
               <Icon type="home" />
               <span className="nav-text">首页</span>
              </Link>
            </Menu.Item>
             <Menu.Item key="brokers">
               <Link to="/brokerPanel">
                  <Icon type="appstore" />
                  <span className="nav-text">Brokers</span>
               </Link>
            </Menu.Item>
            <Menu.Item key="topics">
               <Link to="/topicPanel">
                 <Icon type="switcher" />
                 <span className="nav-text">Topics</span>
               </Link>
           </Menu.Item>
          </Menu>
        </aside>
        <div className="layout-main">
          <div className="layout-header"></div>
          <div className="layout-container">

            <div className="layout-content">
              <div style={{ height: 580 }}>
                { this.props.children }
              </div>
            </div>
          </div>
          <div className="layout-footer">
          
          </div>
        </div>
      </div>
    );
  }
};

// 配置路由
render((
    <Router history={hashHistory} >
        <Route path="/" component={Index}>
          <IndexRoute component={MainPanel} />
          <Route path="brokerPanel" component={BrokerPanel} />
          <Route path="topicPanel" component={TopicPanel} />
          <Route path="groupPanel" component={GroupPanel} />
        </Route>
    </Router>
), document.getElementById("app"));
