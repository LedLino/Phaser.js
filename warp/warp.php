<?php
$GLOBALS['warpFrequencies'] = null;
if(function_exists('warpInit')) warpInit();
if( isWarp() ){
	if(function_exists('warpInitAsync')) warpInitAsync();
	if(function_exists($_GET['freq'])) warpRun($_GET['freq']);
}
else {
	if( function_exists( 'warpInitNormal' )) p_normalLoad();
}

function warpFrequencies($allowedFunctions) {
	$GLOBALS['warpFrequencies'] = explode(",", $allowedFunctions);
}

function warpPack($selector=null, $info=""){
	$d = debug_backtrace();
	$selector = $selector!=null?$selector:$d[1]['function'];
	$info=is_array($info)?$info:array("innerHTML"=>$info);
	//foreach ($info as $k => $i) {
	//	if(strpos($i, 'file:')===0) $info[$key] =  
	//}
	$info = json_encode($info);
	echo "<pack id='".$selector."' style='display:block;border:1px dotted gray; poadding:20px; margin-bottom:20px'>".htmlspecialchars($info)."</pack>";
}

function warpJS($funcName){
	echo "<runjs>".htmlspecialchars($funcName)."</runjs>";
}

function warpRun( $funcName = null){
	// if frequencies are not defined, every frequency will be accepted
	$allowed = $GLOBALS['warpFrequencies'] ? $GLOBALS['warpFrequencies'] : array( $funcName );
	if( !function_exists( $funcName ) or !in_array( $funcName, $allowed) ) echo "<span class='xdebug-error'>WARP Error - Frequency not found or not allowed: \"$funcName\"";
	else $funcName();
}

function isWarp() {
	return isset($_GET['freq']);
}

function resToArr($res){
	$f = array();
	while($res) {
		$row = mysql_fetch_assoc($res);
	}
	foreach ($_POST as $key => $value) {
		$f[$key] = $value;
	}
}

?>