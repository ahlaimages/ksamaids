// JavaScript Documentfunction en_to_bn_number_conversion(en_number) {
	var bn_number = '';

	for (var i = 0; i < en_number.length; i++) {

		if (en_number[i] == '0') bn_number = bn_number + "٠";

		if (en_number[i] == '1') bn_number = bn_number + "١";

		if (en_number[i] == '2') bn_number = bn_number + "٢";

		if (en_number[i] == '3') bn_number = bn_number + "٣";

		if (en_number[i] == '4') bn_number = bn_number + "٤";

		if (en_number[i] == '5') bn_number = bn_number + "٥";

		if (en_number[i] == '6') bn_number = bn_number + "٦";

		if (en_number[i] == '7') bn_number = bn_number + "٧";

		if (en_number[i] == '8') bn_number = bn_number + "٨";

		if (en_number[i] == '9') bn_number = bn_number + "٩";

		if (en_number[i] == ':') bn_number = bn_number + ":";
		
		if (en_number[i] == 'am') bn_number = bn_number + "ص";

	}

	return bn_number; 
}

// get current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error);
    } else {
        console.log("Geo location is not supported by this browser");
    }
}

function error(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
		var message = "User denied the request for Geolocation."
		  break;
		  case error.POSITION_UNAVAILABLE:
		  var message = "Location information is unavailable."
		  break;
		  case error.TIMEOUT:
		  var message = "The request to get user location timed out."
		  break;
		case error.UNKNOWN_ERROR:
		var message = "An unknown error occurred."
		break;
	}
	// console.log(message);
	document.getElementById("notification_message").innerHTML = "<strong>Warning!</strong> "+message+" Time showing according to <strong>Dhaka, Bangladesh</strong>";
	document.getElementById("notification_panel").style.display = 'block';
	showPrayTimes(23.8043699, 90.3997218, prayTimes);
}

function showPosition(position) {
	showPrayTimes(position.coords.latitude, position.coords.longitude, prayTimes);
}

