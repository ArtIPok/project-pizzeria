
class Home {
  constructor(){
    const thisHome = this;

    thisHome.render();

  }

  render(){
    const thisHome = this;

    thisHome.carousel = document.querySelector('.carousel');

    const flkty = new Flickity(thisHome.carousel, {
      cellAlign: 'left',
      contain: true
    });

  }
}
export default Home;
