var tbody = document.querySelector("#tbody");
    total = document.querySelector("#total"),
    data = localStorage.getItem("car");
    data = JSON.parse(data);
//分页
    var pageIndex = 1,
    totalPage;
    
    var html = "";
    var totalnum = 0;
    data.forEach(function(item){
        html += `<tr data-id="${item.id}">
                      <td><input type="checkbox"></td>
                      <td><span>${item.name}</span><input type="text" class="input"></td>
                      <td><span>${item.price}</span><input type="text" class="input"></td>
                      <td><span>${item.num}</span><input type="text" class="input"></td>
                      <td>
                          <button class="btn btn-primary btn-xs btn-edit">编辑</button>
                          <button class="btn btn-danger btn-xs btn-del">删除</button>
                          <button class="btn btn-success btn-xs btn-ok">确定</button>
                          <button class="btn btn-warning btn-xs btn-cancel">取消</button>
                      </td>
                  </tr>`;
    })
    tbody.innerHTML=html; 

    // 表格编辑
    tbody.onclick = function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var tr = target.parentNode.parentNode;
        //删除按钮事件
        if(target.className.includes("btn-del")){
            // 删除当前这一行
            target.onclick = function(){
                this.parentNode.parentNode.remove();
            }
        }

        //编辑按钮事件
        if(target.className.includes("btn-edit")){
                tr.classList.add("edit");
                var span=Array.from(tr.querySelectorAll("span"));
                span.forEach(function(span){
                span.nextElementSibling.value=span.innerHTML;
            })
        }

        //确定按钮事件
        if(target.className.includes("btn-ok")){
           target.onclick = function(){
            var tr = this.parentNode.parentNode;
            var input = tr.querySelectorAll(".input");
            var trspan = this.parentNode.parentNode;
            var span = trspan.querySelectorAll(span);
            
           }
        }
    }