# Laravel form component render

JS code to render form components.

## Introduction

* This JS code could be used in Laravel views to render form components

* The controller should pass json with form components description 

* This json should be decoded into state variable (__state)

* Then you have to define function to construct form components (lets say, __constructor), gathering data from the __state

### State variable 

* It contains data about form components (handler, props, value, events)

### Handler

* Handler is a string, that is similar to function identifier for component handler  
* You may define you own handlers (component renders) or use predefined 
* Predefined handlers are following:
- textComponentRender
- switchComponentRender
- selectComponentRender
- parameterizedComponentRender
- textParameterRender
- emptyComponentRender

### Props

* Props are whatever you want to describe component

### Value

* A component value (depending on component type, it could be an input text, selected option id, true/false value of the switcher).

### Events handling

* You may customize event handlers.

* To bind your custom event handler just asign it to state['components'][$component]['events']['change'] = yourCustomEventHandlerFunction

## Dependencies:

* jQuery
* cdnjs.cloudflare.com/ajax/libs/validate.js
* Select2
* Switchery
    
## Author

* **Dmytro Biriukov** -

See also the list of [contributors](https://github.com/dmytro.biriukov/laravel-form-render/contributors) who participated in this project.

## Aknowledgements

* We use [online minifier](https://javascript-minifier.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
