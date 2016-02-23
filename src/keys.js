
var Key = {
    _pressed: {},
    _triggered: { },
    disabled : false,
    PUNCH_LEFT: 79, //O (punch left)
    PUNCH_RIGHT: 80, //P (punch right)
    LEFT: 37, //Arrow Left (rotate left)
    RIGHT: 39, //Arrow right (rotate right)
    QUIT: 81, //Q (quit)
	
    isDown: function(keyCode) {
		var bool = false; 
		
        if(keyCode == this.PUNCH_LEFT && this._pressed[keyCode]){
            //PUNCH_LEFT only needs to be trigger once
            if(this._triggered[this.PUNCH_LEFT] != true) bool = true;
            else bool = false;

            this._triggered[this.PUNCH_LEFT] = true; 
            
            return bool;
        }
        else if(keyCode == this.PUNCH_RIGHT && this._pressed[keyCode]){
            //Reload only needs to be trigger once
            if(this._triggered[this.PUNCH_RIGHT] != true) bool = true;
            else bool = false;

            this._triggered[this.PUNCH_RIGHT] = true;
            
            return bool;
        }
        else
            return this._pressed[keyCode];
    },
    onKeydown: function(event) {   
        this._pressed[event.keyCode] = true;
    },
    onKeyup: function(event) {
        delete this._triggered[event.keyCode]
        delete this._pressed[event.keyCode];
    }
    
};
