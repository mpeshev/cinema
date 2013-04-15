// Variables & Config
var debug = true;
var cache_url = 'cache/';
var months = ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'];
var cinema = [['Mall Sofia', 'ms'], ['Paradise Center', 'pc'], ['Мол Пловдив', 'mp'], ['Стара Загора', 'sz'], ['Русе', 'ru'], ['Бургас', 'bu']];

// Functions
function de(data) {
	if(debug){
		console.log(data);
	}
}


// When the HTML loads, may the fun begins!
$(function(){

	var today		= new Date(),
		weekdays	= new Array(),
		yyyy		= today.getFullYear(),
		mm			= today.getMonth(), //January is 0!
		dd			= today.getDate(),

		$table		= $('#table'),
		$select_date = $('#date'),
		$select_cinema = $('#cinema'),
		$cols		= []

	;

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
				$table.addClass('noprogram').append('<h4>Няма програма за този ден</h4>');
			}
			// for(var i in $cols){ $cols[i] = $($cols[i]); } // convert all cols to jquery objects

			de(day + ' ' + cinema);
		});	
	}

	for(var i = 0, day, month; i < 8; i++){

		day = dd + i;
		month = mm + 1;
		if(day < 10){day = '0' + day} 
		if(mm < 10){month = '0' + month} 

		weekdays.push( yyyy + '-' + month + '-' + day );

		$select_date.append('<option value="' + yyyy + '-' + month + '-' + day + '">' + (dd+i) + ' ' + months[mm] +'</option>');
	}

	for(var i = 0; i < cinema.length; i++){
		$select_cinema.append('<option value="' + cinema[i][1] + '">' + cinema[i][0] +'</option>');
	}

	$select_date.change(function(){ update_table( $(this).val(), $("#cinema").val() ); });
	$select_cinema.change(function(){ update_table( $("#date").val(), $(this).val() ); });

	update_table(weekdays[0], cinema[0][1]);

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


