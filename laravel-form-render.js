function isFunction(v){
    if(v instanceof Function) {
        return true;
    }
    return false;
}

function matchFunction(v){
    var f;
    switch(v) {
        case "textComponentRender":
            f = textComponentRender;
            break;
        case "switchComponentRender":
            f = switchComponentRender;
            break;
        case "selectComponentRender":
            f = selectComponentRender;
            break;                   
        case "parameterizedComponentRender":
            f = parameterizedComponentRender;
            break;
        case "textParameterRender":
            f = textParameterRender;
            break;
        case "textParameterRender2":
            f = textParameterRender2;
            break;
        case "selectParameterRender":
            f = selectParameterRender;
            break;
        case "selectParameterRender2":
            f = selectParameterRender2;
            break;                        
        case "switchParameterRender":
            f = switchParameterRender;
            break;
        case "tabularSelectComponentRender":
            f = tabularSelectComponentRender;
            break;
        case "textRadioComponentRender":
            f = textRadioComponentRender;
            break;
        case "autocompleteComponentRender":
            f = autocompleteComponentRender;
            break;
        default:
            f = emptyComponentRender;
    }
    return f;
}

function castFunction(v){
    if(isFunction(v)) {
        return v;
    }
    return matchFunction(v);
}

// foreach_([..], function(index, element) { .. });
var foreach_ = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
    }
};

function ParseInt(value){
    var parsed = parseInt(value);
    if(isNaN(parsed)) return 0;
    return parsed;
}

function emptyComponentRender(component, parent, props, events = {}, classes = 'col-md-2') {
    var col = $('<div></div>');
    col.addClass((props.hasOwnProperty('col_class'))? props.col_class : classes);
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);
    form_group.attr('id', prefix_class + component);

    var t = $('<div>Empty component</div>');
    t.attr('name', component);
    t.attr('id', component);

    form_group.append(t);
    col.append(form_group);
    parent.append(col);

    return form_group;
}
/// component (string)
/// parent (documentDOMElement)
/// props (object { value (var), prefix_id (string), prefix_class (string), label (string), placeholder (string), addOn (string) } )
/// events (object of event handling functions, where key are variable)
function textComponentRender(component, parent, props, events = {}, classes = 'col-md-2'){
    var col = $('<div></div>');
    col.addClass((props.hasOwnProperty('col_class'))? props.col_class : classes);
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);
    form_group.attr('id', prefix_class + component);

    addLabel(component, form_group, props);

    var input_group = $('<div></div>');
    input_group.addClass("input-group");

    var t = $('<input />');
    t.addClass('form-control input-xs');
    t.attr('name', component);
    t.attr('id', component);
    t.attr('required', '');
    t.attr('placeholder', props.placeholder);
    t.val(props.value);

    if(state['validation'].hasOwnProperty(component)) t.addClass('validatable');

    input_group.append(t);

    var a = $('<div></div>');
    a.addClass('input-group-addon');
    a.attr('id', component + '_addon');
    a.html(props.addOn);
    input_group.append(a);

    form_group.append(input_group);

    if(state["validation"].hasOwnProperty(component)){
        t.addClass("validatable");
        var m = $("<div></div>");
        m.addClass("messages");
        form_group.append(m);
    }

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    col.append(form_group);
    parent.append(col);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) t.bind(evt, events[evt]);
    });

    return form_group;
}

