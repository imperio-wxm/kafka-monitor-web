/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Link } from 'react-router';
import { Table } from 'antd';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

const columns = [{
      title: 'Partition',
      dataIndex: 'partition',
    }, {
      title: 'Offset',
      dataIndex: 'offset',
    }, {
      title: 'LogSize',
      dataIndex: 'logSize',
    }, {
      title: 'Lag',
      dataIndex: 'lag',
    }, {
      title: 'Qwner',
      dataIndex: 'owner',
    }, {
      title: 'Created Time',
      dataIndex: 'createdTimestamp',
    }, {
      title: 'Modify Time',
      dataIndex: 'modifyTimestamp',
    }
];

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i,
    partition: `${i}`,
    offset: `${i * 100}`,
    logSize: 12356,
    lag: 120,
    owner : `owner ${i}`,
    createdTimestamp : `${getNowFormatDate()}`,
    modifyTimestamp : `${getNowFormatDate()}`
  });
}

export default class GroupTopicTable extends React.Component{
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
               <Panel header="topic 1" key="1">
                 <Table columns={columns} dataSource={data} size="small" pagination={false}/>
               </Panel>
               <Panel header="topic 2" key="2">
                 <Table columns={columns} dataSource={data} size="small" pagination={false}/>
               </Panel>
               <Panel header="topic 3" key="3">
                 <Table columns={columns} dataSource={data} size="small" pagination={false}/>
               </Panel>
            </Collapse>
          </div>
        );
    }
}
