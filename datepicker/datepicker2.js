
/*
To DO :
- reprezentacja dat w dwóch tablicach 2 wymiarowych
- pełne 6 tygodni zawsze
- dorobienie metody dodającej 1 dzień do daty która istnieje // done
Funkcje:
- kliknięcie na date spowoduje zaznaczenie dnia i od tamtego dnia można przejechać myszka
nad dniami zeby je zobaczyc
- kolejne klikniecie na dacie zaznaczy koniec przedzialu i od tamtej pory  kolejne klikniecie
 wyznaczy nowy start
- Data ktora jest wyszarzona (nie ten miesiac , nast badz poprzedni) należy zaznaczyć
 w odpowiednim miejscu czyli jak najedziemy na wyszarzone powinno sie zaznaczyc 
 w tym miesiacu
 gdzie powinno być
- input wtedy też sie zaaktualizuje // to jest najmniej na razie istotne







*/


window.addEventListener('load', function () {


	// helper methods 

	Date.prototype.addDay = function(num) {
		this.setDate(this.getDate() + (num ? num : 1));
	};
	Date.prototype.clone = function() {
		return new Date(this.getTime());
	}
	Date.prototype.daysInMonth = function() {
		var date =this.clone();
		date.setMonth(date.getMonth() + 1);
		date.setDate(0);
		return date.getDate();
		
	}
	Date.prototype.startOf = function (subj) {

		var date = this.clone();
		if (subj == 'day') {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		}
		return date;
	}
	Date.prototype.substract = function (num, subj) {
		var date = this.clone(), times = 0;
		if (subj == 'month') {
				date.setMonth(date.getMonth() - num);
		}
		return date;
	}
	Date.prototype.isSame = function(target , subj) {
		var date = this.clone();
		if (subj == 'day') {
			return	target.getFullYear() == date.getFullYear() && date.getMonth() == target.getMonth() && date.getDate() == target.getDate();
		}
	}
	Node.prototype.parents = function(selec) {
		var searching,found=false;
		if ( document.querySelectorAll(selec)) {
			for(var i = 0 ; i < document.querySelectorAll(selec).length && !found; i++) {
				searching = this;
				while(searching && searching != document.querySelectorAll(selec)[i]) {
						searching = searching.parentNode; 
				}
				if (searching) {
					found = true;
				}
			}
		}
		return searching;
	}


function DateRangePicker() {
	this.startDate = new Date().startOf('day');
	this.locale = {
		firstDay: 1,
		daysOfWeek: ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],

	};
	this.leftCalendar = {};
	this.rightCalendar = {};
	this.endDate = false;
	this.updateDayOfWeek();
	this.updateMonthsInView();
	this.updateView();
 
	

}





	DateRangePicker.prototype = {

		constructor: DateRangePicker,

		updateDayOfWeek: function () {
			var iterator = this.locale.firstDay;
			if (this.locale.firstDay != 0) {
	            while (iterator > 0) {
	                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
	                iterator--;
	            }
        	}
		},

		updateMonthsInView: function () {

			this.leftCalendar.month = this.startDate.clone();
			this.rightCalendar.month = new Date(this.startDate.clone().setMonth(this.startDate.getMonth()+1)); // default

		},
		


		renderCalendar: function (side) {
			var calendar = this.prepareCalendarModel(side);
			if( side == 'left' ) {
				this.leftCalendar.calendar = calendar;
			} else {
				this.rightCalendar.calendar = calendar;
			}

			var html = '<table>' + '<tbody>';

			this.locale.daysOfWeek.forEach( function (dayOfWeek) {
				html += '<th class="dayOfWeek">' + dayOfWeek +'</th>';
			});

			for( var row = 0; row < 6; row++) {
				html += '<tr>';

				for(var col = 0; col < 7; col++) {

					var classes = [];

					if (calendar[row][col].isSame(new Date(), 'day')) {
						classes.push('today');

					}

					if (calendar[row][col].getMonth() != calendar[1][1].getMonth()) {
						classes.push('off');
					}
					if (this.startDate && calendar[row][col].isSame(this.startDate,'day')) {
                        classes.push('active','start-date');
					}
					if (this.endDate && calendar[row][col].isSame(this.endDate, 'day')) {
                        classes.push('active', 'end-date');
					}

					if (this.endDate && this.startDate && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                        classes.push('in-range');
					}

					var classesNames = '', disabled= false;

					for (var i = 0; i < classes.length; i++) {

						classesNames += classes[i] + ' ';

						if (classes[i] == 'disabled') {
							disabled = true;
						}
					}
						if (!disabled) {
							classesNames += 'available';
						}

						html += '<td class="' + classesNames.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r'+row + 'c' + col + '">'+'<span>' + calendar[row][col].getDate()+ 
						'</span></td>';
						// klasy dla danej komorki 
					

				}
				  html += '</tr>';

			}
			html += '</tbody>';
			html += '</table>';
			document.querySelector('.calendar'+'.'+side).innerHTML = html;

		},

		prepareCalendarModel: function(side) {
			/* =======  const values which depedend on obj leftCalendar or rightCalendar  ======== */  

			var calendar  = side == 'left' ? this.leftCalendar : this.rightCalendar,
			 	month = calendar.month.getMonth(), // 0 - 11
			 	year = calendar.month.getFullYear(),
			 	daysInMonth = calendar.month.daysInMonth(), // 31, 28, 29, 30
			 	firstDay = new Date(calendar.month.clone().setDate(1)), // setDate() returnig new number of ms
			 	lastDay = new Date(calendar.month.clone().setDate(daysInMonth)),
			 	lastMonth = calendar.month.substract(1,'month').getMonth(),
			 	lastYear = calendar.month.substract(1,'month').getFullYear(),
			 	daysInLastMonth = new Date(calendar.month.clone().setDate(0)).getDate(),
			 	firstDayOfWeek = firstDay.getDay(),
			 	renderStartDay = 0,// default
			/* ================================================================ */ 







			 	calendar = [] 
			 	for (var i = 0; i < 6; i++) {

			 	 	calendar[i]  = [] // initialize empty array
			 	}


			 	renderStartDay = daysInLastMonth - firstDayOfWeek + this.locale.firstDay + 1; // odejmujemy do poczatku tygodnia domyslnie jest niedziela = 0 wiec potem trzeba dodac locale firstDay
			 	// chodzi tutaj o kolejnosc dni bo nie jest wazna suma tylko jaki to jest dzien
				if (renderStartDay > daysInLastMonth) {
                	renderStartDay -= 7;
				}

				var currDate = new Date(lastYear,lastMonth,renderStartDay,0,0,0); 
			for (var i = 0, col = row = 0; i < 42 ; i++, col++, currDate.addDay()) {
					if ( i > 0 && col % 7 == 0  ) {
						row++;
						col = 0;
					}
					
				calendar[row][col] = currDate.clone();
			}
			return calendar;	
		},
		bindEvents : function () {
			[].slice.call(document.querySelectorAll('.calendar td.available')).forEach(function(el) {
					el.addEventListener('click', this.clickDate.bind(this));
					el.addEventListener('mouseover',this.hoverDate.bind(this));
			}.bind(this));
		},
		clickDate: function(e) {
			if (!e.target.parentNode.classList.contains('available')){
				return;
			}
			var title = e.target.parentNode.getAttribute('data-title'),	
			 	row = title.substr(1, 1),
			 	col = title.substr(3, 1),
			 	cal = e.target.parents('.calendar'),
			 	date = cal.classList.contains('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
			console.log(cal) ;
			if ( this.startDate && date.getTime() == this.startDate.getTime()) {
				this.startDate = null;
			} else if ( this.endDate && date.getTime() == this.endDate.getTime()) {
				this.endDate = null;
			} else if ( !this.startDate  && !this.endDate) {
				this.startDate = date.clone();

			} else	if (!this.startDate && this.endDate  && date < this.endDate) { // picking start
				this.startDate = date.clone();
				console.log(this.startDate);

			} else if ( !this.endDate && this.startDate && date > this.startDate) { // picking end 
				this.endDate = date.clone();
			}
			this.updateView();

		},
		hoverDate: function(e) {
			var	leftCalendar = this.leftCalendar,
				rightCalendar = this.rightCalendar;
				title = e.target.parentNode.getAttribute('data-title') || e.target.getAttribute('data-title'),	
			 	row = title.substr(1, 1),
			 	col = title.substr(3, 1),
			 	cal = e.target.parents('.calendar'), 
			 	date = cal.classList.contains('left') && row && col ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col],
				startDate = this.startDate;

				if ( !this.endDate && startDate ) {
					[].slice.call(document.querySelectorAll('.calendar td')).forEach( function(el, index) {
						if (el.classList.contains('dayOfWeek'))
							return;
						// console.log(this);
						var title = el.getAttribute('data-title'),	
						 	row = title.substr(1, 1),
						 	col = title.substr(3, 1),
						 	cal = el.parents('.calendar'), 
						 	dt = cal.classList.contains('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

						 	if (dt > startDate && dt < date || dt.isSame(date, 'day')) {
						 		el.classList.add('in-range');
						 	} else {
						 		el.classList.remove('in-range');
						 	}

					}.bind(this));

				} else if ( !startDate && this.endDate) {
						[].slice.call(document.querySelectorAll('.calendar td')).forEach( function(el, index) {
						if(el.classList.contains('dayOfWeek'))
							return;
						var title = el.getAttribute('data-title');
						 	row = title.substr(1, 1),
						 	col = title.substr(3, 1),
						 	cal = el.parents('.calendar'), 
						 	dt = cal.classList.contains('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

						 	if (dt < this.endDate && dt > date || dt.isSame(date, 'day')) {
						 		el.classList.add('in-range');
						 	} else {
						 		el.classList.remove('in-range');
						 	}

					}.bind(this));

				}
		},
		
		updateView: function() {

			this.renderCalendar('left');
			this.renderCalendar('right');
			this.bindEvents();
		}
	
	};
	var datePicker = new DateRangePicker();
	
});