function textRadioComponentRender(component, parent, props, events = {}, classes = 'col-md-6'){
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);
    form_group.attr('id', prefix_class + component);

    addLabel(component, form_group, props);

    var col_left = $('<div class="col-md-9"></div>');

    var input_group = $('<div></div>');
    input_group.addClass("input-group");

    var t = $('<input />');
    t.addClass('form-control input-xs');
    t.attr('type', 'text');
    t.attr('name', component);
    t.attr('id', component);
    t.attr('required', '');
    t.attr('placeholder', props.placeholder);
    t.val(props.value);

    if(state['validation'].hasOwnProperty(component)) t.addClass('validatable');

    input_group.append(t);

    var a = $('<div></div>');
    a.addClass('input-group-addon');
    a.attr('id', component + '_addon');
    a.html(props.addOn);
    input_group.append(a);

    col_left.append(input_group);

    var col_right = $('<div class="col-md-3"></div>');
    var e = document.createElement('input');
    e.setAttribute('type', 'radio');
    e.classList.add('radio-group-component');
    e.setAttribute('name', 'radio_group_' + props.parent);
    e.id = "radio_group_" + component;
    e.value = component;
    e.addEventListener('click', function(){
        var selected_id = this.id;
        foreach_(document.querySelectorAll('.modular_system_' + props.parent + ' .radio-group-component'), function(index, value) {
            if (value.id == selected_id) {
                foreach_(value.parentElement.parentElement.querySelectorAll('input[type=text]'), function(index,value) { value.disabled = false });
            } else {
                foreach_(value.parentElement.parentElement.querySelectorAll('input[type=text]'), function(index,value) { value.disabled = true });
            }
        });
    });

    col_right.append(e);

    form_group.append(col_left);
    form_group.append(col_right);

    if(state["validation"].hasOwnProperty(component)){
        t.addClass("validatable");
        var m = $("<div></div>");
        m.addClass("messages");
        form_group.append(m);
    }

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    parent.append(form_group);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) t.bind(evt, events[evt]);
    });

    return form_group;
}

function switchComponentRender(component, parent, props, events = {}, classes = 'col-md-3'){
    var col = $('<div></div>');
    col.addClass((props.hasOwnProperty('col_class'))? props.col_class : classes);
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);
    form_group.attr('id', prefix_class + component);
    form_group.css('width', '100%');
    form_group.css('min-height', '30px');

    var label_span = $('<span></span>')

    var form_group_label = $('<div></div>');
    form_group_label.addClass('checkbox-inline checkbox-left checkbox-switchery switchery-sm');

    form_group_label.css('padding', '10px 0px');
    form_group_label.css('margin-bottom', '40px');
    label_span.html(props.label);
    label_span.css('margin:10px');
    form_group.append(label_span);
    if(props.hasOwnProperty('hint')){
        append_modal(form_group, component, props.hint['title'], props.hint['text']);
        label_span.addClass(props.hint['css']);
        console.log(component);
        label_span.on('click', function(){
            $('#hint_'+component).modal('show');
        });
    }

    form_group.append('<br>');

    var s = $('<input />', { type: 'checkbox', id: props.prefix_id + component, name: props.prefix_id + component, value: props.value });
    s.addClass('switchery-primary');
    if(props.hasOwnProperty('checked') && props.checked == true) {
        s.prop('checked', true); 
        setProp(component, 'value', 'true');
    }else{ 
        s.prop('checked', false);
        setProp(component, 'value', 'false');
    }
    form_group_label.append(s);
    form_group.append(form_group_label);

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    col.append(form_group);
    parent.append(col);
    
    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) s.bind(evt, events[evt]);
    });

    return form_group;
}

