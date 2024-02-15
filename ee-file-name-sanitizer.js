// Simple File List Pro - Copyright 2024
// Author: Mitchell Bennis | support@simplefilelist.com | https://simplefilelist.com
// License: EULA | https://simplefilelist.com/end-user-license-agreement/
// All changes to, modifications to, or re-uses of this script are prohibited without prior consent.

// Remove these chars from file names
const eeSFL_RegEx_Remove = /[^\w-.~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
const eeSFL_RegEx_Replace = /[.\s]+/g;

let eeSFL_OriginalFileNameOnly = ''; // Holder for original file name
let eeSFL_OriginalFileExtension = ''; // Holder for original file extension

// File Name Sanitizer
function eeSFL_SanitizeFileName(eeFileName) {
	
	console.log('SFL - Sanitizing: ' + eeFileName);
	
	let eeNewFileNameOnly = eeSFL_GetFileNameWithoutExtension(eeFileName);
	eeNewFileNameOnly = eeNewFileNameOnly.replace(eeSFL_RegEx_Replace, '-');
	eeSanitized = eeNewFileNameOnly.replace(eeSFL_RegEx_Remove, '');
	
	return eeSanitized + '.' + eeSFL_OriginalFileExtension; // Reattach original extension
}



// Dynamically remove/replace special chars within the new file name input
function eeSFL_SanitizeInputDynamically() {
	
	console.log('SFL - eeSFL_SanitizeInputDynamically()');

	const eeInput = document.getElementById('eeSFL_FileNameNew');
	
	eeInput.addEventListener('paste', function(event) {
		
		// Access the pasted data
		var eePastedData = event.clipboardData || window.clipboardData;
		var eePastedText = eePastedData.getData('Text'); // Use 'text/plain' for modern browsers
		console.log('SFL ------ Data Pasted: ' + eePastedText);
		
		// Set Originals
		eeSFL_OriginalFileNameOnly = eeSFL_GetFileNameWithoutExtension(eePastedText);
		eeSFL_OriginalFileExtension = eeSFL_GetFileExtension(eePastedText);

	});

		
	eeInput.addEventListener('input', function() {
		
		// Save the current cursor position
		const eeCursorPosition = eeInput.selectionStart;
		
		if(this.value && eeSFL_OriginalFileNameOnly && eeSFL_OriginalFileExtension) {
		
			const eeOriginal = eeSFL_OriginalFileNameOnly + '.' + eeSFL_OriginalFileExtension;
			
			let eeNewExtension = eeSFL_GetFileExtension(this.value);
			let eeNewFileNameOnly = eeSFL_GetFileNameWithoutExtension(this.value);
			console.log('SFL - Editing: ' + eeNewFileNameOnly + '.' + eeNewExtension);
			
			let eeDotCount = (this.value.match(/\./g) || []).length;
			
			// If either the name or extension is missing, reset to the original
			if(eeNewFileNameOnly.length < 1 || eeNewExtension.length < 1) { 
				console.log('SFL - RESETTING TO ' + eeSFL_OriginalFileNameOnly + '.' + eeSFL_OriginalFileExtension);
				this.value = eeSFL_OriginalFileNameOnly + '.' + eeSFL_OriginalFileExtension;
			} // Set in Open Edit Modal
	
			// Regex
			eeNewFileNameOnly = eeNewFileNameOnly.replace(eeSFL_RegEx_Replace, '-');
			eeNewFileNameOnly = eeNewFileNameOnly.replace(eeSFL_RegEx_Remove, '');
	
			if (eeSFL_OriginalFileExtension.length > 2) { // It's a file - Set when edit modal is opened
				
				if(eeDotCount > 0) { // Prevent removing the extension dot
					
					eeNewFile = eeNewFileNameOnly + '.' + eeSFL_OriginalFileExtension;
					
					console.log('SFL - This is a File: ' + eeNewFile);
					
					this.value = eeNewFile;
				
				} else {
			 		console.log('SFL - Removing the file extension is not allowed');
				}
	
			} else { // It's a folder, so no extension
				
				console.log('SFL - This is a Folder: ' + eeNewFileNameOnly);
				
				if(eeDotCount >= 1) {
					console.log('SFL - Adding dots is not allowed');	
				}
			}
	
			// Restore the cursor position
			eeInput.setSelectionRange(eeCursorPosition, eeCursorPosition);
		} else {
			console.log('SFL - No Input to Sanitize');	
		}
	});
}



// Function to attach the blur event listener to the input
function eeSFL_AttachBlurEventToInput() {
	
	console.log('SFL - eeSFL_AttachBlurEventToInput()');
	
	const eeInput = document.getElementById('eeSFL_FileNameNew'); // Adjust the ID as necessary
	
	if(eeInput.value) {
		
		eeSFL_OriginalFileExtension = eeSFL_GetFileExtension(eeInput.value);
		
		console.log('SFL - eeSFL_OriginalFileExtension = ' + eeSFL_OriginalFileExtension);
	
		eeSFL_OriginalFileNameOnly = eeSFL_GetFileNameWithoutExtension(eeInput.value); // Store the original file name when the page loads or when the input is first populated
	}
	
	eeInput.addEventListener('blur', function() {
		
		if(eeSFL_OriginalFileNameOnly && eeSFL_OriginalFileExtension) {
			// If the file name or whole input is empty, repopulate it with the original name
			if (this.value.trim() === '' || this.value[0] === '.') {
				this.value = eeSFL_OriginalFileNameOnly + '.' + eeSFL_OriginalFileExtension;
			}
		}
		console.log('SFL - Tabbing Out');
	});
}



// Get the file's extension, if there is one.
function eeSFL_GetFileExtension(eeFileName) {
	
	console.log('SFL - eeSFL_GetFileExtension()');
	
	// Split the filename into parts by the dot character
	const eeParts = eeFileName.split('.');
	
	// Get just the extension
	eeExtension = eeParts.length > 1 ? eeParts.pop() : '';
	
	// Return the last part (extension) if there's more than one part, otherwise return an empty string
	console.log('SFL - eeExtension = ' + eeExtension);
	
	
	return eeExtension;
}



// Get the file name only
function eeSFL_GetFileNameWithoutExtension(eeFileName) {
	
	console.log('SFL - eeSFL_GetFileNameWithoutExtension()');
	
	if(eeFileName) {
		
		// Split the filename into parts by the dot character
		const eeParts = eeFileName.split('.');
		
		// Remove the last part (extension) if there's more than one part
		if (eeParts.length > 1) {
			eeParts.pop();
		}
		
		let eeFileNameOnly = eeParts.join('.');
		
		console.log('SFL - eeFileNameOnly = ' + eeFileNameOnly);
		
		// Rejoin the remaining parts. This handles filenames with multiple dots correctly.
		return eeFileNameOnly;
	
	}
	
	console.log('SFL - eeFileName is EMPTY!');
	
	return false;
}