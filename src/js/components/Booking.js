import {select, templates} from '../settings.js';
import AmountWidget from '../components/AmountWidget.js';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';

class Booking {
  constructor(tablesBooking){
    const thisBooking = this;

    thisBooking.render(tablesBooking);

    thisBooking.initWidgets();
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
