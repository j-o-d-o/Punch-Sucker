//Global vars
//Pixel count starts at top left corner!
var xSize = 256; 
var ySize = 192;

var debug = true;

var timeOut, lastImageData, backgroundSample;
var canvasSource = $("#canvas-source")[0];
var canvasBlended = $("#canvas-blended")[0]; 
var canvasTmp = $("#canvas-tmp")[0];
var contextSource = canvasSource.getContext('2d');
var contextBlended = canvasBlended.getContext('2d');
var contextTmp = canvasTmp.getContext('2d');
var video = $("#webcam")[0];

var coordX , coordY; 
var stopMotionFlag = true;

var punchAvg = 0;

var stopPositionUpdate = false;

contextSource.translate(canvasSource.width, 0);
contextSource.scale(-1, 1);
 
//Functions
function initMotionDetection(){
	/*
	var p = navigator.mediaDevices.getUserMedia({ audio: false, video: true });

	p.then(function(mediaStream) { 
	  video.src = window.URL.createObjectURL(mediaStream);
	  video.onloadedmetadata = function(e) {
			updateDetection();
	  };
	});*/

	try {
		compatibility.getUserMedia({video: true}, function(stream) {
			try {
				video.src = compatibility.URL.createObjectURL(stream);
			} catch (error) {
				video.src = stream;
			}
			setTimeout(updateDetection, 8000/60);
		}, function (error) {  
			alert("WebRTC not available. You can switch to keyboard controll by clicking the camera button in the top right corner!");
		}); 
	} catch (error) { 
		alert(error);
	}
}

function updateDetection() {
	if(game.webCam){
		drawVideo();
		blend();
	}
	timeOut = setTimeout(updateDetection, 5000/60);
}

function drawVideo() {
	contextSource.drawImage(video, 0, 0, xSize, ySize);
}


//Filters
//=================================================

//Helper
function fastAbs(value) {
	// equivalent to Math.abs();
	return (value ^ (value >> 31)) - (value >> 31);
}
function threshold(value) {
	return (value > 0x09) ? 0xFF : 0;
}

//Difference motion detection
function differenceAccuracy(target, data1, data2) {
	if (data1.length != data2.length) return null;
	
	var y, x, rowOff, totalOff;

	for(y = 0; y < ySize; y++){
		rowOff = xSize * y * 4;
		target[y] = [];
		for(x  = 0; x < xSize; x++){
			totalOff = rowOff + x * 4; 
			
			var average1 = (data1[totalOff] + data1[totalOff+1] + data1[totalOff+2]) / 3;
			var average2 = (data2[totalOff] + data2[totalOff+1] + data2[totalOff+2]) / 3;
			var diff = threshold(fastAbs(average1 - average2));

			target[y][x] = diff;
		}
	}
	
	erosionFilter(target, 7);
}
 
//Errision filter
function erosionFilter(target, weight){
	
	var tmpData = [];	//For discret steps
	var count;
 
	for(var y = 0; y < ySize; y++){
		tmpData[y] = []; 
		for(var x  = 0; x < xSize; x++){
			count = 0;
			
			if(target[y][x] == 0xFF){
				
				//Corners
				count += (y+1) < ySize && (x+1) < xSize && target[y+1][x+1] == 0xFF ? 1 : 0;
				count += (y+1) < ySize && (x-1) >= 0 	&& target[y+1][x-1] == 0xFF ? 1 : 0;
				count += (y-1) >= 0    && (x+1) < xSize && target[y-1][x+1] == 0xFF ? 1 : 0;
				count += (y-1) >= 0    && (x-1) >= 0 	&& target[y-1][x-1] == 0xFF ? 1 : 0;
				//edges 
				count += (y-1) >= 0    && target[y-1][x  ] == 0xFF ? 1 : 0;
				count += (y+1) < ySize && target[y+1][x  ] == 0xFF ? 1 : 0;
				count += (x+1) < xSize && target[y  ][x+1] == 0xFF ? 1 : 0;
				count += (x-1) >= 0    && target[y  ][x-1] == 0xFF ? 1 : 0;
				
				tmpData[y][x] = count >= weight ? 0xFF : 0x00;
			}
			else{ 
				tmpData[y][x] = 0x00;
			}
		}
	}  
	target = tmpData; 
	
	//when debugging
	if(debug)
		drawBlendedImg(target);
	else
		evalMotion(target);
}