function showPrayTimes(lat, long, prayTimes) {
	moment.locale('en');
	// Method: Umm Al-Qura University, Makkah
	// Abbr.: Makkah
	// Region Used: Umm Al-Qura University, Makkah
	var prayerTimes = prayTimes.setMethod('Makkah');
	var prayerTimes = prayTimes.adjust( {fajr: 18.5, isha: '90 min'} );
	var prayerTimes = prayTimes.getTimes(new Date(), [lat, long, 300], +6, 0, '12h');

	var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha', 'Midnight'];
	var listAR = ['الفجر', 'الشروق', 'الظهر', 'العصر', 'إمساك', 'المغرب', 'العشاء', 'منتصف الليل'];

	var html = '<table id="timetable" class="table table-bordered">';
	var nextPrayerTime;
	var nextPrayerTimeRemaining;
	var nextPrayerTimeName;
	var listLength = list.length;
	for (var i = 0; i < listLength; i++) {
		// find current waqt
		var currentWaqt = '';

		var startTime = moment(prayerTimes[list[i].toLowerCase()], 'hh:mm a');
		if (list[i+1]) {
			var endTime = moment(prayerTimes[list[i+1].toLowerCase()], 'hh:mm a');
		}else{
			var endTime = moment(prayerTimes[list[0].toLowerCase()], 'hh:mm a');
		}

		if (startTime.hour() >=12 && endTime.hour() <=12 )
		{
			endTime.add(1, "days");       // handle spanning days
		}

		if (currentWaqt == '') {
			if (moment().isBetween(startTime, endTime)) {
				if (list[i] != 'Sunrise' && list[i] != 'Sunset' && list[i] != 'Midnight') {
					currentWaqt = 'bg-success';
				}
				if(list[i+1]){
					if(list[i+1] == 'Sunrise' || list[i+1] == 'Sunset'){
						nextPrayerTime = moment(prayerTimes[list[i+2].toLowerCase()], 'hh:mm a');
						nextPrayerTimeNameIndex = i+2;
					}else if(list[i+1] == 'Midnight'){
						nextPrayerTime = moment(prayerTimes[list[0].toLowerCase()], 'hh:mm a');
						nextPrayerTimeNameIndex = 0;
					}else{
						nextPrayerTime = moment(prayerTimes[list[i+1].toLowerCase()], 'hh:mm a');
						nextPrayerTimeNameIndex = i+1;
					}
				}else{
					nextPrayerTime = moment(prayerTimes[list[0].toLowerCase()], 'hh:mm a');
					nextPrayerTimeNameIndex = 0;
				}
				nextPrayerTimeRemaining = moment(nextPrayerTime.diff(moment())).utc().format('HH:mm:ss');
				nextPrayerTimeName = list[nextPrayerTimeNameIndex];
				if($("input[name='lang']:checked").val() === 'ar'){
					nextPrayerTimeRemaining = en_to_bn_number_conversion(moment(nextPrayerTime.diff(moment())).utc().format('HH:mm:ss'));
					nextPrayerTimeName = listBN[nextPrayerTimeNameIndex];
				}

				// send slack notification to PrayerTimeNotification App
				// var jamat_time = '';
				// if(list[i] == 'Dhuhr'){
				// 	jamat_time = moment(prayerTimes[list[i].toLowerCase()], 'hh:mm A').add(1, "hours").format('hh:mm A');
				// }else if(list[i] == 'Asr'){
				// 	jamat_time = moment(prayerTimes[list[i].toLowerCase()], 'hh:mm A').add(30, "minutes").format('hh:mm A');					
				// }else if(list[i] == 'Maghrib'){
				// 	jamat_time = moment(prayerTimes[list[i].toLowerCase()], 'hh:mm A').add(10, "minutes").format('hh:mm A');
				// }
				// var message = list[i]+' Jamat time will be held at '+jamat_time;
				// sendNotification(message);
			}
		}
		
		var waqt_name = list[i];
		var paryer_time = prayerTimes[list[i].toLowerCase()];
		if($("input[name='lang']:checked").val() === 'ar'){
			paryer_time = en_to_bn_number_conversion(prayerTimes[list[i].toLowerCase()]);
			waqt_name = listBN[i];
		}
		
		html += '<tr class="'+currentWaqt+'"><td>'+waqt_name+ '</td>';
		html += '<td class="text-right">'+paryer_time+ '</td></tr>';

		
		
	}
	var table_footer_title = "Next Prayer Time Remaining";
	if($("input[name='lang']:checked").val() === 'ar'){
		var table_footer_title = "الوقت المتبقي على الصلاة القادمة";
	}

	html += '<tfoot><tr class="text-center"><td colspan="2"><strong id="table_footer_title">'+table_footer_title+'</strong><br> '+nextPrayerTimeName+' '+nextPrayerTimeRemaining+'</td></tfoot>';

	html += '</table>';

	document.getElementById('divShowPrayTimes').innerHTML = html;
}

// getLocation();
setInterval(getLocation, 0);

// Set current date and time on card header
function setCurrentDateTime() {
	if($("input[name='lang']:checked").val() === 'ar'){
		moment.locale('ar');
		document.getElementById("table_header_title").innerHTML = "أثناء الصلاة";
		document.getElementById("footer_note").innerHTML = "* حسب التوقيت المحلي";
	}else{
		moment.locale('en');
		document.getElementById("table_header_title").innerHTML = "Prayer Times";
		document.getElementById("footer_note").innerHTML = "* Highlited row define the current waqt</sma";
	}
	document.getElementById("currentDateTime").innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
}
setInterval(setCurrentDateTime, 0);


function sendNotification(message = ''){
	var url = 'https://hooks.slack.com/services/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';
	var text = message;
	$.ajax({
		data: 'payload=' + JSON.stringify({
			"text": text
		}),
		dataType: 'json',
		processData: false,
		type: 'POST',
		url: url
	});
}