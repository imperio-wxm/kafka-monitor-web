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
  title: 'Topic Name',
  dataIndex: 'topicName',
  render: text => <a href="#">{text}</a>,
},{
  title: 'Partition Number',
  dataIndex: 'partitions',
},{
  title: 'Create Time',
  dataIndex: 'createdTimestamp',
}, {
  title: 'Modify Time',
  dataIndex: 'modifyTimestamp',
}];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    topicName: `topic ${i}`,
    partitions: `${i}`,
    createdTimestamp: `${getNowFormatDate()}`,
    modifyTimestamp:`${getNowFormatDate()}`
  });
}

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

export default class PaginationTable extends React.Component{
    //初始化
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
        return (
          <div>
            <Table columns={columns} dataSource={data} pagination={pagination} />
          </div>
        );
    }
}
