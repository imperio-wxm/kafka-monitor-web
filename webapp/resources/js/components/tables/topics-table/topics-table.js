/**
 * Created by weiximing.imperio on 2016/12/14.
 */
import React from 'react'

import { Link } from 'react-router';
import { Modal, Button,Icon,Collapse,Table,Tabs,Select,Dropdown,Menu, message } from 'antd';
const Option = Select.Option;
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

import RealTimeCharts from '../../../actions/highcharts-script/real-time-charts.js'
import HisTimeCharts from '../../../actions/highcharts-script/his-time-charts.js'
import CassandraCountCharts from '../../../actions/highcharts-script/cassandra-count-charts.js'

const DetailsButton = React.createClass({
      getInitialState() {
        return {
          visible: false,
          newRandomKey: Math.random()
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

const MonitorButton = React.createClass({
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
        return (
          <div>
            <Button onClick={this.showModal} size="small" type="dashed" style={{width:90}} ghost>Group</Button>
            <Modal title={"监控"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} width="1100" hight="700">
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Tab 1" key="1"><RealTimeCharts /></TabPane>
                <TabPane tab="Tab 2" key="2">Content of tab 2</TabPane>
                <TabPane tab="Tab 3" key="3">Content of tab 3</TabPane>
                <TabPane tab="Tab 4" key="4">Content of tab 4</TabPane>
              </Tabs>
            </Modal>
          </div>
        );
      },
});

const GroupSelect = React.createClass({
      getInitialState() {
        return {
          visible: false
        };
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
      handleChange(value) {
        console.log(`selected ${value}`);
      },
      handleMenuClick(e) {
        console.log('click', e);
        this.setState({
          visible: true,
        });
      },
      render() {
        const menu = (
          <Menu onClick={this.handleMenuClick}>
            <Menu.Item key="1">1st menu item</Menu.Item>
            <Menu.Item key="2">2nd menu item</Menu.Item>
            <Menu.Item key="3">3d menu item</Menu.Item>
          </Menu>
        );
        return (
          <div>
             <Dropdown overlay={menu}>
               <Button type="primary" ghost>
                 Groups <Icon type="down" />
               </Button>
             </Dropdown>
             <Modal key={this.state.newRandomKey} title={"监控"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
                width="1100" style={{height:1400,top:30}}>
                 <Tabs defaultActiveKey="1" type="card">
                   <TabPane tab="实时曲线" key="1">
                      <RealTimeCharts topicName={"test_001"} groupName={"group_1"} ref="realTimeChart"/>
                   </TabPane>
                   <TabPane tab="历史曲线" key="2">
                      <HisTimeCharts topicName={"test_001"} groupName={"group_1"} ref="hisTimeCharts"/>
                   </TabPane>
                   <TabPane tab="Cassandra 写入曲线" key="3">
                      <CassandraCountCharts  topicName={"test_001"} groupName={"group_1"} ref="cassandraCountCharts"/>
                   </TabPane>
                   <TabPane tab="Tab 4" key="4">Content of tab 4</TabPane>
                 </Tabs>
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
  title: 'Is Active',
  dataIndex: 'isActive',
  render: (text) => <Icon type="check"  data={text}/>,
}, {
  title: 'Detailes',
  dataIndex: 'detailes',
  render: (text) => <DetailsButton data={text} />,
}, {
  title: 'Monitor Details',
  dataIndex: 'monitorDetails',
  render: (text) => <GroupSelect data={text} />,
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
              isActive : `${item}`,
              detailes : `${item}`,
              monitorDetails : `${item}`
            });
        })

        return (
          <div>
              <Table columns={columns} dataSource={data} pagination={pagination} />
          </div>
        );
    }
}
