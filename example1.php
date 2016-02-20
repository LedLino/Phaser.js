<?php
// Include this file for Phaser to work
require "warp/warp.php";

var_dump($_POST);



// Reserved function name. Optional to include.
// This funtion will be called whenever this page is loaded through the address bar
function warpInitNormal() {
	echo "Ooops, an error ocurred: This page can't be loaded directly";
}




// Reserved function name. Optional to include.
// This funtion will be called whenever this page is loaded through Phaser async command
function warpInitWarp() {
}




// this function is called by Phaser's ASYNC command with FETCH argument defined
// as this function name
function myAsyncPHP1() {
	// content rendered by this PHP file will have no effect on the HTML, unless
	// you specifically use commands to update the HTML
	echo "This echo will have no effect on the content fetched.";


	// typing javascript directly here will have an effect on the HTML
	warpJS("warp.obj( '#ex1' ).set({ html:'This text was updated through JavaScript typed directly in the PHP file' });");
}




// this function is called by Phaser's ASYNC command with FETCH argument defined
// as this function name
function myAsyncPHP2() {
	// an other way to modify the html is creating a buffer of changes
	// and then calling Phaser's UPDATE command to aplly them

	// fetch some content by whathever means you'd like.
	$field1 = $_POST['field1'];
	ob_start();
	?>
		<div>
			This content was loaded <b>dynamically</b>. You typed: <i><?php echo $field1;?></i> and <i><?php echo $_POST['field2'];?></i>.
		</div>
	<?php
	$text = ob_get_contents();
	ob_clean();

	// create an array of changes
	$changes = array(
		'color' => 'magenta',
		'html' => $text,
		'border' => '1px doted gray'
	);

	// create the buffer of changes to the element #ex2
	warpPack("#ex2",$changes);
	// calls the update command that gets the changes in the buffer and applies to the element
	warpJS("warp.obj('#ex2').update();");
}




// this function is called by Phaser's ASYNC command with FETCH argument defined
// as this function name
function myAsyncPHP3() {
	$changes = array();

	$changes['html'] = "Updated all elements with the same css class";
	$changes['text-decoration:'] = "underline";

	// create the buffer of changes for all elements of class 'ex3'
	warpPack(".ex3",$changes);
	// the update of this elements is beeing done in the ASYNC command itself,
	// in the RUN parameter
}

?>