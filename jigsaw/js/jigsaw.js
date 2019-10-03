function shuffle(arr) { //随机排列数组
	var len = arr.length;
	for(var i = 0; i < len - 1; i++){
		var idx = Math.floor(Math.random() * (len - i));
		var temp = arr[idx];
		arr[idx] = arr[len - i - 1];
		arr[len - i - 1] = temp;
	}
	return arr;
}

function isValid(arr) { //判断数列的逆序是否为偶数  偶数=>有解
	var count = 0;
	var len = arr.length;
	for(var i = 0; i < len; i++) {
		for(var j = i + 1; j < len; j++) {
			if(arr[j] < arr[i]) {
				count++;
			}
		}
	}
	return count % 2 === 0;
}

window.onload = function() {
	const jigsawW = Math.min((window.innerWidth/4 - 2.5)|0, 194);
	jigsawview.style.height = (4* jigsawW + 2) + 'px';
	jigsawview.style.width = (4* jigsawW + 2) + 'px';
	Controller.style.left = (2* jigsawW - 75) + 'px';
	Controller.style.top = (2* jigsawW - 75) + 'px';
	Controller.style.display = "none";
	let detime = 0;
	let imgpath = "<img src='images" + ~~(Math.random() * 5) + "/img";
	const pstArr = (new Array(16).fill(0)).map((i,j)=>(Array(2).join(0) + j.toString(4)).slice(-2));
	const last = window.jigsaw33;

	function jigsawInit(i){//初始化拼图位置和宽高
		const thisJigsaw = window['jigsaw' + i];
		thisJigsaw.style.height = (jigsawW - 2) + 'px';
		thisJigsaw.style.width = (jigsawW - 2) + 'px';
		thisJigsaw['pro'] = new Proxy(thisJigsaw,{
			set(target, key, value, proxy){
				if(key === 'pst'){
					target.style.top = value[0] * jigsawW + 'px';
					target.style.left = value[1] * jigsawW + 'px';
				}
				return Reflect.set(target, key, value, proxy); 
			} 
		});
		thisJigsaw.pro.pst = i;
		thisJigsaw.innerHTML = imgpath + i + ".jpg'/>";
		return thisJigsaw;
	}
	
	function isWin() {//判断拼图名与位置是否全等
		for(let i of pstArr) {
			if(window['jigsaw' + i].pst !== i) return;
		}
		Controller.style.display = "block";
		Controller.innerHTML = `<p>Nice! ${new Date()-r}ms</p><button onclick='history.go(0)'>restart</button>`;
	}

	for(let i of pstArr) {
		jigsawInit(i).onclick = function() {
			if(detime === 1) {
				Controller.style.display = "block";
			}
			if([10,-10,1,-1].indexOf(last.pst - this.pst) !== -1){
				detime++;
				[this.pro.pst, last.pro.pst] = [last.pst, this.pst];
                window.r&&isWin();//时间戳存在就判断
			}else if(i !== '33') { //无法换位
				this.style.opacity = 0.3;
				last.style.opacity = 1;
				const that = this;
				setTimeout(function() {
					that.style.opacity = 1;
					last.style.opacity = 0.2;
				}, 250);
			}
		}
	}

	btn.onclick = function() {
		let newPstArr = [...pstArr]; //获取拷贝
		newPstArr.pop(); //弹出最后一个
		do {
			newPstArr = shuffle(newPstArr);
		}
		while(!isValid(newPstArr)); //直到它有解
		newPstArr.push('33'); //插入最后一个
		for(let [i,v] of Object.entries(newPstArr)){
			let thisJigsaw = window['jigsaw' + pstArr[i]];
			thisJigsaw.style.top = 0 + 'px';
			thisJigsaw.style.left = 0 + 'px';
			setTimeout(function() {
				thisJigsaw.pro.pst = v;
			}, 500);
		}
		Controller.style.display = "none";
        window.r = new Date();
	}
}