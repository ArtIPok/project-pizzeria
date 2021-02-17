/* global Flickity */
//import {select} from '../settings.js';

class Carousel {
  constructor(selector){
    const thisCarousel = this;

    thisCarousel.getElements(selector);

    thisCarousel.initPlugin();
  }

  getElements(selector) {
    const thisCarousel = this;

    thisCarousel.dom = {};

    thisCarousel.dom.carousel = document.querySelector(selector);

    console.log('carousel: ', thisCarousel.dom.carousel);
  }

  initPlugin() {
    const thisCarousel = this;
    // use plugin to create carousel on thisCarousel.element
    thisCarousel.carousel = new Flickity( thisCarousel.dom.carousel, {
      autoPlay: true,
      wrapAround: true
    });
  }
}
export default Carousel;
