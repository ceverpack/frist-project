<?php
    include("db.php");

    $id = $_GET["id"];

    $selSql = "delete from user where Id=$id";
    
    $res = mysql_query($selSql);

    $arr = array();

    $resArr = array(
		'res_code' => 1,
        'res_message' => '删除成功'
        
    );
    echo json_encode($resArr);
?>