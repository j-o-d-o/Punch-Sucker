function motionCenter(target){
	var width = canvasSource.width;
	var height = canvasSource.height;
	var tmpData = contextSource.createImageData(width, height);
	
	var y = 0;
	var x = 0;
	var i = 0;
	var rowOffset = 0;
	var totalOffset = 0; 
	var motionCount = 0;
	var totalMotionRow = 0;
	var motionCenterCoord = 0;
	
	for(y = 0; y < ySize; y++){
		rowOffset = xSize * y * 4;
		totalMotionRow = 0;
		motionCount = 0;
		
		for(x = 0; x < xSize; x++){ 
			totalOffset = rowOffset + x * 4;
			if(target[totalOffset] > 0x15){
				//It is white and therefor there is motion
				motionCount++;
				totalMotionRow += x;
			}
			target[totalOffset    ] = 0x00;
			target[totalOffset + 1] = 0x00;
			target[totalOffset + 2] = 0x00;
			target[totalOffset + 3] = 0xFF;
		}
		if(motionCount != 0){

			motionCenterCoord = Math.floor(totalMotionRow / motionCount) * 4;
			motionWeight = Math.floor(motionCount / 10);
			motionCenterCoord -= motionWeight * 4;
			for(i = 0; i < motionWeight * 2; i++){ 
				totalOffset = rowOffset + motionCenterCoord + i * 4;
				target[totalOffset    ] = 0xFF;
				target[totalOffset + 1] = 0x00;
				target[totalOffset + 2] = 0x00;
				target[totalOffset + 3] = 0xFF;
			}
		}
	}
}


function mergeBackground(target, currentSource){
	var w = 0.04;
	var c = 1.5;
	var clipp = 30;
	var i = 0;
	var diff = 0;
	while (i < (currentSource.length * 0.25)) {
		//offsets to current image
		var redOff = currentSource[4*i] - target[4*1];
		var greenOff = currentSource[4*i+1] - target[4*1+1];
		var blueOff = currentSource[4*i+2] - target[4*1+2];
   
   		//Red 
		if(redOff >= 0){
			diff = (redOff * w + c);
			if(target[4*i] + diff > currentSource[4*i]){
				target[4*i] = currentSource[4*i];
			}
			else{
				target[4*i] += diff;
			}
		}
		else{
			diff = (redOff * w - c);	//diff is negative in this case (cause Offset is negative)
			if(target[4*i] + diff < currentSource[4*i]){
				target[4*i] = currentSource[4*i];
			}
			else{
				target[4*i] += diff;
			}
		}
		//Green
		if(greenOff >= 0){
			diff = (greenOff * w + c);
			if(target[4*i+1] + diff > currentSource[4*i+1]){
				target[4*i+1] = currentSource[4*i+1];
			}
			else{
				target[4*i+1] += diff;
			}
		}
		else{
			diff = (greenOff * w - c);	//diff is negative in this case (cause Offset is negative)
			if(target[4*i+1] + diff < currentSource[4*i+1]){
				target[4*i+1] = currentSource[4*i+1];
			}
			else{
				target[4*i+1] += diff;
			}
		}
		//Blue
		if(blueOff >= 0){
			diff = (blueOff * w + c);
			if(target[4*i+2] + diff > currentSource[4*i+2]){
				target[4*i+2] = currentSource[4*i+2];
			}
			else{
				target[4*i+2] += diff;
			}
		}
		else{
			diff = (blueOff * w - c);	//diff is negative in this case (cause blueOff is negative)
			if(target[4*i+2] + diff < currentSource[4*i+2]){
				target[4*i+2] = currentSource[4*i+2];
			}
			else{
				target[4*i+2] += diff;
			}
		}
		++i;
	}
}