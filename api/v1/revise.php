<?php
    include("db.php");
    $id = $_GET["id"];
    $name = $_GET["name"];
    $price = $_GET["price"];
    $num = $_GET["num"];
   
    $sql = "update user set name='$name', price=$price, num=$num where Id=$id";
    if(mysql_query($sql)){
		echo json_encode(array('res_code' => 1, 'res_message' => '修改成功'));
	}else{
		echo json_encode(array('res_code' => 0, 'res_message' => '修改失败'));
	}
?>