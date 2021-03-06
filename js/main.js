// Variables & Config
var debug = false;
var cache_url = 'cache/';
var months = ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'];
var dayoftheweek = [ 'Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'];
var cinema = [['Mall Sofia', 'ms'], ['Paradise Center', 'pc'], ['Мол Пловдив', 'mp'], ['Стара Загора', 'sz'], ['Русе', 'ru'], ['Бургас', 'bu']];

// Functions
function de(data) {
	if(debug){
		console.log(data);
	}
}

function dateFormat(currentDate){
	return dayoftheweek[currentDate.getDay()] + ", " + currentDate.getDate() + " " + months[currentDate.getMonth()]
}

function GetDates(startDate, daysToAdd) {
	var aryDates = [];

	for (var i = 0; i <= daysToAdd; i++) {
		var currentDate = new Date();
		currentDate.setDate(startDate.getDate() + i);
		aryDates.push(currentDate);
	}

	return aryDates;
}


// When the HTML loads, may the fun begins!
$(function(){

	var today		= new Date(),
		weekdays	= new Array(),

		$table		= $('#table'),
		$select_date = $('#date'),
		$select_cinema = $('#cinema'),
		$cols		= []
	;

	var dates = GetDates(today, 7);
	console.log(dates);

	function update_table(day, cinema)
	{
		$table.load(cache_url + cinema + '-' + day + ".html table", function(data) {
			if( $table.find('td').size() > 0 )
			{ 
				$table.removeClass('noprogram').find('tr:gt(0)').each(function() // go through all rows (skip head row)
				{
					$(this).children().slice(1).each(function(i) // to through all cells (skip head cells) in the row and add them in the $cols array
					{
						if(!$cols[i]){ $cols[i] = []; }
						$cols[i].push(this);
					});
				});
			}
			else
			{
				$table.addClass('noprogram').html('<h4>Няма програма за този ден</h4>');
			}

			de(day + ' ' + cinema);
		});	
	}

	for(var i = 0, d; i < 7; i++){
		d = dates[i]
		$select_date.append('<option value="' + d.getFullYear() + '-' + ('0' + ( d.getMonth() + 1 ) ).slice(-2) + '-' + ( '0' + d.getDate() ).slice(-2) + '">' + dateFormat(dates[i]) + '</option>');
	}

	for(var i = 0; i < cinema.length; i++){
		$select_cinema.append('<option value="' + cinema[i][1] + '">' + cinema[i][0] +'</option>');
	}

	$select_date.change(function(){ update_table( $(this).val(), $("#cinema").val() ); }).change();
	$select_cinema.change(function(){ update_table( $("#date").val(), $(this).val() ); });

	var cols_highlight = function (index, shadowed)
	{
		if(index > 0)
		{
			for($c = $cols[index - 1], i = 0; i < $c.length; i++)
			{
				$c[i].className = (shadowed ? 'highlight' : '');
			}
		}
	};

	$table
		.delegate("td", "mouseover", function() { cols_highlight($(this).index(), true); })
		.delegate("td", "mouseout" , function() { cols_highlight($(this).index()); })
});