function selectComponentRender(component, parent, props, events = {}, classes = 'col-md-3'){
    var col = $('<div></div>');
    col.addClass((props.hasOwnProperty('col_class'))? props.col_class : classes);
    var form_group = $('<div></div>');
    form_group.addClass('form-group ' + component);
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.attr('id', prefix_class + component);
    form_group.css('margin-bottom', '40px');            
    form_group.css('width', '100%');

    addLabel(component, form_group, props);

    var input_group = $('<div></div>');
    input_group.addClass("input-group");
    input_group.css('width', '100%');
    var s = $('<select></select>');
    s.addClass('form-control select-size-xs select');
    s.attr("name", component);
    s.attr("id", component);
    s.css("width", "100%");

    if(props.hasOwnProperty('attributed_options')){
        Object.keys(props.attributed_options).forEach(function (i) {
            var o = $('<option></option>');
            o.val(i);
            o.html(props.attributed_options[i].html);
            Object.keys(props.attributed_options[i].attrs).forEach(function (attr_key) {
                o.attr(attr_key, props.attributed_options[i].attrs[attr_key]);
            });
            s.append(o);
        });
        s.addClass('select-search');
        if(props.hasOwnProperty('value')){
            var v = props.value;
            if(props.attributed_options.hasOwnProperty(v)) {
                s.val(v).change();
            }
        }
    }else{
        var selected_options_keys = Object.keys(props.options).sort(
            function(a, b){
                var int_a = 0; var int_b = 0;
                if(a != '' && parseInt(a) != NaN) int_a = parseInt(a);
                if(b != '' && parseInt(b) != NaN) int_b = parseInt(b);
                return int_a - int_b;
            }
        );
        selected_options_keys.forEach(function (i) {
            var o = $('<option></option>');
            o.val(i);
            o.html(props.options[i]);
            s.append(o);
        });    
        if(props.hasOwnProperty('value')){
            var v = props.value;
            if(props.options.hasOwnProperty(v)) {
                s.val(v).change();
            }
        }
    }

    input_group.append(s);

    if(props.hasOwnProperty('addOn')){
        var a = $('<div></div>');
        a.addClass('input-group-addon');
        a.attr('id', component + '_addon');
        a.html(props.addOn);
        input_group.append(a);
    }

    form_group.append(input_group);

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    col.append(form_group);
    parent.append(col);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) s.bind(evt, events[evt]);
    });

    if(props.hasOwnProperty('minimumResultsForSearch')){
        s.select2({ minimumResultsForSearch: props.minimumResultsForSearch });
    }

    s.select2({
        minimumResultsForSearch : Infinity,
        containerCssClass : 'select-xs'
    });

    return form_group;
}

function selectParameterRender(component, parent, props, events = {}, classes = ''){
    var col = $('<div></div>');
    col.addClass((props.hasOwnProperty('col_class'))? props.col_class : classes);
    var form_group = $('<div></div>');
    form_group.addClass('form-group ' + component);
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.attr('id', prefix_class + component);
    form_group.css('margin-bottom', '40px');            
    form_group.css('width', '100%');

    addLabel(component, form_group, props);//, ['col-sm-6', 'text-right']);

    var s = $('<select></select>');
    s.addClass('form-control select-size-xs select');
    s.attr("name", component);
    s.attr("id", component);
    s.css("width", "100%");

    if(props.hasOwnProperty('attributed_options')){
        Object.keys(props.attributed_options).forEach(function (i) {
            var o = $('<option></option>');
            o.val(i);
            o.html(props.attributed_options[i].html);
            Object.keys(props.attributed_options[i].attrs).forEach(function (attr_key) {
                o.attr(attr_key, props.attributed_options[i].attrs[attr_key]);
            });
            s.append(o);
        });
        s.addClass('select-search');
        if(props.hasOwnProperty('value')){
            var v = props.value;
            if(props.attributed_options.hasOwnProperty(v)) {
                s.val(v).change();
            }
        }
    }else{
        var selected_options_keys = Object.keys(props.options).sort(
            function(a, b){
                var int_a = 0; var int_b = 0;
                if(a != '' && parseInt(a) != NaN) int_a = parseInt(a);
                if(b != '' && parseInt(b) != NaN) int_b = parseInt(b);
                return int_a - int_b;
            }
        );
        selected_options_keys.forEach(function (i) {
            var o = $('<option></option>');
            o.val(i);
            o.html(props.options[i]);
            s.append(o);
        });    
        if(props.hasOwnProperty('value')){
            var v = props.value;
            if(props.options.hasOwnProperty(v)) {
                s.val(v).change();
            }
        }
    }

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    form_group.append(s);
    col.append(form_group);

    parent.append(col);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) s.bind(evt, events[evt]);
    });

    s.select2({
        minimumResultsForSearch : Infinity,
        containerCssClass : 'select-xs'
    });

    return form_group;
}

