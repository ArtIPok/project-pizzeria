import Carousel from '../components/Carousel.js';

class Home {
  constructor(){
    const thisHome = this;

    thisHome.initPlugin();

  }

  initPlugin(){
    const thisHome = this;

    thisHome.carousel = new Carousel(thisCarousel.dom);
  }
}

export default Home;
