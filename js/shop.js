
var inputname = document.querySelector("#inputname"),
	inputprice = document.querySelector("#inputprice"),
	inputnum = document.querySelector("#inputnum"),
	btn = document.querySelector("#btn"),
	closeBtn = document.querySelector("#close-btn"),
	tbody = document.querySelector("#tbody"),
	pagination = document.querySelector("#pagination"),
	nextPage = document.querySelector("#nextPage");

var pageIndex = 1,
	totalPage;


// 商品录入

btn.onclick = function(){
	var name = inputname.value,
		price = inputprice.value,
		num = inputnum.value;

	// 向服务器发送请求，添加商品
	tools.ajaxGet("api/v1/add.php", {name, price, num}, function(res) {
		if(res.res_code === 1){
			alert(res.res_message);
			// 输入框清空
			inputname.value = inputprice.value = inputnum.value = "";
			// 关闭模态框
			$('#addModal').modal('hide');
			// 重新请求当前页的数据
			getShop();
		}
	})
}


// 商品查询
getShop();
function getShop () {
	tools.ajaxGet("api/v1/get.php", {pageIndex}, function(res){
		console.log(res)
		if(res.res_code === 1){
			var {data} = res.res_body;
			// 修改全局变量pageIndex
			pageIndex = res.res_body.pageIndex;
			totalPage = res.res_body.totalPage;
			// var data = res.res_body.data;
			var html = "";
/* 			1  0-3  1-4   (pageIndex-1)*4+ i+1
			2  0-3  5-8 */
			data.forEach(function (shop, i) {
				html += `<tr data-id="${shop.Id}">
			  				<td>${(pageIndex-1)*4+ i+1}</td>
			  				<td><span>${shop.name}</span><input type="text" class="input"></td>
			  				<td><span>${shop.price}</span><input type="text class="input"></td>
			  				<td><span>${shop.num}</span><input type="text class="input"></td>
							  <td>
							  	<button type="button" class="btn btn-info btn-xs shopcar">添加到购物车</button>
			  					<button class="btn btn-primary btn-xs btn-edit">编辑</button>
			  					<button class="btn btn-danger btn-xs btn-del">删除</button>
			  					<button class="btn btn-success btn-xs btn-ok">确定</button>
			  					<button class="btn btn-warning btn-xs btn-cancel">取消</button>
			  				</td>
			  			</tr>`;
			})

			tbody.innerHTML = html;
			
			// 先把上一次的分页的li删除
			// Array.from(pagination.querySelectorAll(".pageLi")).forEach(function(li) {
			// 	li.remove();
			// })
			
			// 渲染分页
			for(var i = 1; i <= totalPage; i++){
				var li = document.createElement("li");
				li.innerHTML = '<a class="page" href="javascript:;">'+i+'</a>';
				li.className = i === pageIndex ? "active pageLi" : "pageLi";
				pagination.insertBefore(li, nextPage);
			}


		}
	})
}

// 分页
pagination.onclick = function (e) {
	e = e || window.event;
	var target = e.target || e.srcElement;
	switch(target.className){
		case "page" : 
			// 点击了页码数
			pageIndex = Number(target.innerHTML);
			getShop();
		break;
		case "prev" : 
		// 如果减完之后小于1，那么让他等于1，并且什么都不做
		// 否则才去调getShop
			if(--pageIndex < 1){
				pageIndex = 1;
				return;
			}
			getShop();
		break;
		case "next":
		if(++pageIndex > totalPage){
			pageIndex = totalPage;
			return;
		}
		getShop();
			
	}
}

// 表格编辑
tbody.onclick = function (e) {
	e = e || window.event;
	var target = e.target || e.srcElement;
	var tr = target.parentNode.parentNode;
	//删除按钮事件
	if(target.className.includes("btn-del")){
		// 带上当前数据的id发送服务器
		//var del = document.querySelector(".btn-del");
	    var id = tr.getAttribute("data-id");
		target.onclick = function(){
			tools.ajaxGet("api/v1/del.php", {id}, function(res){
				console.log(res);
				if(res.res_code === 1){
					getShop()
				}else{
					alert("删除失败");
				}
			})
		}
	}

	//编辑按钮事件
	if(target.className.includes("btn-edit")){
			tr.classList.add("edit");
			var span=Array.from(tr.querySelectorAll("span"));
			console.log(span);
			span.forEach(function(span){
			span.nextElementSibling.value=span.innerHTML;
		})
	}
	//确定按钮事件
	if(target.className.includes("btn-ok")){
		tr.classList.remove("edit");
		var input=Array.from(tr.querySelectorAll("input"));
		console.log(input);
		//修改数据库信息
		var id=tr.getAttribute("data-id"),
         	name=input[0].value,
        	price=input[1].value,
			num=input[2].value;
			console.log(name);
			console.log(price);
			console.log(num);
		tools.ajaxGet("api/v1/revise.php", {id,name,price,num}, function(res){
			if(res.res_code===1){
				if(confirm("确定修改吗")){
				getShop();
				}
            }else{
                alert("修改失败");
            }
		})
	}

	//取消按钮事件
	if(target.className.includes("btn-cancel")){
		tr.classList.remove("edit");
	}
	//存cookie
	if(target.className.includes("shopcar")){
		//获取span元素
		var span=Array.from(tr.querySelectorAll("span"));
		// 获取当前商品在服务器里面的Id
        var id=tr.getAttribute("data-id");
        //将数据用对象进行封装，方便存cookie
        var name=span[0].innerHTML;
        var price=span[1].innerHTML;
        var obj={
            "id":id,
            "name":name,
            "price":price,
            "num":1
		};
		//初始查询
		var car = localStorage.getItem("car");
		//如果已经有car的cookie
		if(car){
			car = JSON.parse(car);
			var i = 0;
			if(car.some(function(item,index){
				i=index;
				return item.id==id;
			})){
				car[i].num++;
			}else{
				car.push(obj);
			}
		}else{
			car=[obj];
		}
		localStorage.setItem("car",JSON.stringify(car));
	}
}
