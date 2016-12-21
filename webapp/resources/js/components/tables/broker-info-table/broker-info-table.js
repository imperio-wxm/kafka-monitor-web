/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Link } from 'react-router';
import { Table } from 'antd';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

const columns = [{
      title: 'Broker Id',
      dataIndex: 'brokerName',
    }, {
      title: 'Version',
      dataIndex: 'version',
    }, {
      title: 'JMX Port',
      dataIndex: 'jmx_port',
    }, {
      title: 'Create Time',
      dataIndex: 'createdTimestamp',
    }, {
      title: 'Modify Time',
      dataIndex: 'modifyTimestamp',
    }, {
      title: 'IsController',
      dataIndex: 'controller',
    }
];

function formatDate(datetime) {
    var year = datetime.getFullYear(),
    month = (datetime.getMonth() + 1 < 10) ? '0' + (datetime.getMonth() + 1):datetime.getMonth() + 1,
    day = datetime.getDate() < 10 ? '0' +  datetime.getDate() : datetime.getDate(),
    hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours(),
    min = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes(),
    sec = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}

export default class BrokerInfoTable extends React.Component{
    constructor(props) {
        super(props)
    }

    render() {
        /* 数据格式
        [
          {
            "brokerName":"0",
            "host":"192.168.18.74",
            "port":"9092",
            "version":"1",
            "jmx_port":"-1",
            "createdTimestamp":"1482213562869",
            "modifyTimestamp":"1482213562869",
            "timestamp":"1482213562869",
            "controller":true
          }
        ]*/
        let brokerNum = this.props.brokerNum;
        let brokerInfo = this.props.brokerInfo;

        return (
          <div>
            <Collapse defaultActiveKey={['0']}>
               {
                   brokerInfo.map((item, index)=>{
                       const data = [];

                       let createTime = formatDate(new Date(parseInt(item.createdTimestamp,10)));
                       let modifyTime = formatDate(new Date(parseInt(item.modifyTimestamp,10)));

                       data.push({
                         brokerName: `${item.brokerName}`,
                         version: `${item.version}`,
                         jmx_port: `${item.jmx_port}`,
                         createdTimestamp: `${createTime}`,
                         modifyTimestamp: `${modifyTime}`,
                         controller: `${item.controller}`
                       });

                       return  <Panel key={index} header={item.host + ":" + item.port} >
                                  <Table columns={columns} dataSource={data} size="middle" pagination={false}/>
                               </Panel>
                   })
               }
            </Collapse>
          </div>
        );
    }
}