function selectParameterRender2(component, parent, props, events = {}, classes = ''){
    var col = $('<div></div>');
    col.addClass((props.hasOwnProperty('col_class'))? props.col_class : classes);
    var form_group = $('<div></div>');
    form_group.addClass('form-group ' + component);
    form_group.attr('id', ((props.hasOwnProperty('prefix_class'))? props.prefix_class : '') + component);
    form_group.css('margin-bottom', '40px');            
    form_group.css('width', '100%');

    addLabel(component, form_group, props, ['col-sm-6', 'text-right']);

    var s = $('<select></select>');
    s.addClass('form-control select-size-xs select');
    s.attr("name", component);
    s.attr("id", component);
    s.css("width", "100%");

    if(props.hasOwnProperty('attributed_options')){
        Object.keys(props.attributed_options).forEach(function (i) {
            var o = $('<option></option>');
            o.val(i);
            o.html(props.attributed_options[i].html);
            Object.keys(props.attributed_options[i].attrs).forEach(function (attr_key) {
                o.attr(attr_key, props.attributed_options[i].attrs[attr_key]);
            });
            s.append(o);
        });
        s.addClass('select-search');
        if(props.hasOwnProperty('value')){
            var v = props.value;
            if(props.attributed_options.hasOwnProperty(v)) {
                s.val(v).change();
            }
        }
    }else{
        var selected_options_keys = Object.keys(props.options).sort(
            function(a, b){
                var int_a = 0; var int_b = 0;
                if(a != '' && parseInt(a) != NaN) int_a = parseInt(a);
                if(b != '' && parseInt(b) != NaN) int_b = parseInt(b);
                return int_a - int_b;
            }
        );
        selected_options_keys.forEach(function (i) {
            var o = $('<option></option>');
            o.val(i);
            o.html(props.options[i]);
            s.append(o);
        });    
        if(props.hasOwnProperty('value')){
            var v = props.value;
            if(props.options.hasOwnProperty(v)) {
                s.val(v).change();
            }
        }
    }

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    var wrapper_select = $('<div></div>');
    wrapper_select.addClass('input-group col-sm-6');
    wrapper_select.append(s);
    wrapper_select.css("padding-left", "10px");

    form_group.append(wrapper_select);
    col.append(form_group);

    parent.append(col);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) s.bind(evt, events[evt]);
    });

    s.select2({
        minimumResultsForSearch : Infinity,
        containerCssClass : 'select-xs'
    });

    return form_group;
}

function parameterizedComponentRender(component, parent, props, events = {}, classes = 'thin-border'){
    var c = componentByName(component);
    var form_group;

    if(c != null) {
        var f = castFunction(c.ownRender);
        form_group = f(component, parent, props, events);

        classes = props.hasOwnProperty('classes')? props.classes : classes;
        classes.split(' ').forEach(function(class_) {
            if (!form_group.parent().hasClass(class_)) form_group.parent().addClass(class_);
        });

        var p = $('<div></div>');
        p.attr('id', 'params_' + component);
        p.css('margin-top', '10px');

        var comps = props.param_components;
        renderComponents(comps[props.value], p);

        form_group.append(p);

        var s = $('#' + component);
        Object.keys(events).forEach(function(evt) {
            if(events.hasOwnProperty(evt)) s.bind(evt, events[evt]);
        });

    }

    return form_group;
}

function textParameterRender(component, parent, props, events = {}, classes = ''){
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);

    addLabel(component, form_group, props, ['col-sm-6', 'text-right']);

    var input_group = $('<div></div>');
    input_group.addClass("input-group col-sm-6");
    input_group.css("padding-left", "10px");

    var t = document.createElement('input');
    t.classList.add('form-control');
    t.classList.add('input-xs');
    t.setAttribute('name', component);
    t.setAttribute('id', component);
    t.setAttribute('required', '');
    t.setAttribute('placeholder', props.placeholder);
    t.value = props.value;

    if(state['validation'].hasOwnProperty(component)){
        t.classList.add('validatable');
    }

    input_group.append(t);

    var a = document.createElement('div');
    a.classList.add('input-group-addon');
    a.setAttribute('id', component + '_addon');
    a.innerHTML = props.addOn;
    input_group.append(a);

    form_group.append(input_group);

    if(state["validation"].hasOwnProperty(component)){
        t.classList.add('validatable');
        var m = document.createElement('div');
        m.classList.add('messages');
        form_group.append(m);
    }

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    parent.append(form_group);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) t.addEventListener(evt, events[evt]);
    });

}

