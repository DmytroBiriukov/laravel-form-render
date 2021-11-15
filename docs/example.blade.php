@extends('frontend.layouts.app')

@section('content')

                {{ Form::open(['role' => 'form', 'method' => 'post',
                        'id' => 'modular_system_calculator','autocomplete' => 'off']) }}
                    <div id="form_components">
                    </div>
                {{ Form::close() }}                                
@endsection

@section('after-scripts')
    <script type="text/javascript" src="{{ asset('js/frontend/validate.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/frontend/laravel-form-render.min.js') }}"></script>
    <style>
        .help-block.error {
            margin-bottom: 5px;
        }
    </style>
    <script>

        var state = {
            components: [
                first_component : [
                    handler : selectComponentRender,
                    props : { 
                        value : "Hello!",
                        options : [
                            option_1 : "Hello!",
                            option_2 : "Alloha!",
                            option_3 : "Hey!"
                        ]
                    }
                ],
                second_component : [

                ],
                attributed_select_component : [
                    handler : selectComponentRender,
                    props : {
                        value : "selected_value",
                        attributed_options : [
                            { code : "option_1", attrs : {"attr1" : "attr1_value1", "attr2" : "attr2_value1"} },
                            { code : "option_2", attrs : {"attr1" : "attr1_value2", "attr2" : "attr2_value2"} }
                        ]
                    }
                ]
            ],
            validation: [
                first_component : {},
                second_component : {
                    presence: true   
                },
                attributed_select_component : {}
            ]
        };

        /// Construct form with components
        function construct(){

            state =  JSON.parse('{!! json_encode($data) !!}');

            /// Update customized validation rules            
            if(state['validation'].hasOwnProperty('first_component')){
                state['validation']['first_component'] = firstComponentValidator;
            }

            /// Update customized on change event handlers
            var onChangeHandlers = {
                first_component : onChangeFirst
            };

            state['components'].forEach(function(item){
                if(onChangeHandlers.hasOwnProperty(item.component)){
                    item['events'] = { change : onChangeHandlers[item.component] };
                }else{
                    switch(item.handler){
                        case "selectComponentRender": item['events'] = { change : onChangeSelectDefaultHandler}; break;
                        case "switchComponentRender": item['events'] = { change : onChangeSwitcherDefaultHandler}; break;
                        default: item['events'] = { change : onChangeInputDefaultHandler}; break;
                    }
                }
            });

            var parent = $('#form_components');            

            state['components'].forEach(function(item){
                renderComponent(item.component, parent);
            }
                        
        }

        /// Custom validation rules 
        function firstComponentValidator(){
            /// do some stuff
            /// define validation rule
            return {
                presence: true,
                numericality: {
                    greaterThanOrEqualTo: 0,
                    lessThanOrEqualTo: 100
                }
            };
        }

        /// Custom on change event handlers
        function onChangeFirst(){
            /// do some stuff
            // define new value
            var value_ = 0; 
            setProp('first_component', 'value', value_);
        }

        construct();

    </script>
@endsection