document.body.addEventListener('click', onFileClickEvent, true);

function onFileClickEvent(event){
if(event.srcElement.textContent=="Open with Autocad"){
	var msg = $('.ms-DetailsRow.is-selected [role="rowheader"] span a')[0].href;
	 chrome.runtime.sendMessage({greeting: msg}, function(response) {
			  console.log(response);
			});
}
}