function textParameterRender2(component, parent, props, events = {}, classes = ''){
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);

    addLabel(component, form_group, props);

    var input_group = $('<div></div>');
    input_group.addClass("input-group");
    input_group.css("width", "150px");

    var t = document.createElement('input');
    t.classList.add('form-control');
    t.classList.add('input-xs');
    t.setAttribute('name', component);
    t.setAttribute('id', component);
    t.setAttribute('required', '');
    t.setAttribute('placeholder', props.placeholder);
    t.value = props.value;

    if(state['validation'].hasOwnProperty(component)){
        t.classList.add('validatable');
    }

    input_group.append(t);

    var a = document.createElement('div');
    a.classList.add('input-group-addon');
    a.setAttribute('id', component + '_addon');
    a.innerHTML = props.addOn;
    input_group.append(a);

    form_group.append(input_group);

    if(state["validation"].hasOwnProperty(component)){
        t.classList.add('validatable');
        var m = document.createElement('div');
        m.classList.add('messages');
        form_group.append(m);
    }

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    parent.append(form_group);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) t.addEventListener(evt, events[evt]);
    });

}

function switchParameterRender(component, parent, props, events = {}, classes = 'col-md-3'){
    var col = $('<div></div>');
    col.addClass((props.hasOwnProperty('col_class'))? props.col_class : classes);

    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);
    form_group.attr('id', prefix_class + component);
    form_group.css('width', '100%');
    form_group.css('min-height', '30px');

    addLabel(component, form_group, props, ['col-sm-6', 'text-right'], 'div');

    var s = $('<input />', { type: 'checkbox', id: props.prefix_id + component, name: props.prefix_id + component, value: props.value });
    
    s.addClass('switchery-primary');
    s.addClass('col-sm-6');
    s.attr('data-switchery', "true");

    if(props.hasOwnProperty('checked') && props.checked == true) {
        s.prop('checked', true); 
        setProp(component, 'value', 'true');
    }else{ 
        s.prop('checked', false);
        setProp(component, 'value', 'false');
    }

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) s.bind(evt, events[evt]);
    });

    //s_wrapper.append(s);

    form_group.append(s);

    if(props.hasOwnProperty('alert_box')){
        append_alert_box(form_group, component, props.alert_box['class'], props.alert_box['text']);
    }

    col.append(form_group);

    parent.append(col);

    return form_group;
}

function autocompleteComponentRender(component, parent, props, events = {}, classes = 'col-md-3'){
    var col = $('<div></div>');
    col.addClass((props.hasOwnProperty('col_class'))? props.col_class : classes);
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);
    form_group.attr('id', prefix_class + component);

    addLabel(component, form_group, props);

    var input_group = $('<div></div>');
    input_group.addClass("input-group autocomplete");

    var t = $('<input />');
    t.addClass('form-control input-xs');
    t.attr('name', component);
    t.attr('id', component);
    t.attr('required', '');
    t.attr('placeholder', props.placeholder);
    t.val(props.value);
    t.attr('data-location');

    var currentFocus;
    function addActive(x) {
        if (!x) return false;
        for (var i = 0; i < x.length; i++) x[i].classList.remove("autocomplete-active");
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        var inp = document.getElementById(component);
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    t.bind("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("div");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        var data = {
            query : val
        };

        $.ajax({
            url: props.url,
            type: 'POST',
            data: data,
            beforeSend: function(){
                setProp(component, 'value', null);
            },
            success: function (response) {
                if (response) {
                    for (i = 0; i < response.length; i++) {
                        b = document.createElement("div");
                        var s = response[i].country + ' ' + response[i].city;
                        var pos = s.indexOf(val);
                        b.innerHTML = s.substr(0, pos);
                        b.innerHTML += "<strong>" + s.substr(pos, val.length) + "</strong>";
                        b.innerHTML += s.substr(pos + val.length);
                        b.innerHTML += "<input type='hidden' value='" + s + "' data-location='" + JSON.stringify(response[i]) + "'>";
                        b.addEventListener("click", function(e) {
                            t.val(this.getElementsByTagName("input")[0].value);
                            setProp(component, 'value', JSON.parse(this.getElementsByTagName("input")[0].getAttribute('data-location')));
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                } else {
                    setProp(component, 'value', null);
                }
            },
            error :function( jqXhr ) {
                setProp(component, 'value', null);
            }
        });
    });

    t.bind("keydown", function(e) {
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                    currentFocus++;
                    addActive(x);
                } else if (e.keyCode == 38) { 
                    currentFocus--;
                    addActive(x);
                } else if (e.keyCode == 13) {
                    e.preventDefault();
                    if (currentFocus > -1) {
                        if (x) x[currentFocus].click();
                    }
                }
    });

    input_group.append(t);
    form_group.append(input_group);
    col.append(form_group);
    parent.append(col);

    return form_group;
}

