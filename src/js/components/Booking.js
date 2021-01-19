import {app} from '../app.js';
import {utils} from '../utils.js';
import {select, templates} from '../settings.js';
import AmountWidget from '../components/AmountWidget.js';

class Booking {
  constructor(tablesBooking){
    const thisBooking = this;

    thisBooking.render(tablesBooking);

    thisBooking.initWidgets();
  }

  render(tablesBooking){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.elementHTML = utils.createDOMFromHTML(generatedHTML);


    thisBooking.dom = {};

    thisBooking.dom.wrapper = document.querySelector(select.containerOf.booking);

    thisBooking.dom.wrapper.innerHTML = thisBooking.generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    console.log('people: ', thisBooking.elementHTML);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.amountWidgetPeople = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.amountWidgetHours = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.amountWidgetPeople.element.addEventListener('update', function(){

    });

    thisBooking.amountWidgetHours.element.addEventListener('update', function(){

    });

  }
}

export default Booking;
