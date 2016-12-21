/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Link } from 'react-router';
import { Table } from 'antd';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;
import { Modal, Button } from 'antd';


function info() {
  Modal.info({
    title: 'This is a notification message',
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
    onOk() {},
  });
}

function formatDate(datetime) {
    var year = datetime.getFullYear(),
    month = (datetime.getMonth() + 1 < 10) ? '0' + (datetime.getMonth() + 1):datetime.getMonth() + 1,
    day = datetime.getDate() < 10 ? '0' +  datetime.getDate() : datetime.getDate(),
    hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours(),
    min = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes(),
    sec = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}

const columns = [{
  title: 'Topic Name',
  dataIndex: 'topicName',
},{
  title: 'Partition Number',
  dataIndex: 'partitions',
},{
  title: 'Create Time',
  dataIndex: 'createdTimestamp',
}, {
  title: 'Modify Time',
  dataIndex: 'modifyTimestamp',
}, {
  title: 'Detailes',
  dataIndex: 'detailes',
  render: text => <Button onClick={info}>Info</Button>,
}];

const data = [];

const pagination = {
  total: data.length,
  showSizeChanger: true,
  onShowSizeChange: (current, pageSize) => {
    console.log('Current: ', current, '; PageSize: ', pageSize);
  },
  onChange: (current) => {
    console.log('Current: ', current);
  },
};

export default class TopicsTable extends React.Component{
    //初始化
    constructor(props) {
        super(props)
    }

    // componentWillMount() {
    //    data = [];
    // }

    componentDidMount() {

    }

    render() {
        let topicNameList = this.props.topicNameList;
        let topicInfo = this.props.topicInfo;

        //清空原来数据
        data.length = 0;

        topicInfo.map((item, index)=>{
            let temp = JSON.parse(item);
            console.log(temp);

            let createTime = formatDate(new Date(parseInt(temp.createdTimestamp,10)));
            let modifyTime = formatDate(new Date(parseInt(temp.modifyTimestamp,10)));
            let partitionList = [];

            partitionList.push("[");
            for(var o in temp.partitions) {
                partitionList.push(o);
                partitionList.push(", ");
            }
            partitionList.pop();
            partitionList.push("]");

            data.push({
              topicName: `${temp.topicName}`,
              partitions: `${partitionList.join("")}`,
              createdTimestamp: `${createTime}`,
              modifyTimestamp: `${modifyTime}`,
              detailes : `${"详情"}`
            });
        })

        return (
          <div>
              <Table columns={columns} dataSource={data} pagination={pagination} />
          </div>
        );
    }
}
