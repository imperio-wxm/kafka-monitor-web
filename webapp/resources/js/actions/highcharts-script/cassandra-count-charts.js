import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactHighcharts  from 'react-highcharts';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import Highcharts  from 'highcharts';

import HTTPUtil from '../fetch/fetch.js'


function js_strto_time(str_time){
	var new_str = str_time.replace(/:/g,"-");
	new_str = new_str.replace(/ /g,"-");
	var arr = new_str.split("-");
	var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
	return strtotime = datum.getTime()/1000;
}

function getNowDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if(month > 0 && month < 10) {
        month = '0' + month;
    }
    if(day > 0 && day < 10) {
        day = '0' + day;
    }
    if(hour > 0 && hour < 10) {
        hour = '0' + hour;
    }
    if(minute > 0 && minute < 10) {
        minute = '0' + minute;
    }
    if(second > 0 && second < 10) {
        second = '0' + second;
    }
    return year + '-' + month + '-' + day  + ' ' + hour + ':' + minute + ':' + second;
}

function getLastWeekDate() {
    var now = new Date();
    var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if(month > 0 && month < 10) {
        month = '0' + month;
    }
    if(day > 0 && day < 10) {
        day = '0' + day;
    }
    if(hour > 0 && hour < 10) {
        hour = '0' + hour;
    }
    if(minute > 0 && minute < 10) {
        minute = '0' + minute;
    }
    if(second > 0 && second < 10) {
        second = '0' + second;
    }
    return year + '-' + month + '-' + day  + ' ' + hour + ':' + minute + ':' + second;
}

class CassandraCountCharts extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          config: {},
      }
  }

  componentDidMount() {

    console.log(getLastWeekDate());
    console.log(getNowDate());

    let groupName = this.props.groupName;
    let topicName = this.props.topicName;
    let startTime = this.props.startTime;
    let endTime = this.props.endTime;

    var urls = [
      "http://localhost:8088/monitor/countByTime.do?typeName=cassandra&groupName=" +
          groupName + "&topicName=" + topicName + "&startTime=" + getLastWeekDate() + "&endTime=" + getNowDate()
    ];

    HTTPUtil.URLs(urls).then((text) => {
       //处理 请求success
       if(text.size != 0 ){
           //我们假设业务定义code为0时，数据正常
           var cassandraCountObj = JSON.parse(text);

           let cassandraCount = [];
					 let cassandraCountSum = [];

					 let count = 0;

           for(var o in cassandraCountObj){
               let countNum = [];
							 let countSum = [];

               var starttime = (cassandraCountObj[o].Insert_Time).replace(new RegExp("-","gm"),"/");
               var starttimeHaoMiao = (new Date(starttime)).getTime();

               countNum.push(starttimeHaoMiao);
               countNum.push(cassandraCountObj[o].Count_Num);

							 count += cassandraCountObj[o].Count_Num;

							 countSum.push(starttimeHaoMiao);
							 countSum.push(count);

               cassandraCount.push(countNum);
							 cassandraCountSum.push(countSum);
           }

           const config = {
               global: { useUTC: false } ,
               rangeSelector: {
                 buttons: [{
                      count: 5,
                      type: 'minute',
                      text: '5m'
                  },  {
                      count: 1,
                      type: 'hour',
                      text: '1h'
                  },  {
                      count: 5,
                      type: 'hour',
                      text: '5h'
                  },  {
                      count: 1,
                      type: 'day',
                      text: '1d'
                  }, {
                      type: 'all',
                      text: 'All'
                  }],
                  inputEnabled: false,
                  selected: 0
               },
               title: {
                 text: topicName
               },
							 yAxis: {
									 title: {
											 text: 'Value'
									 },
									 plotLines: [{
											 value: 0,
											 width: 1,
											 color: '#808080'
									 }]
							 },
               xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: {
                      millisecond: '%H:%M:%S',
                      second: '%H:%M:%S',
                      minute: '%H:%M',
                      hour: '%H:%M',
                      day: '%m-%d',
                      week: '%m-%d',
                      month: '%Y-%m',
                      year: '%Y'
                  },
              },
               tooltip: {
								 	 valueDecimals: 0,
                   shared: true,
                   crosshairs: true,
                   hideDelay:1000
               },
               legend: {
                    enabled: true,
                    borderWidth: 0
               },
               series: [{
                 name: 'Cassandra Write Count',
                 data: cassandraCount,
               },{
                 name: 'Cassandra Write Sum',
                 data: cassandraCountSum,
								 visible:false
               }]
             };

             this.setState({
                config : config,
             })

             //取消UTC时区
             ReactHighcharts.Highcharts.setOptions({ global: { useUTC: false } });

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
    return (
      <div>
        <ReactHighstock config={this.state.config} ref="cassandraCountChart"> </ReactHighstock>
      </div>
    );
  }
}

export default CassandraCountCharts;
