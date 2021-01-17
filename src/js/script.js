/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        // input: 'input[name="amount"]',
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong',
      // .cart__order-total ,
      totalPriceSum: '.cart__order-total .cart__order-price-sum strong',
      subTotalPrice: '.cart__order-price-sum strong',
      //.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();

      thisProduct.getElements();

      thisProduct.initAccordion();

      thisProduct.initOrderForm();

      thisProduct.initAmountWidget();

      thisProduct.processOrder();

      // console.log('new Product: ', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;

      // generate HTML based on template
      const generatedHTML = templates.menuProduct(thisProduct.data);

      // create element using utils.createElementFromHTML
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      // find menu container
      const menuContainer = document.querySelector(select.containerOf.menu);

      // add element to menu
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);

    }

    initAccordion(){
      const thisProduct = this;

      // find the clickable trigger (the elelment thet should react to clicking)
      // const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      // because above is defined thisProduct.accordionTrigger

      // START: add event listener to clickable trigger on event click
      thisProduct.accordionTrigger.addEventListener('click', function(event){

        // prevent default action for event
        event.preventDefault();

        // find active product (product that has active class)
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

        // if there is active product and it's not thisProduct.element, remove class active from it
        if(activeProducts.length){
          for(let activeProduct of activeProducts){
            activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
          }
        }
        // toggle active class on thisProduct.element
        thisProduct.element.classList.add(classNames.menuProduct.wrapperActive);
      });
    }

    initOrderForm(){
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });

    //  console.log('initOrderForm: ');
    }

    processOrder(){
      const thisProduct = this;

      // convert form to object structure e.g.
      const formData = utils.serializeFormToObject(thisProduct.form);
      // console.log('formData: ', formData);

      // set price to default price
      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params){
        // determine param value, e.g. paramId = 'toppings', param = {label: 'Toppings', type: 'checkboxes'...}
        const param = thisProduct.data.params[paramId];
        // console.log(paramId, param);

        // for every option in this category
        for(let optionId in param.options){
          // determine option value, e.g. optionId = 'olives', option = {label: 'Olives', price: 2, default: true}
          const option = param.options[optionId];
          // console.log(optionId, option);

          // find image with class .paramId-optionId
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          // console.log('optionImage: ', optionImage);

          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

          if(optionImage) {
            // Yes! We've found it
            if(optionSelected){
              optionImage.classList.add(classNames.menuProduct.imageVisible);

            } else {
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }

          // check if there is param with a name of paramId in formData and if it includes optionId
          if(optionSelected) {

            // check if the option is not default
            if(!option.default) {

              // add option price to price variable
              price = price + option.price;
            }
          } else {
            // check if the option is default
            if(option.default) {
              // reduce price variable */
              price = price - option.price;
            }
          }
        }
      }
      // multiplay price by amount
      price *= thisProduct.amountWidget.value;

      // Create new property priceSingle and add to thisProduct
      thisProduct.priceSingle = price / thisProduct.amountWidget.value;

      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;

    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });

    }

    addToCart(){
      const thisProduct = this;

      app.cart.add(thisProduct.prepareCartProduct());


    }

    prepareCartProduct(){
      const thisProduct = this;

      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        priceSingle: thisProduct.priceSingle,
        price: thisProduct.priceSingle * thisProduct.amountWidget.value,
        params: thisProduct.prepareCartProductParams(),
      };

      return productSummary;
    }

    prepareCartProductParams(){
      const thisProduct = this;

      // convert form to object structure e.g.
      const formData = utils.serializeFormToObject(thisProduct.form);

      const params = {};

      // for every category (param)...
      for(let paramId in thisProduct.data.params){
        // determine param value, e.g. paramId = 'toppings', param = {label: 'Toppings', type: 'checkboxes'...}
        const param = thisProduct.data.params[paramId];

        //create category param in params const
        params[paramId] = {
          name: param.label,
          options: {},
        };

        // for every option in this category
        for(let optionId in param.options){
          // determine option value, e.g. optionId = 'olives', option = {label: 'Olives', price: 2, default: true}
          const option = param.options[optionId];

          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

          // check if there is param with a name of paramId in formData and if it includes optionId
          if(optionSelected) {

            // option is selected
            params[paramId].options = {
              [optionId]: option.label,
            };
          }
        }
      }

      return params;
    }
  }

  class AmountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);

      thisWidget.setValue(thisWidget.input.value);

      thisWidget.initActions();

      // console.log('AmountWidget: ', AmountWidget);
      // console.log('constructor arguments: ', element);
    }

    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets. amount.linkIncrease);
      thisWidget.value = settings.amountWidget.defaultValue;
    }

    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);

      // TODO: Add validation
      if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;

        thisWidget.announce();
      }
      thisWidget.input.value = thisWidget.value;
    }

    initActions(){
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener('click', function() {
        thisWidget.setValue(--thisWidget.input.value);
      });

      thisWidget.linkIncrease.addEventListener('click', function() {
        thisWidget.setValue(++thisWidget.input.value);
      });

    }

    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {bubbles: true});
      thisWidget.element.dispatchEvent(event);
    }

  }

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
        products: {},
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
        thisCart.totalPriceSum = 0;
        thisCart.deliveryFee = 0;
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

  const app = {
    initMenu: function(){
      const thisApp = this;

      // console.log('thisApp.data: ', thisApp.data);

      for(let productData in thisApp.data.products){
        //new Product(productData, thisApp.data.products[productData]);
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function() {
      const thisApp = this;

      thisApp.data = {};

      const url = settings.db.url + '/' + settings.db.product;

      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse: ', parsedResponse);

          thisApp.data.products = parsedResponse;

          thisApp.initMenu();
        });

      console.log('thisApp.data: ', JSON.stringify(thisApp.data));

    },

    init: function(){
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();

      //thisApp.initMenu();

      thisApp.initCart();

    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    }
  };

  app.init();

}