//Find the center of motion
function evalMotion(target){
	
	var centerCoordX = 0;
	var centerCoordY = 0;
	var count = 0;
	var countPunch = 0;
	var punchLeft = 0;
	var punchRight = 0;
	
	if(!stopPositionUpdate){
		for(var y = ySize * 0.5; y < ySize; y++){ 
			for(var x  = 0; x < xSize; x++){
				if(target[y][x] == 0xFF){
					// Motion detection move around
					count++;
					centerCoordX += x;
					centerCoordY += y;
				}
			}
		}
		 
		 
		//Only if at least 4% of the pixels show motion, rearange the center Motion coordinates
		if(count > (xSize * ySize * 0.04)){
			centerCoordX = centerCoordX / count;
			centerCoordY = centerCoordY / count;
			
			coordX = centerCoordX;
			coordY = centerCoordY;
		}
		
		for(var y = 0; y < ySize*0.5; y++){ 
			for(var x  = 0; x < xSize; x++){
				if(x > (coordX+30) || x < (coordX-30)){
					if(target[y][x] == 0xFF){ 
						countPunch++;
						if(x > coordX)
							punchRight++;
						else
							punchLeft++;
					}
				}
			}
		}
		
		if(punchAvg == 0)
			punchAvg = 1800;
		
		if(countPunch > (xSize * ySize * 0.01)){
			var diff = countPunch - punchAvg;
			if(diff > 1600){
				var diff = Math.abs(punchRight - punchLeft);
				if(diff > 500){
					if(punchRight > punchLeft){
						game.punchRight();
					}
					else{
						game.punchLeft();
					}
					coordX = xSize/2;
					stopPositionUpdate = true;
					setTimeout(function(){
						stopPositionUpdate = false;
					},800);
				}
			}
			else{ 
				if(diff > 0)
					punchAvg += diff * 0.20;
				if(diff < 0)
					punchAvg += diff * 0.13;
			}
		}

		//For debugging
		if(debug) drawMotionCenter();
	}
}

//Draw rectangle to current motion center
function drawMotionCenter(){
	if(coordX != undefined && coordY != undefined){
		//Draw coordinates on blended canvas 
		contextSource.beginPath();
		contextSource.lineWidth = '2';
		contextSource.fillStyle = 'rgba(255, 0, 0, 0.7)';
		contextSource.fillRect(
			xSize-coordX,  
			coordY,
			25,
			25
		);
		contextSource.stroke();
	}
}


//Debugging
//=============================
function drawBlendedImg(target){
	/* 
	var y ,x;
	var rowOff = 0;
	var totalOff = 0;
	
	var outData = contextTmp.getImageData(0, 0, canvasTmp.width, canvasTmp.height);
	
	for(y = 0; y < ySize; y++){ 
		rowOff = xSize * y * 4;
		
		for(x  = 0; x < xSize; x++){
			totalOff = rowOff + x * 4; 
			
			outData.data[totalOff  ] = target[y][x];
			outData.data[totalOff+1] = target[y][x];
			outData.data[totalOff+2] = target[y][x];
			outData.data[totalOff+3] = 0xFF;
			
		}
	}

	contextBlended.putImageData(outData, 0, 0);
	*/
	evalMotion(target);

}
 

function blend() {
	
	var blendedData = [];

	var sourceData = contextSource.getImageData(0, 0, canvasSource.width, canvasSource.height);

	if (!lastImageData) lastImageData = sourceData;

	//This starts the filter "pipline", every other filter is called from function to function
	differenceAccuracy(blendedData, sourceData.data, lastImageData.data);
	
	lastImageData = sourceData;

}


function getMotions(){
	if(coordX == undefined || coordX == NaN)
		return 0;
	 
	var weightX = ((coordX / xSize) - 0.5) * 3.0;
	if(Math.abs(weightX) < 0.18)
		return 0;
	
	return weightX;
}

