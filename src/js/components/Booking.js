import {select, templates, settings, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from '../components/AmountWidget.js';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';

class Booking {
  constructor(tablesBooking){
    const thisBooking = this;

    thisBooking.selected = {};

    thisBooking.starters = [];

    thisBooking.render(tablesBooking);
    thisBooking.initWidgets();
    thisBooking.getDate();
  }

  getDate(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.amountWidgetDate.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.amountWidgetDate.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],

    };
    //console.log('params: ', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingRespons = allResponses[0];
        const eventsCurrentRespons = allResponses[1];
        const eventsRepeatRespons = allResponses[2];
        return Promise.all([
          bookingRespons.json(),
          eventsCurrentRespons.json(),
          eventsRepeatRespons.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.amountWidgetDate.minDate;
    const maxDate = thisBooking.amountWidgetDate.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    //console.log('thisBooking.booked: ', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.amountWidgetDate.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.amountWidgetTime.value);
    //console.log('Data: ', thisBooking.date);
    //console.log('Godzina: ', thisBooking.hour);


    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  initTables(){
    const thisBooking = this;

    const clickedTable = event.target;

    if(clickedTable.classList.contains('table') && !clickedTable.classList.contains('booked') && !clickedTable.classList.contains('selected')) {

      const idTable = clickedTable.getAttribute('data-table');
      //console.log('idTable: ', idTable);

      thisBooking.dom.idTableSelected = thisBooking.selected.idTable;

      for(let table of thisBooking.dom.tables){
        table.classList.remove('selected');
      }

      clickedTable.classList.add(classNames.booking.tableSelect);

      //console.log('clickedTable: ', clickedTable);
    } else if (clickedTable.classList.contains('table') && !clickedTable.classList.contains('booked') && clickedTable.classList.contains('selected')) {
        clickedTable.classList.remove('selected');
        //console.log('clickedTable: ', clickedTable);

    } else if(clickedTable.classList.contains('booked')) {
      alert('Sorry, this table is reserved in this time');
    }
  }

  sendBooking(){
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    const tableBook = {
      date: thisBooking.dom.dateAmount,
      hour: thisBooking.dom.hoursAmount,
      table: thisBooking.dom.idTableSelected,
      duration: thisBooking.dom.durationBooking,
      pepole: thisBooking.dom.peopleAmount,
      starters: [],
      phone: thisBooking.dom.phoneBooking,
      address: thisBooking.dom.addressBooking,
    };

    console.log('tableBook: ', tableBook);

    for(let starter of thisCart.starters) {
      if(thisBooking.startersBooking.contains('chackbox__checkmark'))
      tableBook.starters.push(thisBooking.startersBooking[value]);
    }

    console.log('tableBook: ', tableBook);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tableBook),
    };

    thisBooking.sendBooking();

    //fetch(url, options);

  }

  render(tablesBooking){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = tablesBooking;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.dateAmount = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);

    thisBooking.dom.timeAmount = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.tableSelect = thisBooking.dom.wrapper.querySelector(select.booking.tablesArea);

    thisBooking.dom.listBooking = thisBooking.dom.wrapper.querySelector(select.booking.tableBook);

    thisBooking.dom.startersBooking = thisBooking.dom.wrapper.querySelector(select.booking.starters);

    thisBooking.dom.phoneBooking = thisBooking.dom.wrapper.querySelector(select.booking.phone);

    thisBooking.dom.addressBooking = thisBooking.dom.wrapper.querySelector(select.booking.address);

  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.amountWidgetPeople = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.amountWidgetHours = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.amountWidgetDate = new DatePicker(thisBooking.dom.dateAmount);

    thisBooking.amountWidgetTime = new HourPicker(thisBooking.dom.timeAmount);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });

    thisBooking.dom.wrapper.addEventListener('click', function(){
      thisBooking.initTables();
    });

    thisBooking.dom.listBooking.addEventListener('submit', function(){
      event.preventDefault();
      thisBooking.sendBooking();

      console.log('tableBook: ', tableBook);
    });

  }
}

export default Booking;
