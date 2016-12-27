import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactHighcharts  from 'react-highcharts';
import Highcharts  from 'highcharts';


class Charts extends React.Component {
  componentDidMount() {
      // let dataList = [];
      // for(let i = 0; i < 11; i++) {
      //   dataList.push(i);
      // }
      // config.series[0].data = dataList
  }
  render() {
    let topicName = this.props.topicName;
    let groupName = this.props.groupName;

    const config = {
      global: {
           useUTC: false
      },
      chart: {
           type: 'spline',
           animation: Highcharts.svg, // don't animate in old IE
           marginRight: 10,
           events: {
               load: function () {
                   // set up the updating of the chart each second
                   var offsetSeries = this.series[0];
                   var logSizeSeries = this.series[1];
                   var lagSeries = this.series[2];
                   var ws = new WebSocket('ws://localhost:8080/monitor/webSocketServer.do?groupName='+ groupName + '&topicName=' + topicName);
                   ws.onopen = function (evt) {
                     console.log("Connected !");
                   };
                   setInterval(function () {
                     var x = (new Date()).getTime(); // current time
                     ws.onmessage = function (evt) {
                         if (evt.data != null) {
                           var dataJson = JSON.parse(evt.data);
                           console.log(dataJson);
                           var allOffset = 0;
                           var allLagSize = 0;
                           var allLag = 0;

                           for(var o in dataJson) {
                              allOffset += parseFloat(dataJson[o].offsetInfos.offset);
                              allLagSize += parseFloat(dataJson[o].offsetInfos.logSize);
                              allLag += parseFloat(dataJson[o].offsetInfos.lag);
                           }
                           offsetSeries.addPoint([x, allOffset], true, true);
                           logSizeSeries.addPoint([x, allLagSize], true, true);
                           lagSeries.addPoint([x, allLag], true, true);
                         }
                     };
                     ws.onerror = function (evt) {
                       console.log('<span style="color: red;">ERROR:</span> '
                         + evt.data);
                       ws.close();
                     };
                   }, 2000);
               }
           }
       },
       title: {
           text: topicName
       },
       xAxis: {
           type: 'datetime',
           tickPixelInterval: 150
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
       tooltip: {
           shared: true,
           crosshairs: true
       },
       legend: {
             borderWidth: 0
       },
       exporting: {
           enabled: false
       },
       series: [{
           name: 'Offset',
           data: (function () {
               // generate an array of random data
               var data = [],
                   time = (new Date()).getTime(),
                   i;
               for (i = -19; i <= 0; i += 1) {
                   data.push({
                       x: time + i * 1000,
                       y: Math.random()
                   });
               }
               return data;
           }())
       },{
           name: 'Log Size',
           data: (function () {
               // generate an array of random data
               var data = [],
                   time = (new Date()).getTime(),
                   i;
               for (i = -19; i <= 0; i += 1) {
                   data.push({
                       x: time + i * 1000,
                       y: Math.random()
                   });
               }
               return data;
           }())
       },{
           name: 'Lag',
           data: (function () {
               // generate an array of random data
               var data = [],
                   time = (new Date()).getTime(),
                   i;
               for (i = -19; i <= 0; i += 1) {
                   data.push({
                       x: time + i * 1000,
                       y: Math.random()
                   });
               }
               return data;
           }())
       }]
    };
    return (
      <ReactHighcharts config={config} ref="chart"></ReactHighcharts>
    );
  }
}

export default Charts;
