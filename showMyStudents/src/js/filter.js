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
			members.push({
				approved : false, // Assuming false;
				students : studentArray[i]
			});
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

					var email 		= $(item).find("td:nth-child(6)").text();
					var approved	= $(item).find("td:nth-child(9)").text();
					var isIn 		= false;

					for(var i=0, len=members.length; i<len; i++) {
						if($.inArray(email, (members[i]).students) !== -1) {
							
							if(approved === 'Godkänd')
								members[i].approved = true;

							isIn = true;
							break;
						}
					}

					if(!isIn)
						$(item).hide();

				} else 
					$(item).show();
			}
		);
		fadeApprovedPairs();
		return true;
	}

	function fadeApprovedPairs() {

		var iterable = $("#viewDIV .table tr.ng-scope");
		
		if(iterable.length === 0) return false;


		$.each(
			iterable, 
			function(index, item) {


				if(active) {

					var isIn 	= false;
					var email 	= $(item).find("td:nth-child(6)").text();

					for(var i=0, len=members.length; i<len; i++) {
						if($.inArray(email, (members[i]).students) !== -1) {
							var others = " (med";

							for(var j=0, len=members[i].students.length; j<len; j++) {
								var name = members[i].students[j];
								if(name !== email)
									others += " " + name;
							}

							others = others.trim(",");
							others += ")";


							if(members[i].approved) {
								$(item).css({
									opacity 		: ".3"
								}).find("td:nth-child(9)").text("Godkänd " + others);
							}
							break;
						}
					}

				} else {
					$(item).css({ 
						opacity 		: "1",
						backgroundColor : "#none"
					});
				}	
			}
		);
	}

	chrome.storage.local.get("ACTIVE", function(result) {
		active = result["ACTIVE"];
		intervalSearch();
	});

	function intervalSearch() {


		var intervalID = setInterval(function() {

			
			//if($('h2.ng-binding').html().indexOf("Labb") === -1){
			//	console.log("INGEN LABBSIDA!" + $('h2.ng-binding').text());
			//}

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
				
				//if(groupStudents) {
					fadeApprovedPairs();
				//}
			}
		}, 200);
	}
});