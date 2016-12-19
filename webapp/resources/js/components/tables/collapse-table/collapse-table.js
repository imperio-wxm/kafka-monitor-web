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

    render() {
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
