/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Link } from 'react-router';
import { Table } from 'antd';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

const columns = [{
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
    }
];
const data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    }, {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    }, {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    }
];

export default class CollapseTable extends React.Component{
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
    
    componentDidMount() {
        //this.fetchFn()
    }

    render() {
        var brokerNum = this.props.brokerNum;
        var brokerInfo = this.props.brokerInfo;
        console.log("子组件" + brokerNum);
        console.log("子组件" + brokerInfo);

        return (
          <div>
            <Collapse defaultActiveKey={['1']} onChange={this.callback}>
               <Panel header="Broker1" key="1">
                 <Table columns={columns} dataSource={data} size="small" pagination={false}/>
               </Panel>
               <Panel header="Broker2" key="2">
                 <Table columns={columns} dataSource={data} size="small" pagination={false}/>
               </Panel>
               <Panel header="Broker3" key="3">
                 <Table columns={columns} dataSource={data} size="small" pagination={false}/>
               </Panel>
            </Collapse>
          </div>
        );
    }
}
