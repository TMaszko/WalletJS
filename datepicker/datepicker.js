// do refaktoryzacji kodu



window.addEventListener('load', function () {

var dayList = document.querySelectorAll('.week td');
var arrDays = [].slice.call(dayList,0);
var startDay = null;
var endDay = null;

arrDays.forEach(function (day) {
    day.addEventListener('click', markDay);
  });


function markDay(e){
  if (!startDay && !endDay) { // poczatek nic nie wybrane
    startDay = e.target;
    startDay.classList.add('end');
    console.log(startDay);
    arrDays.forEach(function (day, i) {
      day.removeEventListener('click', markDay); // wybrany start to usuwamy listenera
      if ( i+1 >= parseInt(startDay.textContent,10)) { // jezeli dzien 1szy to index 0 dlatego i+1
        day.addEventListener('mouseover', hoverDays)  // dodany do kazdego dnia listener na zaznaczanie zakresu
      }
    })
  }
  else if ( startDay && !endDay) {  //wybrany nowy poczatek
    endDay = e.target;
    endDay.classList.add('end'); 
    arrDays.forEach(function (day , i) {
      if (day != endDay && day != startDay) {
        console.log('removing');
        day.removeEventListener('click', markDay); // usuniecie listenera jak sa zaznaczone end i start
      }
        day.removeEventListener('mouseover', hoverDays); // usuniecie listenera z zaznaczaniem zakresu
    })
  }
  else if( !startDay && endDay) { // wybranie nowego startu
    startDay = e.target;
    startDay.classList.add('end');
    console.log(startDay);
    hoverDays()
    arrDays.forEach(function (day, i) {
      day.removeEventListener('click', markDay);
      if( i > parseInt(endDay.textContent,10)) {
        day.addEventListener('mouseover', hoverDays)
      }


  })
  }
  else if (e.target == endDay) {           /// wybranie nowego konca
      endDay.classList.remove('end');
      endDay = null;
      arrDays.forEach(function (day, i) {
        if ( i+1 >= parseInt(startDay.textContent,10)) {
          day.addEventListener('click', markDay);
          day.addEventListener('mouseover', hoverDays)
      }
    })
  }
  else if (e.target == startDay) { // wybranie nowego poczatku
    console.log('zmien start');
      startDay.classList.remove('end');
      startDay = null;
      arrDays.forEach(function (day, i) {
        if( i < parseInt(endDay.textContent,10)) {
          day.addEventListener('click', markDay); // dodanie nowego listenera zeby moc wybrac nowy poczatek
          day.addEventListener('mouseover', hoverDays) // dodaniego nowego listenera zeby moc zaznaczac zakres
      }
    })
  }
}

function hoverDays(e) {
  arrDays.forEach(function (day, i) {
    if (startDay && !endDay && i+1 >= parseInt(startDay.textContent,10) && i < parseInt(e.target.textContent,10)) { // zaznaczanie od startu az do nast klikniecia
      arrDays[i].classList.add('active');
      day.addEventListener('click', markDay);
    }
    else if (startDay && endDay && i+1 >= parseInt(startDay.textContent,10) && i < parseInt(endDay.textContent,10)) {
       arrDays[i].classList.add('active'); // jezeli jest wybrany start i end to wtedy podswietlaj tylko z zakresu start do end
      day.addEventListener('click', markDay);
    }
    else if (!startDay && i < parseInt(endDay.textContent,10) && i >= parseInt(e.target.textContent,10)){
      arrDays[i].classList.add('active');          // jezeli nie ma startu to wtedy podswietlaj od myszki az do end 
      day.addEventListener('click', markDay);

    }
    else                      
      day.classList.remove('active'); // jesli nie spelnia zadnego z powyzszych to znaczy ze nalezy odznaczyc
  })
  
}

})