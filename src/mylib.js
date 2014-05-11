String.STR_PAD_LEFT = 1;
String.STR_PAD_RIGHT = 2;
String.STR_PAD_BOTH = 3;
String.prototype.pad = function(len, pad, dir){
	 str = this;
	 if(typeof(len) == "undefined") var len = 0;
	 if(typeof(pad) == "undefined") var pad = ' ';
	 if(typeof(dir) == "undefined") var dir = String.STR_PAD_LEFT;
		 if(len + 1 >= str.length){
		 switch (dir){
			 case String.STR_PAD_LEFT:
				 str = Array(len + 1 - str.length).join(pad) + str;
				break;
			 case String.STR_PAD_BOTH:
				 var right = Math.ceil((padlen = len - str.length) / 2);
				 var left = padlen - right;
				 str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
				break;
			 default:
				 str = str + Array(len + 1 - str.length).join(pad);
				break;
			}
		}else
	 if(len < str.length){
		 switch (dir){
			 case String.STR_PAD_LEFT:
				 str = str.substr(0, len);
				break;
			 case String.STR_PAD_BOTH:
				 str = str.substr(Math.ceil((str.length - len) / 2), len);
				break;
			 default:
				 str = str.substr(-len);
				break;
			}
		}
	 return str;
	};

Number.prototype.toFix = function(len, type){
	 return this.toString(type).pad(len, "0", String.STR_PAD_LEFT);
	}
Number.prototype.Clamp = function(max, min){
	 return this<min?min:this>max?max:this;
	};

Array.prototype.FindItem = function(item){
	 var i = this.length;
	 while(i--){
		 if(this[i]==item) return i;
		}
	 return -1;
	}
Array.prototype.FindSameArray = function(arr){
	 var i = this.length, q = 0, f;
	 if(typeof this.toSource=="undefined") f = 'toString';
		else f = 'toSource';
	 while(q<i){
		 if(this[q++][f]()==arr[f]()) return --q;
		}
	 return -1;
	};
Array.prototype.each = function(f){
	 for(var k in this) if(this.hasOwnProperty(k)){
		 if(f.call(this, this[k], k)===false) break;
		}
	 return this;
	}

jQuery.fn.change = function(f){
	 this.bind('input propertychange', f);
	};

function StandartStart(){
	 $(document).tooltip({
		 track: true
		});
	
	 $("#tabs").tabs();
	
	 $(".variants").accordion({
		 icons: {
			 header: "ui-icon-circle-arrow-e",
			 activeHeader: "ui-icon-circle-arrow-s"
			},
		 heightStyle: "fill"
		});
	 
	 $(".resizable").css({
		 height: '80px',
		 width: '300px',
		}).resizable({
		 handles: "se",
		 maxHeight: 250,
		 maxWidth: 400,
		 minHeight: 80,
		 minWidth: 300
		});
	 $(".resizableW").css({
		 height: '120px',
		 width: '720px',
		}).resizable({
		 handles: "se",
		 maxHeight: 300,
		 maxWidth: 800,
		 minHeight: 120,
		 minWidth: 400
		});
	};
