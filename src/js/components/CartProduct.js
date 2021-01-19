import {select} from '../settings.js';
import AmountWidget from '../components/AmountWidget.js';

class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;

    thisCartProduct.name = menuProduct.name;

    thisCartProduct.amount = menuProduct.amount;

    thisCartProduct.price = menuProduct.price;

    thisCartProduct.priceSingle = menuProduct.priceSingle;

    thisCartProduct.getElements(element);

    thisCartProduct.initAmountWidgetCart();

    thisCartProduct.initActions();

    console.log('thisCartProduct: ', thisCartProduct);
    console.log('dane: ', menuProduct.name);
  }

  getElements(element){
    const thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;

    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);

    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);

    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);

    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);


  }

  initAmountWidgetCart(){
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);

    thisCartProduct.amountWidget.element.addEventListener('updated', function(){
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;

      //app.cart.update();
    });
  }

  remove(){
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });

    thisCartProduct.dom.wrapper.dispatchEvent(event);

  }

  initActions(){
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', event.preventDefault());
    thisCartProduct.dom.remove.addEventListener('click', function(){
      thisCartProduct.remove();
    });

  }

  getData(){
    const thisCartProduct = this;

    const loadProduct = {
      id: thisCartProduct.id,
      name: thisCartProduct.name,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      params: thisCartProduct.params,
    };

    //console.log('name: ', thisCartProduct.name);
    return(loadProduct);
  }

}

export default CartProduct;
