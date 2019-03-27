window.onload = function(){
	var userInput = document.querySelector("#inputUsername"),
		pwdInput = document.querySelector("#inputPassword"),
		btn = document.querySelector("#btn"),
		remember = document.querySelector("#remember");
	// 注册功能
	btn.onclick = function() {

		var username = userInput.value;
		var password = pwdInput.value;
		// 提交服务器
		tools.ajaxPost("../api/v1/login.php", { username, password }, function(res){
			if(res.res_code === 1){
				// 保存用户登录信息cookie
				// 10天免登录
				var option = remember.checked ? {"path" : "/", "expires" : 10} : {"path" : "/"};
				tools.cookie("username", username, option);

				if(confirm(res.res_message + "，即将跳转首页")){
					location.href = "../index.html";
				}
			}else{
				alert(res.res_message);
			}
		});
		// 阻止默认提交
		return false;
	}
}