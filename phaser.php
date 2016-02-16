<?php
//setlocale (LC_ALL, 'pt_BR','ptb');
//mysql_query('SET lc_time_names = "pt_BR"');
//header('Content-Type: text/html; charset=UTF-8');

//var_dump($_SERVER);
//if( isset( $_SERVER['HTTP_X_REQUESTED_WITH'] )) echo  "<script>console.log('REQUESTED WITH: ".$_SERVER['HTTP_X_REQUESTED_WITH']."')</script>";
//else echo "<script>console.log('REQUESTED WITH NOT PRESENT')</script>";

//if( isset( $_GET['phasing'] ) && $_GET['phasing']==1 && function_exists( 'phasingLoad' )) phasingLoad();

$GLOBALS['p_pageBuilder'] = array('basePage'=>'','pagePieces'=>array(),'javascripts'=>array(),'hiddenTokens'=>array());

if(function_exists('p_preLoad')) p_preLoad();
if( p_is_async() ){
	if(function_exists('p_asycLoad')) p_asyncLoad();
	if(function_exists($_GET['phase'])) p_run($_GET['phase']);
}
else {
	if( function_exists( 'p_normalLoad' )) p_normalLoad();
}

function p_setBasePage($file){
	$GLOBALS['p_pageBuilder']['basePage']=$file;
}

function p_addPagePiece($pieceName,$pieceContent,$pieceType){
	$GLOBALS['p_pageBuilder']['pagePieces'][$pieceName]=array('type'=>$pieceType,'content'=>$pieceContent);
}

function p_addJavascript($file){
	array_push($GLOBALS['p_pageBuilder']['javascripts'],$file);
}

function p_hiddenToken($tokenName,$tokenValue){
	$GLOBALS['p_pageBuilder']['hiddenTokens'][$tokenName]=$tokenValue;
}

function p_buildPage(){
	//	VERIFICAR SE O ARQUIVO EXISTE ANTES DE INCLUIR PARA NAO DAR PROBLEMA NO phasing.php
	function p_pagePiece($name){
		if(isset($GLOBALS['p_pageBuilder']['pagePieces'][$name])){
			$p = $GLOBALS['p_pageBuilder']['pagePieces'][$name];
			$c = $p['content'];
			switch ($p['type']) {
				case 'require':	eval('require "$c";'); break;
				case 'include':	eval('include "$c";'); break;
				case 'variable': return $c; break;
				case 'function': if(function_exists($c)) return $c(); break;
				default: echo $c;
			}
		}
	}
	eval("require '".$GLOBALS['p_pageBuilder']['basePage']."';");
	$h = $GLOBALS['p_pageBuilder']['hiddenTokens'];
	if(!empty($h)) {
		echo "<span id='phaser-hiddenTokens'>";
		foreach ($GLOBALS['p_pageBuilder']['hiddenTokens'] as $ht_name => $ht_val) {
			echo "<input type='hidden' name='$ht_name' value='$ht_val'/>";
		}
		echo "</span>";
	}
	foreach ($GLOBALS['p_pageBuilder']['javascripts'] as $js) {
		echo "<script type='text/javascript' src='$js'></script>";
	}
}

function p_makeCache($selector=null, $info=""){
	$d = debug_backtrace();
	$selector = $selector!=null?$selector:$d[1]['function'];
	$info=is_array($info)?$info:array("innerHTML"=>$info);
	//foreach ($info as $k => $i) {
	//	if(strpos($i, 'file:')===0) $info[$key] =  
	//}
	$info = json_encode($info);
	echo "<cache id='".$selector."' style='display:block;border:1px solid black;'>".htmlspecialchars($info)."</cache>";
}

function p_getFileContents($file) {

}

