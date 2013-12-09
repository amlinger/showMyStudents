




var members = new Array();

$(document).ready(function() {

	var active = false;

	chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
		if(request.message === "update") {
			intervalSearch();
		} 
	});


	chrome.storage.onChanged.addListener(function(changes, areaName) {
		console.log(changes);
		chrome.storage.local.get("ACTIVE", function(result) {
			active = result["ACTIVE"];
			filterStudents();
		});
	});

	/*
	 * Searching through the chosen member students
	 */
	function findMemberStudents(studentArray) {

		// Clearing the members array of previously added students.
		members = new Array();

		// Nothing to do if no students are in the array.
		if(studentArray.length === 0) {
			return false;
		}

		/*
		 * Iterating over students set in studentArray, and adding
		 * them as members to be shown. len is cached in the 
		 * for-loop for faster iteration.
		 */
		for(var i=0,len=studentArray.length; i<len; i++) {
			var set = studentArray[i];
			
			for(var j=0; set[j] !== undefined; j++) {
				members.push(set[j]);
				members.push(set[j] + "@student.liu.se");
			}
		}

		return true;
	}

	function filterStudents() {

		var iterable = $("#viewDIV .table tr.ng-scope");
		
		if(iterable.length === 0) return false;


		$.each(
			iterable, 
			function(index, item) {
				if(active) {

					var email =  $(item).find("td:nth-child(6)").text();

					if($.inArray(email, members) === -1) {
						$(item).hide();
					}
				} else {
					$(item).show();
				}

			}
		);

		return true;
	}
	chrome.storage.local.get("ACTIVE", function(result) {
		active = result["ACTIVE"];
		intervalSearch();
	});

	function intervalSearch() {
		var intervalID = setInterval(function() {
			if(!findMemberStudents(myStudents)) {
				if(fetchedStudents === undefined) {
					clearInterval(intervalID);
					alert("You haven't chosen any students. Either, add them to myStudents.json manually, or visit the course's WebReg page and view your students.");
				} else {
					findMemberStudents(fetchedStudents);
					if(filterStudents()) {
						clearInterval(intervalID);
					}
				}
			} else {
				if(filterStudents()) {
					clearInterval(intervalID);
				}
			}
		}, 200);
	}
});