import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactHighcharts  from 'react-highcharts';
import Highcharts  from 'highcharts';


class Charts extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          config: {},
      }
  }

  componentWillMount() {
    this.getWebSocketConn();
  }

  closeWebSocketConn = () => {
       this.state.ws.close();
       console.log("Closed!");
  }

  componentWillUpdate() {
      console.log("componentWillUpdate");
  }

  getWebSocketConn = () => {
      var ws = new WebSocket('ws://localhost:8080/monitor/webSocketServer.do?groupName='+ this.props.groupName + '&topicName=' +  this.props.topicName);
      ws.onopen = function(evt){
        console.log("Connected !");
      };
      return ws;
  }

  componentWillUnmount() {
     this.state.ws.close();
     console.log("componentWillUnmount!");
  }

  componentDidMount() {
    let topicName = this.props.topicName;
    let groupName = this.props.groupName;

    let ws = this.getWebSocketConn();

    let initIndex = 0;
    let initOffset = [];
    let initLogSize = [];
    let initLag = [];

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
                     var index = 0;
                     // set up the updating of the chart each second
                     var offsetSeries = this.series[0];
                     var logSizeSeries = this.series[1];
                     var lagSeries = this.series[2];

                     setInterval(function () {

                         ws.onmessage = function (evt) {

                             if (evt.data != null) {
                               var dataJson = JSON.parse(evt.data);
                               var x = (new Date()).getTime(); // current time
                               console.log(dataJson);
                               var allOffset = 0;
                               var allLagSize = 0;
                               var allLag = 0;

                               for(var o in dataJson) {
                                  allOffset += parseFloat(dataJson[o].offsetInfos.offset);
                                  allLagSize += parseFloat(dataJson[o].offsetInfos.logSize);
                                  allLag += parseFloat(dataJson[o].offsetInfos.lag);
                               }

                               if (index < 10) {
                                   offsetSeries.addPoint([x, allOffset], true, false);
                                   logSizeSeries.addPoint([x, allLagSize], true, false);
                                   lagSeries.addPoint([x, allLag], true, false);
                               } else {
                                   offsetSeries.addPoint([x, allOffset], true, true);
                                   logSizeSeries.addPoint([x, allLagSize], true, true);
                                   lagSeries.addPoint([x, allLag], true, true);
                               }
                             }
                             index++;
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
             crosshairs: true,
             hideDelay:1000
         },
         legend: {
               borderWidth: 0
         },
         exporting: {
             enabled: false
         },
         series: [{
             name: 'Offset',
             data: []
         },{
             name: 'Log Size',
             data: []
         },{
             name: 'Lag',
             data: []
         }]
      };
      this.setState({
         config : config,
      })
  }

  render() {
    return (
      <div>
        <ReactHighcharts config={this.state.config} ref="chart"> </ReactHighcharts>
      </div>
    );
  }
}

export default Charts;
