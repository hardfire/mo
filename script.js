(function(){
	var canvas;

	function handleFileSelect(evt) {
		var f,reader;

		evt.stopPropagation();
		evt.preventDefault();

		f = evt.dataTransfer.files[0]; // take onle the first file

		//is it a image
		if(!f.type.match('image.*')) {
			return;
		}

		reader = new FileReader();
		reader.onload = function(e) {
			var dataURL = e.target.result;
			if(dataURL) {
				fabric.Image.fromURL(dataURL, function(img) {
					canvas.add(img);
					if (img.getWidth() > canvas.width){
						img.scaleToWidth(canvas.width);
					} 
					if(img.getHeight() > canvas.height) {
						img.scaleToHeight(canvas.height);
					}
					img.center();
					img.setCoords();
					canvas.renderAll();
				});
			};
		};

		reader.readAsDataURL(f);
	};

	function handleDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	};


	function handleKeypress(e) {
		e = e || window.event;
		var activeObject = canvas.getActiveObject();
		if (activeObject) {
			var distance = e.shiftKey ? 10 : 1;
			switch (e.keyCode) {
				case 8: /* backspace */
					canvas.remove(activeObject);
					break;
				case 37: /* left */
					activeObject.set('left', activeObject.get('left') - distance).setCoords();
					canvas.renderAll();
					break;
				case 39: /* right */
					activeObject.set('left', activeObject.get('left') + distance).setCoords();
					canvas.renderAll();
					break;
				case 40: /* down */
					activeObject.set('top', activeObject.get('top') + distance).setCoords();
					canvas.renderAll();
					break;
				case 38: /* up */
					activeObject.set('top', activeObject.get('top') - distance).setCoords();
					canvas.renderAll();
					break;
			}
			return false;
		}
	};

	function addNewElement(e) {
		var mo = e.target || e.srcElement;
		if( mo.nodeName === 'IMG')
		{
			fabric.Image.fromURL(mo.src, function(img) {
				canvas.add(img);
				img.scaleToWidth(100);
				img.center();
				img.setCoords();
				canvas.renderAll();
			});
		}
	};
	
	function sendToImgur() {
		canvas.deactivateAll();
		document.getElementById('status').innerHTML = 'Uploading';
		var image = canvas.toDataURL('jpeg').split(',')[1];
		var fd = new FormData();
		fd.append("key", "6528448c258cff474ca9701c5bab6927");
		fd.append("type", "base64");
		fd.append("name", "movember.jpg");
		fd.append("title", "Movember");
		fd.append("caption", "Movember");
		fd.append("image",image);

		// Create the XHR (Cross-Domain XHR FTW!!!)
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://api.imgur.com/2/upload.json"); // Boooom!
		xhr.onload = function() {
			// Big win!
			// The URL of the image is:
			var url = JSON.parse(xhr.responseText).upload.links.imgur_page;
			document.getElementById('status').innerHTML = '<a href="'+url+'"> It\'s Up! </a>';
			console.log(url);
		}
		// Ok, I don't handle the errors. An exercice for the reader.
		// And now, we send the formdata
		xhr.send(fd);

	}


	function init() {

		//initialize the fabric canvas element
		canvas = new fabric.Element('mocanvas');

		// Setup the dnd listner
		var dropZone = document.getElementById('container');
		dropZone.addEventListener('dragover', handleDragOver, false);
		dropZone.addEventListener('drop', handleFileSelect, false);

		//handle keyboard events
		document.onkeydown = handleKeypress;

		//adding new images
		document.getElementById('mos').onclick = addNewElement;

		//get image
		document.getElementById('getIt').onclick = function() {
			canvas.deactivateAll();
			window.open(canvas.toDataURL('png'));
			return false;
		};

		//send to imgur
		document.getElementById('imgur').onclick = sendToImgur;
	};

	init();

})();
