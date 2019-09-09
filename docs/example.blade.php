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
        .thin-border {
            border-left: 6px solid rgba(0, 112, 185, 0.3);
            background-color: rgba(235, 235, 235, 0.3);
            border-radius: 10px;
            padding: 10px;
        }
    </style>
    <script>

        var state = {
            components: [
                first_component : [
                    handler : ,
                    props : { 
                        value : "hello!"
                    }
                ],
                second_component : [

                ]
            ],
            validation: [
                first_component : {},
                second_component : {
                    presence: true   
                }
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