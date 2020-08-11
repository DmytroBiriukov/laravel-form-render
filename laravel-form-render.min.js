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
        case "selectParameterRender":
            f = selectParameterRender;
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

function ParseInt(value){
    var parsed = parseInt(value);
    if(isNaN(parsed)) return 0;
    return parsed;
}

function emptyComponentRender(component, parent, props, events = {}) {
    var col = $('<div></div>');
    col.addClass('col-md-2');
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
    col.addClass(classes);
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);
    form_group.attr('id', prefix_class + component);
    var form_group_label = $('<label></label>');
    form_group_label.addClass('control-label');
    if(props.hasOwnProperty('hint')){
        append_modal(form_group, component, props.hint['title'], props.hint['text']);
        form_group_label.addClass( props.hint['css'] );
        form_group_label.on('click', function(e){
            $('#hint_'+component).modal('show');
        });
    }
    form_group_label.html( props.label );
    form_group_label.attr('for', component);
    form_group.append(form_group_label);

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

    col.append(form_group);
    parent.append(col);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) t.bind(evt, events[evt]);
    });

    return form_group;
}

function switchComponentRender(component, parent, props, events = {}, classes = 'col-md-3'){
    var col = $('<div></div>');
    col.addClass(classes);
    var form_group = $('<div></div>');
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.addClass('form-group ' + prefix_class + component);
    form_group.attr('id', prefix_class + component);
    form_group.css('width', '100%');
    form_group.css('min-height', '30px');

    var label_span = $('<span></span>')
    if(props.hasOwnProperty('hint')){
        append_modal(form_group, component, props.hint['title'], props.hint['text']);
        label_span.addClass( props.hint['css'] );
        label_span.on('click', function(e){
            $('#hint_'+component).modal('show');
        });
    }else{
        form_group_label.css('margin-bottom', '40px');
    }
    
    label_span.html(props.label);
    form_group.append(label_span);

    var form_group_label = $('<label></label>');
    form_group_label.addClass('checkbox-inline checkbox-left checkbox-switchery switchery-sm');

    var s = $('<input />', { type: 'checkbox', id: props.prefix_id + component, value: props.value });
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

    col.append(form_group);
    parent.append(col);
    
    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) s.bind(evt, events[evt]);
    });

    return form_group;
}

function selectComponentRender(component, parent, props, events = {}, classes = 'col-md-3'){
    var col = $('<div></div>');
    col.addClass(classes);
    var form_group = $('<div></div>');
    form_group.addClass('form-group ' + component);
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.attr('id', prefix_class + component);
    form_group.css('margin-bottom', '40px');            
    form_group.css('width', '100%');

    var form_group_label = $('<label></label>');
    form_group_label.addClass('control-label');
    if(props.hasOwnProperty('hint')){
        append_modal(form_group, component, props.hint['title'], props.hint['text']);
        form_group_label.addClass( props.hint['css'] );
        form_group_label.on('click', function(e){
            $('#hint_'+component).modal('show');
        });
    }
    form_group_label.html( props.label );
    form_group.append(form_group_label);

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
    col.addClass(classes);
    var form_group = $('<div></div>');
    form_group.addClass('form-group ' + component);
    var prefix_class = (props.hasOwnProperty('prefix_class'))? props.prefix_class : '';
    form_group.attr('id', prefix_class + component);
    form_group.css('margin-bottom', '40px');            
    form_group.css('width', '100%');
    var form_group_label = $('<label></label>');
    form_group_label.addClass('control-label');
    if(props.hasOwnProperty('hint')){
        append_modal(form_group, component, props.hint['title'], props.hint['text']);
        form_group_label.addClass( props.hint['css'] );
        form_group_label.on('click', function(e){
            $('#hint_'+component).modal('show');
        });
    }
    form_group_label.html( props.label );
    form_group.append(form_group_label);
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

function parameterizedComponentRender(component, parent, props, events = {}, classes = ''){
    var c = componentByName(component);
    var form_group;

    if(c != null) {
        var f = castFunction(c.ownRender);
        form_group = f(component, parent, props, events);

        // do smth with form_group style
        form_group.parent().addClass("thin-border");

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
    var form_group_label = $('<label></label>');
    form_group_label.addClass('col-sm-6 text-right control-label');
    if(props.hasOwnProperty('hint')){
        append_modal(form_group, component, props.hint['title'], props.hint['text']);
        form_group_label.addClass( props.hint['css'] );
        form_group_label.on('click', function(e){
            $('#hint_'+component).modal('show');
        });
    }
    form_group_label.html( props.label );
    form_group_label.attr('for', component);
    form_group.append(form_group_label);

    var input_group = $('<div></div>');
    input_group.addClass("input-group col-sm-6");

    var t = $('<input />');
    t.addClass('form-control input-xs');
    t.attr('name', component);
    t.attr('id', component);
    t.attr('required', '');
    t.attr('placeholder', props.placeholder);
    t.val(props.value);

    if(state["validation"].hasOwnProperty(component)){
        t.addClass("validatable");
    }

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

    parent.append(form_group);

    Object.keys(events).forEach(function(evt) {
        if(events.hasOwnProperty(evt)) t.bind(evt, events[evt]);
    });

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
//            console.log( getProp(this.id, 'value') );
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