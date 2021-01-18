import {settings, select, templates} from '../settings.js';
import CartProduct from './CartProduct.js';
import {utils} from '../utils.js';
import {app} from '../app.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);

    thisCart.initActions();

    console.log('new cart: ', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);

    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);

    thisCart.dom.subTotalPrice = element.querySelector(select.cart.subTotalPrice);

    thisCart.dom.totalPrice = element.querySelector(select.cart.totalPrice);

    thisCart.dom.totalPriceSum = element.querySelector(select.cart.totalPriceSum);

    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);

    thisCart.dom.form = element.querySelector(select.cart.form);

    thisCart.dom.address = element.querySelector(select.cart.address);

    thisCart.dom.phone = element.querySelector(select.cart.phone);

  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle('active');
    });

    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisCart.sendOrder();
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

  }

  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;

    const payLoad = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subTotalPrice: thisCart.subTotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    console.log('payLoad: ', payLoad);

    for(let prod of thisCart.products) {
      payLoad.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payLoad),
    };

    fetch(url, options);

  }

  add(menuProduct){
    const thisCart = this;

    // generate HTML based on template
    const generatedHTML = templates.cartProduct(menuProduct);

    console.log('generatedHTML: ',thisCart.productSummary);
    // create element DOM using utils.createElementFromHTML
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    // add element to menu
    thisCart.dom.productList.appendChild(generatedDOM);


    console.log('adding product: ', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    console.log('thisCart.products: ', thisCart.products);

    thisCart.update();

  }

  update(){
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.totalNumber = 0;
    thisCart.subTotalPrice = 0;

    for(let product of thisCart.products){
      thisCart.totalNumber = product.amount + thisCart.totalNumber;
      thisCart.subTotalPrice = product.price * product.amount / product.amount + thisCart.subTotalPrice;
    }

    if(thisCart.products.length != 0){
      thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;
      thisCart.totalPriceSum = thisCart.subTotalPrice + thisCart.deliveryFee;

    } else {
      thisCart.totalPrice = 0;
      //thisCart.totalPriceSum = 0;
      //thisCart.deliveryFee = 0;
    }

    thisCart.dom.totalNumber = thisCart.totalNumber;

    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;

    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;

    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;

    thisCart.dom.totalPriceSum.innerHTML = thisCart.totalPriceSum;

  }

  remove(thisCartProduct){
    const thisCart = this;

    const indexOfRemovedProduct = thisCart.products.indexOf(event);

    //const removedProduct = thisCart.products.splice(indexOfRemovedProduct, 1);

    thisCart.products.splice(indexOfRemovedProduct, 1);

    thisCartProduct.dom.wrapper.remove();

    app.cart.update();

  }
}

export default Cart;
