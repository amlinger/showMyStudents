$(document).ready(function() {
	
	/*
	 * Clean the array of students.
	 */
	fetchedStudents = new Array();

	/*
	 * Students are visualized as groups in tbody:s
	 * inside a table. None of these are marked with
	 * ID or Class, so one has to assume that it is 
	 * the only table configured in this way on the 
	 * page.
	 */
	$.each(
		$("table tbody"),
		function(index, set) {
			
			// Only save the fetched pair if it 
			// contains any students.
			var pair = fetchSet(set);
			if(pair.length !== 0) {
				fetchedStudents.push(pair);
			}
		}
	);

	// Save the list locally to file.
	chrome.storage.local.set({"fetchedStudents" : fetchedStudents });

	/*
	 * Creates a set of students given a html
	 * handle. Two possibilities are found:
	 * 
	 * 1) It is the top row in the tbody, and there 
	 *   are several cells cojoined with the other 
	 *	 rows. Then, user info is in the second cell.
	 * 2) It is one of the followin rows, only 
	 *   containing two cells. Then user info is in
	 *   the first cell.
	 * 
	 */
	function fetchSet(setHTML) {
		
		var pair = new Array();

		$.each(
			$(setHTML).find("tr"),
			function(index, item) {
				
				var tds = $(item).find("td");
				
				if(tds.length === 2) {
					pair.push(createStudent($(tds[0]).text()));
				} else if(tds.length > 2) {
					pair.push(createStudent($(tds[1]).text()));
				}
			}
		);
		return pair;
	}

	/*
	 * Creates student information based on a string 
	 * containing a students name and LiU ID. This 
	 * string is on the form
	 * 
	 * "Name Nameson (namna123)"
	 *               ^        ^
	 * The information returned is based on the marked 
	 * positions, which is why persons with a two-letter
	 * first name cannot be filtered at the moment. 
	 * 
	 * TODO:
	 * Should be fixed with a more robust algorithm.
	 */
	function createStudent(text) {
		
		return text.substring(text.length-9, text.length-1);
	}
});