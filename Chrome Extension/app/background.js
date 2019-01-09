var port = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	var hostName = "com.google.chrome.example.echo";
    var urlArray=message.greeting.split('/');
	var finalFilePath="\\\\"+urlArray[2]+"@SSL\\DavWWWRoot";
	for(var i=3;i<urlArray.length;i++){
		finalFilePath=finalFilePath+"\\"+urlArray[i];
	}
    port = chrome.runtime.connectNative(hostName);
	var str = {text: decodeURIComponent(finalFilePath)};
    port.postMessage(str);
	port.onMessage.addListener(onNativeMessage(port));
    sendResponse({
        data: "Message Received"
    }); 
});

function onNativeMessage(port) {
	return function(message) {
		if(message && message.response === "Opened"){
			port.postMessage(null);
		}
	}
}  

