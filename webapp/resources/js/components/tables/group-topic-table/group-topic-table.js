/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Link } from 'react-router';
import { Table } from 'antd';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

import HTTPUtil from '../../../actions/fetch/fetch.js'


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

    constructor(props) {
        super(props)
        this.state = {
            groupName : this.props.groupName,
            topicList :[],

        }
    }

    getPartitionList = (groupName,topicName) => {

    }

    componentDidMount() {
        let urls = [
          "http://localhost:8080/monitor/groupTopicsView.do?groupName=" + this.state.groupName
        ];

        console.log(urls);

        HTTPUtil.URLs(urls).then((text) => {
           //处理 请求success
           if(text.size != 0 ){
               //我们假设业务定义code为0时，数据正常
               let topicObj = JSON.parse(text[0]);
               let topicList = [];

               for(var o in topicObj) {
                  topicList.push(topicObj[o]);
               }

               this.setState({
                  topicList : topicList
               })

               this.getPartitionList(this.state.groupName, topicList);
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
        let topicList = this.state.topicList;
        console.log(topicList);
        return (
          <div>
            <Collapse defaultActiveKey={['0']} onChange={this.callback}>
            {
                topicList.map((item, index)=>{
                    const columns = [];
                    const data = [];

                    // let createTime = formatDate(new Date(parseInt(item.createdTimestamp,10)));
                    // let modifyTime = formatDate(new Date(parseInt(item.modifyTimestamp,10)));
                    //
                    // data.push({
                    //   brokerName: `${item.brokerName}`,
                    //   version: `${item.version}`,
                    //   jmx_port: `${item.jmx_port}`,
                    //   createdTimestamp: `${createTime}`,
                    //   modifyTimestamp: `${modifyTime}`,
                    //   controller: `${item.controller}`
                    // });

                    return  <Panel header={item} key={index}>
                                <Table columns={columns} dataSource={data} size="middle" pagination={false}/>
                            </Panel>
                })
            }
            </Collapse>
          </div>
        );
    }
}
