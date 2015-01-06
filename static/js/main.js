/*!
 * monte v0.0.5 (http://www.luisrosar.io/lab/monte)
 * Copyright 2014-2015 luis rosario {zapo}
 * Licensed under MIT (https://github.com/aztec8/monte/blob/master/LICENSE)
 */
var cmi = cmi || {}

cmi.config = {
    JSON_FILE: 'data/cmi-sample.json'
}

'use strict';
var cmi = cmi || {};


cmi.main = {
  cache: {},  // stores our DOM references
  total: 0,  // order total
  USE_BEFORE_RATE: true,  // we always start with the "before rate"
  USE_AFTER_RATE: false,
  init: function() {

    // import the data
    // ----------------------------------------
    $.getJSON(cmi.config.JSON_FILE, function (data) {
      // console.log('json loaded', data);
      cmi.DATA = data;
      cmi.main.process_data();
    });


    // get some DOM references
    // ----------------------------------------
    this.cache = {
        total: $('#total')
    }
    // console.log(this.cache.$total);


    // listen for quantity changes
    // ----------------------------------------
    $('#rental-equipment').on('change', function (event) {
      // console.log(event.target);
      cmi.main.update_row_total(event.target);
      cmi.main.update_order_total(event.target);
    });
  },

  process_data: function () {
    /**
     * this function takes the data and spits out HTML
     * it also lets us know which rate to use for calculating prices
     */

    // populate the event information
    cmi.utils.render_template({
        target: '#event-information',
        template: '#event-information-tpl',
        context: cmi.DATA.event_information
    });

    // the rental deadlines
    cmi.utils.render_template({
        target: '#rental-equipment-headers',
        template: '#rental-equipment-headers-tpl',
        context: cmi.DATA.event_information
    })

    // the rental list
    cmi.utils.render_template({
        target: '#rental-equipment-table',
        template: '#rental-equipment-tpl',
        context: {rental_equipment: cmi.DATA.rental_equipment},
        append: true
    })

    // what date is it? affects our price calculation
    // ----------------------------------------
    var now = moment(),
        after_deadline = moment(cmi.DATA.event_information.after_rate_deadline);

    if (moment(now).isAfter(after_deadline)) {
        this.USE_BEFORE_RATE = false;
        this.USE_AFTER_RATE = true;
    }

  },

  update_row_total: function (dom_node) {
    // this event is bubbling from an input element
    // console.log('hello from ', dom_node);
    var quantity = parseInt(dom_node.value, 10),
        price = 0,
        total = 0;
    // console.log('quantity:', quantity);

    // make sure we have a number, else do nothing
    if (!isNaN(quantity)) {
        // console.log('parent', dom_node.parentNode.parentNode);
        if (this.USE_BEFORE_RATE) {
            price = parseInt(dom_node.parentNode.parentNode.getAttribute('data-before-rate'), 10);
        } else if (this.USE_AFTER_RATE) {
            price = parseInt(dom_node.parentNode.parentNode.getAttribute('data-after-rate'), 10);
        }
        // console.log('price: ', price);

        total = price * quantity;
        // console.log('row total: ', total);

    } else {
        alert('Enter a number, please');
        dom_node.value = '';
        total = 0;
    }

    // update html
    $(dom_node.parentNode.parentNode).find('.total').html(total);


  },

  update_order_total: function (dom_node) {
    // current total =
    // console.log('update total: ', this.total);

    // i guess for now we'll do it quick and dirty
    // find all the .total, loop through, get the total
    //      later on maybe we'll just keep na array of objects

    var total = 0;

    $('.total').each(function (index, element) {
      // console.log('hello', index, element);
      // console.log(parseInt(element.innerHTML, 10));
      var row_total = parseInt(element.innerHTML, 10);
      if (!isNaN(row_total)) total += row_total;
    });
    $('#total').html(total);
  }
};


window.onload = cmi.main.init;

'use strict';
var cmi = cmi || {};

cmi.utils = {
  render_template: function(settings) {
    /**
     * Dependencies: Handlebar.js, jQuery.js
     *
     * settings = {
     *   template: '#script-id',
     *   target: '#query-string',
     *   context: {},
     *   append: boolean (optional),
     *   prepend: boolean (optional)
     * }
     */
    // get Handlebar template
    if (!settings.template || settings.template ==='') {
      $(settings.target).html(''); // if template is empty, clear HTML of target
      return;
    }
    var template = Handlebars.compile($(settings.template).html());

    // render it (check it we have a context)
    var html = template( settings.context ? settings.context : {} );

    if (settings.append) $(settings.target).append(html);
    else if (settings.prepend) $(settings.target).prepend(html);
    else $(settings.target).html(html);

  },

  load_localStorage: function (storage_name) {
    return JSON.parse(localStorage.getItem(storage_name));
  },

  save_localStorage: function (storage_name, JSON_data) {
    localStorage.setItem(storage_name, JSON.stringify(JSON_data));
    console.log('data saved: ' + storage_name);
  },

  clear_localStorage: function (storage_name) {
    localStorage.removeItem(storage_name);
    console.log('data removed: ' + storage_name);
  }

}
