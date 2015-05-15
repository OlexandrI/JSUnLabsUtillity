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

function calc_pdv(type, leng){
	 switch(type.toUpperCase()){
		 case 'CLASS1': case 'C1':
			return 140;
		 case 'CLASS2': case 'C2':
			switch(leng){
				 case 'TX/TX': case 'FX/FX': case 'FX/TX': case 'TX/FX':
					return 92;
				 case 'TX/T4': case 'FX/T4': case 'T4/TX': case 'T4/FX': case 'T4/T4':
					return 67;
				 default:
					return 0;
				}
		 case 'T4/T4':
			return 138;
		 case 'TX/TX': case 'FX/FX': case 'FX/TX': case 'TX/FX':
			return 100;
		 case 'TX/T4': case 'FX/T4': case 'T4/TX': case 'T4/FX':
			return 127;
		 case 'TX':
			return (1112 * leng)/1000;
		 case 'FX':
			return leng;
		 case 'T4': default:
			return (114 * leng)/100;
		}
	 return 0;
	}
function PDV(arr){
	 var res = 0;
	 arr.each(function(v){
		 if(v instanceof Array)
			res+= calc_pdv.apply(this, v);
		});
	 return res;
	}
		
// Потужна функція для вирахування PDV між вузлами
// Може приймати звичайний рядок із описом "шляху" від одного вузла до іншого
// Такий рядок може містити наступні елементи (без знаків < і >) об'єднані знаками арифметики чи/або стандартними функціями:
//  - <T-leng>, <T:leng>, <T~leng>, <T/leng>, <T\leng> - кабель типу T (замість T може бути: FX, TX або T4), замість leng - довжина кабеля (тільки ціле число)
//  - <T(leng)> - кабель типу T (замість T може бути: FX, TX або T4), замість leng - довжина кабеля (підтримує і дробові і цілі числа)
//  - <T> - зміна типу кабеля на тип T (замість T може бути: FX, TX або T4), використовується для обрахунку перетворень на адаптерах між різними типами кабелів, а також використовується для при обрахунку затримки на комутаторі класу2
//  - <Class1>, <C1>, <Class-1>, <C-1>, <Class1()>, <C1()> - комутатор першого класу
//  - <Class2>, <C2>, <Class-2>, <C-2>, <Class2()>, <C2()> - комутатор другого класу, у виразі - із автоматичним визначенням типу кабеля по обидві сторони
//  - <Class2(T-T)>, <Class2(T+T)>, <Class2(T/T)>, <Class2(T\T)> - затримка на комутаторі другого класу при перетворенні між вказаними типами (замість T може бути: FX, TX або T4)
//  - <C2(T-T)>, <C2(T+T)>, <C2(T/T)>, <C2(T\T)> - затримка на комутаторі другого класу при перетворенні між вказаними типами (замість T може бути: FX, TX або T4)
// Приклади вхідного рядка для одного і того ж випадку, тільки записані по різному:
// - FX:130+C-1+T4:105
// - FX/130+Class1+T4/105
// - FX(130)+Class1(FX-T4)+T4(105)
// - FX(130)+C1()+T4-105
function iPDV(str){
	 if(str instanceof Array) return PDV(str);
	 if(!(str instanceof String)&&(typeof str!="string")){
		 console.warn("iPDV: '"+str+"' is bad argument!");
		 return 0;
		}
	 var pT = '', cl = [], res = 0;
	 var w = function(t, q){
		 q = calc_pdv(t, q);
		 if(q>0&&!isNaN(q)){
			 res+=q;
			 return q;
			}else{
			 cl.push(t);
			 return 0;
			}
		}
	 var CLASS1 = C1 = function(q){
		 return w('Class1', q);
		};
	 var CLASS2 = C2 = function(q){
		 return w('Class2', q);
		};
	 var q = function(t, leng){
		 var q = parseInt(leng), w;
		 q = calc_pdv(t, q);
		 if(pT!=''){
			 if(cl.length){
				 cl.each(function(v){
					 var q = calc_pdv(v, pT+"/"+t);
					 if(!isNaN(q)) res+=q;
					});
				 cl = [];
				}
			 w = calc_pdv(pT+"/"+t);
			 if(!isNaN(w)) q+=w;
			}
		 pT = t;
		 if(!isNaN(q)){
			 res+=q;
			 return q;
			}else return 0;
		};
	 var FX = function(leng){
		 return q("FX", leng);
		};
	 var TX = function(leng){
		 return q("TX", leng);
		};
	 var T4 = function(leng){
		 return q("T4", leng);
		};
	 var Cl = function(a){
		 switch(a.replace('-', '')){
			 case 'C1': case 'CLASS1':
				return C1();
			 case 'C2': case 'CLASS2':
				return C2();
			}
		 return 0;
		}
	 
	 str = str.toUpperCase().replace(/["']?(TX|FX|T4)[+-\/\\](TX|FX|T4)["']?/g, '"$1/$2"');
	 str = str.replace(/(TX|FX|T4)[-:\/\\~]+(\d+)/g, '$1($2)');
	 str = str.replace(/([^"()]{1}|^)(TX|FX|T4)([^"()]{1}|$)/g, '$1$2()$3');
	 str = str.replace(/([^"()]{1}|^)(C-?1|CLASS-?1|C-?2|CLASS-?2)([^"()]{0,}?|$)/g, '$1Cl("$2")$3');
	 console.log("iPDV: eval - '"+str+"'"); // For debuging
	 var res2 = 0;
	 try{
		 res2 = eval(str);
		}catch(er){
		 console.warn("iPDV: '"+arguments[0]+"' is have some problem!");
		}
	 return [res, res2, res>(512-iPDV.allowByte), res2>(512-iPDV.allowByte)];
	}
iPDV.allowByte = 0;
	 
// Testing:
 /*alert("PDV(FX(130)-Class1(FX-T4)-T4(105)) = "+PDV([
	 ["FX", 130],
	 ["C1", "FX/T4"],
	 ["FX/T4"],
	 ["T4", 105]
	]));
 console.log("iPDV(FX(130)-Class1(FX-T4)-T4(105)) = "+iPDV("FX:130+C-1+T4:105"));
 console.log("iPDV(FX(130)-Class1(FX-T4)-T4(105)) = "+iPDV("FX/130+Class1+T4/105"));
 console.log("iPDV(FX(130)-Class1(FX-T4)-T4(105)) = "+iPDV("FX(130)+Class1(FX-T4)+T4(105)"));
 console.log("iPDV(FX(130)-Class1(FX-T4)-T4(105)) = "+iPDV("FX(130)+C1()+T4-105"));*/