function componentByName(component){
    var results = state['components'].filter(i => {
        return i.component === component;
    });
    if(results[0] !== undefined) return results[0];
    return null;
}

function setProp(component, key, value){
    var c = componentByName(component);
    if(c != null) c['props'][key] = value;
}

function getProp(component, key){
    var c = componentByName(component);
    if(c != null) return c['props'][key];
}

function renderComponent(componentName, parent){
    var c = componentByName(componentName);
    if(c != null) {
        var f = castFunction(c.handler);
        f(componentName, parent, c.props, c.events);
    }
}

function renderComponents(componentsBlock, parent){
    if(Array.isArray(componentsBlock)) {
        componentsBlock.forEach(function (componentName) {
            renderComponent(componentName, parent);
        });
    }
}

function get_nested_component(nestedArray, keyArray, nestedLevel){
    if(keyArray.length > nestedLevel + 1){
        return get_nested_component(nestedArray[keyArray[nestedLevel]], keyArray, nestedLevel + 1);
    } else {
        return nestedArray[keyArray[nestedLevel]];
    }
}

function onChangeSelectDefaultHandler(){
    var value = $('#' + this.id + ' option:selected').val();
    setProp(this.id, 'value', value);
}

function onChangeSwitcherDefaultHandler(){
    var checked = $('#' + this.id).prop('checked');
    if(checked){
        setProp(this.id, 'value', "true");
    }else{
        setProp(this.id, 'value', "false");
    }
}

function onChangeInputDefaultHandler(){
    if(this.type == 'text'){
        setProp(this.id, 'value', this.value);
    }
    if(this.classList.contains('validatable')){
        var form = document.querySelector("#modular_system_calculator");
        var errors = validate(form, state['validation']) || {};
        showErrorsForInput(this, errors[this.name]);
    }
}

/// Validation
function showErrors(form, errors) {
    Array.prototype.slice.call(form.querySelectorAll(".validatable")).forEach(function(input) {
        showErrorsForInput(input, errors && errors[input.name]);
    });
}

function showErrorsForInput(input, errors) {
    var formGroup = closestParent(input.parentNode, "form-group");
    var messages = formGroup.querySelector(".messages");
    resetFormGroup(formGroup);
    if(errors){
        formGroup.classList.add("has-error");
        Array.prototype.slice.call(errors).forEach(function(error){
            addError(messages, error);
        });
    }else{
        formGroup.classList.add("has-success");
    }
}

function closestParent(child, className) {
    if (!child || child === document) {
        return null;
    }
    if (child.classList.contains(className)) {
        return child;
    } else {
        return closestParent(child.parentNode, className);
    }
}

function resetFormGroup(formGroup) {
    formGroup.classList.remove("has-error");
    formGroup.classList.remove("has-success");
    Array.prototype.slice.call(formGroup.querySelectorAll(".help-block.error")).forEach(function(el) {
        el.parentNode.removeChild(el);
    });
}