function p_run( $funcName = null, $allowedFunctions = null){
	$allowed = $allowedFunctions ? explode(",", $allowedFunctions) : array( $funcName ); // se não for setado as funções permitidas, a permitida vai ser a propira passada.
	if( !function_exists( $funcName ) or !in_array( $funcName, $allowed) ) echo "<span class='xdebug-error'>Phasing Error - run($funcName): Can't run function</span>";
	else $funcName();
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

function p_runJS($funcName){
	echo "<runjs>".htmlspecialchars($funcName)."</runjs>";
}


function p_is_async() {
	return isset($_GET['phase']);
}


//-------------------OLD
function getGET($string){
	return isset($_GET[$string]) ? $_GET[$string] : null;
}
function NUMbetween($val,$min,$max,$divider = null) {
	$r = true;
	$val = $divider ? explode($divider, $val) : array( $val );
	$min = $divider ? explode($divider, $min) : array( $min );
	$max = $divider ? explode($divider, $max) : array( $max );
	if( count( $val ) != count( $min ) ) $r = null;
	else for( $i = 0; $i < count( $val ); $i++ ){
		$r = intval( $val[i] ) > intval( $min[i] ) and intval( $val[i] ) < intval( $max[i] ) ? $r : false;
	}		
	return $r;
}
function DMYbetween( $min, $med, $max ){
	for( $i = 0; $i < strlen( $min ); $i++ ) {
		$s = substr( $min, $i, 1 );
		if( !is_numeric( $s ) ) $sep = $s;
	}
	if( !isset( $sep ) ) {
		//var_dump("Erro na Função 'DMYentre': Separador de data não encontrado");
		return "Erro na Função 'DMYbetween': Separador de data não encontrado";
	}

	$args = func_get_args();
	for( $i = 0; $i < 3; $i++ ){
		$args[$i] = $args[$i] == "now" ? date( "d".$sep."m".$sep."Y" ) : $args[$i];
		$args[$i] = explode( $sep, $args[$i] );
		foreach ( $args[$i] as $a ) $a = intval( $a );
	}
	$min = $args[0];
	$med = $args[1];
	$max = $args[2];
	if( count( $min ) == 3 and count( $med ) == 3 and count( $max ) == 3) {
		if( $min[2] > $med[2] or $med[2] > $max[2] ) return false;
		else if( $min[2] < $med[2] and $med[2] < $max[2] ) return true;
		else {
			if( $min[1] > $med[1] or $med[1] > $max[1] ) return false;
			else if( $min[1] < $med[1] and $med[1] < $max[1] ) return true;
			else {
				if( $min[0] > $med[0] or $med[0] > $max[0] ) return false;
				else return true;
			}
		}
	}
	//var_dump("Erro na Função 'DMYentre': datas devem estar no formato D M Y");
	return "data incorreta";
}
function key_map( $testArray, $ruleArray ) {
	if( gettype( $ruleArray ) == "string" ) $ruleArray = array( $ruleArray );
	$response = array();
	foreach ( $ruleArray as $ruleKeys => $ruleTest ) {
		$keys = explode( ",", $ruleKeys );
		foreach ($keys as $key) {
			if(!isset( $testArray[$key])) $response[$key] = null;
			else if($ruleTest == 'notEmpty') $response[$key] = strlen($testArray[$key]) !== 0;
			else {
				$value = $testArray[$key];
				if(strpos($ruleTest, "return ") === 0){
					if(substr($ruleTest, -1, 1) !== ";") $ruleTest.=";";
					$response[$key] = eval( $ruleTest );
				} 
				else{
					$testParts = explode(",",$ruleTest);
					if(function_exists($testParts[0])) $response[$key] = $testParts[0]($value,$key,array_shift($testParts));
					else $response[$key] = "error: incorrect test syntax";
				}
			}
		}
	}
	return $response;
}
function datedFileName($fileArray,$prefix = "",$sufix = ""){
	$fileName = $fileArray['name'];
	$fileExt = substr($fileName, strripos($fileName, "."));
	$personName = substr( preg_replace("/[^A-Za-z0-9 ]/", '', $sufix), 0, 8);
	$fileNewName = $prefix.date('ymd_Hi')."_".$personName.$fileExt;
	$fileTmpPath = $fileArray['tmp_name'];
	$divider = strpos($fileTmpPath, "/") !== false ? "/" : "\\";
	$fileTmpName = substr($fileTmpPath, strrpos($fileTmpPath, $divider)+1);
	$tmpPath = str_replace($fileTmpName, "", $fileTmpPath);
	$fileNewPath = $tmpPath.$fileNewName;
	return $fileNewPath;
}
/*
echo"MYCACHE PARAMETERS:\nGET:-----------\n";
print_r($_GET);
echo"\nPOST:-----------\n";
print_r($_POST);
echo"\nFILES:-----------\n";
print_r($_FILES);
echo"\nEND OF MYCACHE PARAMETERS\n-----------\n";
*/
?>