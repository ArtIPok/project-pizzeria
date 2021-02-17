import Carousel from '../components/Carousel.js';
import {select} from '../settings.js';

class Home {
  constructor(){
    const thisHome = this;

    thisHome.initPlugin();

  }

  initPlugin(){
    const thisHome = this;

    thisHome.carousel = new Carousel(select.home.carousel);
  }
}

export default Home;
