var URLUtil = {};

URLUtil.getHost = function() {
  return window.location.host.replace("9090", "8088");
}

URLUtil.getProtocol = function() {
  return window.location.protocol;
}

URLUtil.getUrlHead = function() {
  let host = URLUtil.getHost();
  let protocol = URLUtil.getProtocol();
  return protocol + "//" + host;
}


export default URLUtil;
