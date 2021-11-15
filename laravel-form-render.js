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

    var form_group_label = $('<label></label>');
    form_group_label.addClass('checkbox-inline checkbox-left checkbox-switchery switchery-sm');

    form_group_label.css('padding', '10px 0px');
    form_group_label.css('margin-bottom', '40px');
    label_span.html(props.label);
    label_span.css('margin:10px');
    form_group.append(label_span);
    if(props.hasOwnProperty('hint')){
        append_modal(form_group, component, props.hint['title'], props.hint['text']);
        var hint_modal_span = document.createElement('span');
        hint_modal_span.innerHTML = '?';
        hint_modal_span.classList.add(props.hint['css']);
        hint_modal_span.addEventListener('click', function(){
            $('#hint_'+component).modal('show');
        });
        form_group.append(hint_modal_span);
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

    addLabel(component, form_group, props, ['col-sm-6', 'text-right']);

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

function addLabel(component, form_group, props, classes = []){
    var label = document.createElement('label');
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

        var hint_modal_span = document.createElement('span');
        hint_modal_span.innerHTML = '?';
        hint_modal_span.classList.add(props.hint['css']);
        hint_modal_span.addEventListener('click', function(){
            $('#hint_' + component).modal('show');
        });
        label.parentNode.insertBefore(hint_modal_span, label.nextSibling);
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
        '.hint-modal{background-color:#fff;border:1px solid #D5D5D5;border-radius:50%;color:#3DB2FF;cursor:pointer;font-size:12px;font-weight:500;height:18px;opacity:1.0;width:18px;padding-left:5px;padding-right:5px;margin-left:8px;} ',
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