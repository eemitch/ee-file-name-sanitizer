<?php // This file is accessed via AJAX

$eeRegEx_PHP = '/[^\\w-.~\\x00A0-\\xD7FF\\xF900-\\xFDCF\\xFDF0-\\xFFEF]+/';

$eeFileName = $_POST['eeFileName'];
$eeExtension = $_POST['eeExtension'];
	
// Make sure the file name is acceptable
function eeSFL_SanitizeFileName($eeFileName) {
	
	// Make sure file has an extension
	$eePathParts = pathinfo($eeFileName);
	$eeFileNameOnly = str_replace('.', '-', $eePathParts['filename']); // Get rid of dots
	$eeExtension = strtolower($eePathParts['extension']);
	
	// Replace These: eeSFL_RegEx_Replace
	$eeFileNameOnly = preg_replace($this->eeRegEx_Replace, '-', $eeFileNameOnly);
	
	// Remove These: eeSFL_RegEx_Remove
	$eeFileNameOnly = preg_replace($this->eeRegEx_Remove, '', $eeFileNameOnly);
	
	if($eeFileNameOnly) {
		$eeNewFileName = $eeFileNameOnly . '.' . $eeExtension;
		return $eeNewFileName;
	}
	
	return FALSE;
}
	
?>