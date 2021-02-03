import {select, templates, settings} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from '../components/AmountWidget.js';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';

class Booking {
  constructor(tablesBooking){
    const thisBooking = this;

    thisBooking.render(tablesBooking);
    thisBooking.initWidgets();
    thisBooking.getDate();
  }

  getDate(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=';/* + utils.dateToStr(thisBooking.datePicker.minDate);*/
    const endDateParam = settings.db.dateEndParamKey + '='; /* + utils.dateToStr(thisBooking.datePicker.maxDate); */

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

    console.log('params: ', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };
    console.log('nasz url: ', urls);

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

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate<= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    console.log('thisBooking.booked: ', thisBooking.booked);
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utuls.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      //console.log('loop: ', loop);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][startHour].push(table);

    }
  }

  render(tablesBooking){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = tablesBooking;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    thisBooking.dom.dateAmount = document.querySelector(select.widgets.datePicker.wrapper);

    thisBooking.dom.timeAmount = document.querySelector(select.widgets.hourPicker.wrapper);

  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.amountWidgetPeople = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.amountWidgetHours = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.amountWidgetDate = new DatePicker(thisBooking.dom.dateAmount);

    thisBooking.amountWidgetTime = new HourPicker(thisBooking.dom.timeAmount);

  }
}

export default Booking;