function addError(messages, error) {
    var block = document.createElement("p");
    block.classList.add("help-block");
    block.classList.add("error");
    block.innerText = error;
    messages.appendChild(block);
}

function addLabel(component, form_group, props, classes = [], label_tag_class = 'label'){
    var label = document.createElement(label_tag_class);
    label.innerHTML = props.label;
    label.classList.add('control-label');
    label.setAttribute('for', component);

    var form_group_label = document.createElement('div');
    classes.forEach(c => {form_group_label.classList.add(c);})
    form_group_label.append(label);

    form_group.append(form_group_label);
    addHintModal(label, component, props);
}

function addHintModal(label, component, props){ 
    if(props.hasOwnProperty('hint')){
        // Appending modal
        let m = document.createElement('div');
        m.classList.add('modal');
        m.classList.add('fade');
        m.setAttribute('tabindex', '-1');
        m.setAttribute('role', 'dialog');
        m.setAttribute('aria-labelledby', 'exampleModalLabel');
        m.setAttribute('aria-hidden', 'true');
        m.setAttribute('id', 'hint_' + component);
        let d = document.createElement('div');
        d.classList.add('modal-dialog');
        d.setAttribute('role', 'document');

        let c = document.createElement('div');
        c.classList.add('modal-content');
        let h = document.createElement('div');
        h.classList.add('modal-header');
        let t = document.createElement('h5'); 
        t.classList.add('modal-title');
        t.setAttribute('id', 'exampleModalLabel');
        t.innerHTML = props.hint['title'];
        h.append(t);
        let bu = document.createElement('button');
        bu.setAttribute('type', 'button');
        bu.classList.add('close');
        bu.setAttribute('data-dismiss', 'modal');
        bu.setAttribute('aria-label', 'Close');
        let s = document.createElement('span');
        s.setAttribute('aria-hidden', 'true');
        s.innerHTML = '&times;';
        bu.append(s);
        h.append(bu);
        let b = document.createElement('div');
        b.classList.add('modal-body');
        b.innerHTML = props.hint['text'];
        c.append(h);
        c.append(b);
        d.append(c);
        m.append(d);
        label.parentNode.parentNode.insertBefore(m, label.parentNode);
        label.classList.add(props.hint['css']);
        label.addEventListener('click', function(){
            $('#hint_' + component).modal('show');
        });
    }
}

function append_modal(parent, component, title, text){
    var m = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">');
    m.attr('id', 'hint_' + component);
    var d = $('<div class="modal-dialog" role="document">');
    var c = $('<div class="modal-content">');
    var h = $('<div class="modal-header">');
    var t = $('<h5 class="modal-title" id="exampleModalLabel"></h5>');
    t.html(title);
    h.append(t);
    var bu = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>');
    var s = $('<span aria-hidden="true">&times;</span>');
    bu.append(s);
    h.append(bu);
    var b = $('<div class="modal-body">');
    b.html(text);
    c.append(h);
    c.append(b);
    d.append(c);
    m.append(d);
    parent.append(m);
}

function append_alert_box(parent, component, class_, text){
    var m = $('<div class="alert alert-styled-left alert-bordered help-block">');
    m.attr('id', 'alert_box_' + component);
    m.addClass(class_);
    m.html(text);
    parent.append(m);
}

