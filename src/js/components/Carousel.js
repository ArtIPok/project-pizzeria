import {select} from '../settings.js';

class Carousel {
  constructor(element){
    const thisCarousel = this;

    thisCarousel.render(element);

    thisCarousel.initPlugin();
  }

  render(element) {
    const thisCarousel = this;

    thisCarousel.dom = element;

    thisCarousel.dom.carousel = thisCarousel.dom.document.querySelector(select.home.carousel);

    console.log('carousel: ', thisCarousel.dom.carousel);
  }

  initPlugin() {
    const thisCarousel = this;
    // use plugin to create carousel on thisCarousel.element
    thisCarousel.carousel = new Flickity(thisCarousel.dom.carousel, {
      autoPlay: auto,
      contain: true
    });
  }
}
export default Carousel;
