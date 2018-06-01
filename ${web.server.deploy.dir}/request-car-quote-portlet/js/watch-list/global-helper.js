'use strict';

Handlebars.registerHelper('printJson', function(context) {
    return JSON.stringify(context);
});

Handlebars.registerHelper('exists', function(variable, options) {
    if (typeof variable !== 'undefined') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper("ddmmyyyy", function(value, options){
    var tmp = String(value);
    var split = tmp.split('-');
    return split[2] +'-'+split[1]+'-'+split[0];
});

Handlebars.registerHelper('ifEq', function(v1, v2, options) {
  if(v1 === v2) {
    // console.log(v1,v2,' equal values');
    return options.fn(this);
  }else{
    // console.log(v1,v2,' not equal values');
    return options.inverse(this);
  }
});

Handlebars.registerHelper("inc", function(value, options){
    return parseInt(value) + 1;
});

Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i) {
        block.data.index = i;
        block.data.sequence = i+1;
        block.data.first = i === 0;
        block.data.last = i === (n - 1);
        accum += block.fn(this);
    }
    return accum;
});

Handlebars.registerHelper('eachUptoMin', function(ary, min, block) {
    var arryLength = ary.length;
    var itertations = ary.length;
    if (arryLength < min) {
        itertations = min;
    }

    if(!ary || ary.length == 0){
        return block.inverse(this);
    }

    var result = [ ];
    for(var i = 0; i < itertations; ++i){
        block.data.index = i;
        block.data.sequence = i+1;
        block.data.evenOdd = (i+1) % 2 === 0 ? 'even' : 'odd';
        block.data.first = i === 0;
        block.data.last = i === (min - 1);
        result.push(block.fn(ary[i]));
    }
    return result.join('');
});