function addStyles(){
    var css = 
        '.radio-group-component{-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:50%;width:20px;height:20px;border:1px solid #999;transition:0.2s all linear;outline:none;margin-right:5px;position:relative;} '+
        '.radio-group-component:checked{border:10px solid #0070b9;} ' +
        '.thin-border{border-left: 6px solid rgba(0, 112, 185, 0.3);background-color: rgba(235, 235, 235, 0.3);border-radius: 10px;padding: 10px;margin-bottom: 8px;} ' +
        '.hint-modal{ background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKdGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4NzJlNDFmNC0zMzAzLTZmNDEtYTc4OS00ZmY3NmVjMDBmYzMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4ZGNjMjEwZi0yMjI1LWVhNDItOTM3Zi0zMzU3ZWE1ODdlNjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YTM5MDM1ODUtNTM3Mi00MDQ2LWFjMDEtMzBkNzJjNDIzNjczIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDItMDNUMDg6MTY6NTMrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTAyLTAzVDA4OjIxOjIzKzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTAyLTAzVDA4OjIxOjIzKzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YzBkMDUxZDMtYThlYy04YzRlLTk1NjQtNDA2MDNhODgxNzk2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBhMjlmYTg2LTNkN2QtMTM0YS05YmNmLTJiNDYxOTgzY2MwNSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjg3MmU0MWY0LTMzMDMtNmY0MS1hNzg5LTRmZjc2ZWMwMGZjMyIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNGVjYjU3MC0wMzc0LWEzNDgtOTFhMi01NWY3MWIzZjEyZDYiIHN0RXZ0OndoZW49IjIwMjEtMDItMDNUMDg6MjE6MTErMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MGEyOWZhODYtM2Q3ZC0xMzRhLTliY2YtMmI0NjE5ODNjYzA1IiBzdEV2dDp3aGVuPSIyMDIxLTAyLTAzVDA4OjIxOjExKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMwZDA1MWQzLWE4ZWMtOGM0ZS05NTY0LTQwNjAzYTg4MTc5NiIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0wM1QwODoyMToyMyswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMzkwMzU4NS01MzcyLTQwNDYtYWMwMS0zMGQ3MmM0MjM2NzMiIHN0RXZ0OndoZW49IjIwMjEtMDItMDNUMDg6MjE6MjMrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ZmCT2AAAB6UlEQVQ4ja2TsY7TQBCGZ/eyXp3Plm3aVOcCIdLQUyFRhJICniDAI8Aj8ACHRKTwAod0NBSH7uioEIjmoLCliEQb2YUl24oNG+95hgKIkktSwV+tNP83M5rZYUQEq1osFjfLshxUVXXPGHMIACCEGDuOc+p53khK+W0NICIgIkBEK03ToyiK2izLSGtNiEiISFpryrKMoihqkyR5iYj7f7klPJ1Oz5RS1LYt7VLbtqSUoslk8h4RrWWCNE1fKKV2glellKI0TY+ICEBr3Yvj+HK18rFq6O6HOcFJTnCSU/iupGPVrHUSx/Gl1rrHy7Ic+L6/xzlfzmVcIzzoWkD3fTi77cC4Rnj29ecyzjmHIAj2yrIcdKqq6ne73bXBPr0ul+/c/N5SeMDXPI7jwGw263NjTGhZFmzT65mBhx9rCA84DG/ZazHLssAYE3a2kn8qP/nyAwLB4NMdFwLBNtbPGGs6Qohx0zQ3pJQbSR4fWhAIvgEDABhjQAgx6TiOczqfzzcSBILB897+rgahqiqwbfuce573qiiKFhHXDJ+LFtibAq69LTdgRIQ8z1vf90dcSnnhuu4wSZKd1a4qSRJwXXcopbz4P1/5X46JbTnnXlEUj+q67htjQsZYI4T4btv2ue/7Iynlxar/F0Sd3PwpfgJCAAAAAElFTkSuQmCC\');padding-right:18px;cursor: pointer;background-repeat: no-repeat; background-position: top right;}',
    css = css + ' .autocomplete {position: relative; display: inline-block; width: 100%} ' +
        '.autocomplete-items {position: absolute; border: 1px solid #d4d4d4; border-bottom: none; border-top: none; z-index: 99; top: 100%; left: 0; right: 0;} ' +
        '.autocomplete-items div {padding: 10px; cursor: pointer; background-color: #fff; border-bottom: 1px solid #d4d4d4; } ' +
        '.autocomplete-items div:hover {background-color: #e9e9e9; } ' +
        '.autocomplete-active {background-color: DodgerBlue !important; color: #ffffff;} ';
    style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head = document.head || document.getElementsByTagName('head')[0],
    head.appendChild(style);
}

addStyles();