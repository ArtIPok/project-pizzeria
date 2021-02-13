import Carousel from '../components/Carousel.js';

class Home {
  constructor(){
    const thisHome = this;

    thisHome.initPlugin();

  }

  initPlugin(){
    const thisHome = this;

    thisHome.carousel = new Carousel(thisHome.dom);
  }
}

export default Home;
