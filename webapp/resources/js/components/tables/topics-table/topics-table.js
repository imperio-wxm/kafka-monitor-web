/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Link } from 'react-router';
import { Table } from 'antd';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;
import { Modal, Button } from 'antd';


const DetailsButton = React.createClass({
      getInitialState() {
        return {
          visible: false
        };
      },
      showModal() {
        this.setState({
          visible: true,
        });
      },
      handleOk() {
        console.log('Clicked OK');
        this.setState({
          visible: false,
        });
      },
      handleCancel(e) {
        console.log(e);
        this.setState({
          visible: false,
        });
      },
      render() {
        let dataObj = JSON.parse(this.props.data);
        let dataList = [];

        //重新组装数据
        for(var o in dataObj) {
            let temp = [];
            temp.push(o);
            temp.push(dataObj[o]);
            dataList.push(temp);
        }

        const columns = [{
              title: '属性',
              dataIndex: 'key',
            }, {
              title: '值',
              dataIndex: 'value',
            }
        ];
        const data = [];

        return (
          <div>
            <Button onClick={this.showModal}>Details</Button>
            <Modal title="详情" visible={this.state.visible} onOk={this.handleOk}
              onCancel={this.handleCancel} okText="OK" cancelText="Cancel">
              {
                dataList.map((item, index)=>{
                    data.push({
                      key: `${item[0]}`,
                      value: `${item[1]}`
                    });
                })
              }
              <Table columns={columns} dataSource={data} size="middle" pagination={false}/>
            </Modal>
          </div>
        );
      },
});

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
  title: 'Create Time',
  dataIndex: 'createdTimestamp',
}, {
  title: 'Modify Time',
  dataIndex: 'modifyTimestamp',
}, {
  title: 'Detailes',
  dataIndex: 'detailes',
  render: (text) => <DetailsButton data={text} />,
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
              createdTimestamp: `${createTime}`,
              modifyTimestamp: `${modifyTime}`,
              detailes : `${item}`
            });
        })

        return (
          <div>
              <Table columns={columns} dataSource={data} pagination={pagination} />
          </div>
        );
    }
}
