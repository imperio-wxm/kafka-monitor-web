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
      formatPartitions(partitions) {
           const partitionDetailsColumns = [{
                 title: 'Partition Id',
                 dataIndex: 'partitionId',
               }, {
                 title: 'Replicas BrokerId',
                 dataIndex: 'replicasBrokerId',
               }
           ];
           const partitionDetails = [];

           for(var p in partitions) {
               partitionDetails.push({
                 partitionId: `${p}`,
                 replicasBrokerId: `${partitions[p]}`
               });
           }
           return <Table columns={partitionDetailsColumns} dataSource={partitionDetails} size="middle" pagination={false} />
       },
      render() {
        let dataObj = JSON.parse(this.props.data);
        let dataList = [];
        let keyName =  new Array("Topic Name","Version","Create Time","Modify Time","Partitions","Delete");
        let topicName = dataObj.topicName;
        var partitionInfoTable = this.formatPartitions(dataObj.partitions);

        //重新组装数据
        let index = 0;
        for(var o in dataObj) {
            let temp = [];

            if (index === 0 || index === 4) {
              index++;
              continue;
            } else if (index === 2) {
              temp.push(keyName[index]);
              temp.push(formatDate(new Date(parseInt(dataObj[o],10))));
            } else if (index === 3) {
              temp.push(keyName[index]);
              temp.push(formatDate(new Date(parseInt(dataObj[o],10))));
            } else {
              temp.push(keyName[index]);
              temp.push(dataObj[o]);
            }
            index++;
            dataList.push(temp);
        }

        console.log(dataList);

        const topicInfoColumns = [{
              title: '属性',
              dataIndex: 'key',
            }, {
              title: '值',
              dataIndex: 'value',
            }
        ];
        const topicInfo = [];

        const partitionInfoColumns = [{
              title: 'Partition Id',
              dataIndex: 'partitionId',
            }, {
              title: 'Replicas BrokerId',
              dataIndex: 'replicasBrokerId',
            }
        ];
        const partitionInfo = [];

        return (
          <div>
            <Button onClick={this.showModal}>Details</Button>
            <Modal title={topicName + " 详情"} visible={this.state.visible} onOk={this.handleOk}
              onCancel={this.handleCancel} okText="OK" >
              {
                dataList.map((item, index)=>{
                  if (index != 0 || index != 4) {
                    topicInfo.push({
                      key: `${item[0]}`,
                      value: `${item[1]}`
                    });
                  }
                })
              }
              <Table columns={topicInfoColumns} dataSource={topicInfo} size="middle" pagination={false} />
              {partitionInfoTable}
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
  title: 'Partition Count',
  dataIndex: 'partitionCount',
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

            let createTime = formatDate(new Date(parseInt(temp.createdTimestamp,10)));
            let modifyTime = formatDate(new Date(parseInt(temp.modifyTimestamp,10)));
            var partitionCount = 0;
            for(var partition in temp.partitions){
              partitionCount++;
            }

            data.push({
              topicName: `${temp.topicName}`,
              partitionCount : `${partitionCount}`,
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
