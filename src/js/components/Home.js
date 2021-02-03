import {select, templates} from '../settings.js';
import Carousel from '../components/Carousel.js';


class Home{
  constructor(pageHome){
    const thisHome = this;

    thisBooking.render(pageHome);

    thisBooking.initWidgets();
  }

  render(pageHome){
    const thisHome = this;

    //const generatedHTML = templates.bookingWidget();

    thisHome.dom = {};

    //thisHome.dom.wrapper = thisHome;

    //thisHome.dom.wrapper.innerHTML = generatedHTML;

    thisHome.dom.caorusel = document.querySelector(select.home.carousel);

  }

  initWidgets(){
    const thisHome = this;

    thisHome.carousel = new Carousel(thisHome.dom.carousel);

  }

  }
export default Home;
