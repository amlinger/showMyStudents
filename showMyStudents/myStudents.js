/*
 * This list trumphs the list of students fetched from 
 * WebReg, and could be used for listing specific students
 * not registered in any lab groups.
 */
var myStudents = [
	// Here you might add students that should be visible for your filter option.
	// Students should be added as sublists, representing the labgroups. If
	// a student should be alone in a group, he/she should still be added in a 
	// sublist: 
	// ["antam167", "abcde123"],
	// ["homer001"]
	// etc.
];

/*
 * The following list contains the students fetched 
 * from WebReg, and is assumed to not be updated in
 * between page reloads.
 */
var fetchedStudents;
chrome.storage.local.get("fetchedStudents", function(result) {
	fetchedStudents = result["fetchedStudents"];
});