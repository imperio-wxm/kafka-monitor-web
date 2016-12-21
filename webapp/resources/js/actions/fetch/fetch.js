var HTTPUtil = {};

/**
 * 基于 fetch 封装的 GET请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HTTPUtil.get = function(url, params, headers) {
    if (params) {
        let paramsArray = [];
        //encodeURIComponent
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return new Promise(function (resolve, reject) {
      fetch(url, {
            method: 'GET',
            headers: headers,
          })
          .then((response) => {
              if (response.ok) {
                  return response.json();
              } else {
                  reject({status:response.status})
              }
          })
          .then((response) => {
              resolve(response);
          })
          .catch((err)=> {
            reject({status:-1});
          })
    })
}


/**
 * 基于 fetch 封装的 POST请求  FormData 表单数据
 * @param url
 * @param formData
 * @param headers
 * @returns {Promise}
 */
HTTPUtil.post = function(url, formData, headers) {
    return new Promise(function (resolve, reject) {
      fetch(url, {
            method: 'POST',
            headers: headers,
            body:formData,
          }
      ).then((response) => {
          if (response.ok) {
              return response.json();
          } else {
              reject({status:response.status})
          }
      })
      .then((response) => {
          resolve(response);
      })
      .catch((err)=> {
        reject({status:-1});
      })
    })
}

// Promise.all(urls.map(url =>
//     fetch(url).then(resp => resp.text())
// )).then(respList => {}).catch((e) => {console.log(e.message)})

/**
 * 基于 fetch 封装的多URL请求
 * @param urls
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HTTPUtil.URLs = function(urls) {
    return Promise.all(urls.map(url =>
        fetch(url).then((response) => {
            console.log(response);
            if (response.ok) {
                return response.text();
            } else {
                return {status:response.status};
            }
        })
      )).catch((err)=> {
          return {status:-1};
      })
}

// Promise.all(urls.map(url =>
//     fetch(url).then(resp => resp.text())
//   )).then(respList => {
//     var brokersObj = JSON.parse(respList[0]);
//     var topicsObj = JSON.parse(respList[1]);
//     var groupObj = JSON.parse(respList[2]);
//     var allConsumersNum = 0;
//
//     for(var o in groupObj){
//         allConsumersNum += parseInt(groupObj[o].consumersNum);
//         console.log(groupObj[o].groupName + " : " + groupObj[o].consumersNum)
//     }
//
//     this.setState({
//        brokersNum : brokersObj.length,
//        topicsNum : topicsObj.length,
//        groupsNum : groupObj.length,
//        consumersNum : allConsumersNum
//     })
//   })
//   .catch((e) => {
//     console.log(e.message)
//   })

export default HTTPUtil;
