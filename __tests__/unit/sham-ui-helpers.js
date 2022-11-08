import { onclick, oninput } from 'sham-ui-directives';
import renderer, { compileAsSFC } from 'sham-ui-test-helpers';
import { ToggleField, SetField } from '../../src/index';

it( 'toggleField', () => {
    const meta = renderer(
        compileAsSFC( {
            ToggleField,
            Toggler: compileAsSFC`
                <template>
                    <button :onclick={{onClick}}>Toggle!</button>
                </template>
                
                <script>
                    function Toggler( options ) {
                        options( {
                            [ $.onClick ]() {}
                        } );
                    }
                
                    export default Component( Template, Toggler );
                </script>
            `
        } )`
            <template>
                Toggled: {{toggled}}
                <Toggler
                    onClick={{this$.toggleField( $.toggled )}}
                />
            </template>
            
            <script>
                function Dummy( options ) {
                    options( {
                        [ $.toggled ]: false
                    } );
                }

                export default Component( ToggleField, Template, Dummy );
            </script>
        `,
        {},
        {
            directives: {
                onclick
            }
        }
    );

    meta.ctx.container.querySelector( 'button' ).click();
    expect( meta.toJSON() ).toMatchSnapshot();
    expect( meta.component.options.toggled ).toBe( true );

    meta.ctx.container.querySelector( 'button' ).click();
    expect( meta.toJSON() ).toMatchSnapshot();
    expect( meta.component.options.toggled ).toBe( false );
} );

it( 'setField', () => {
    const meta = renderer(
        compileAsSFC( {
            SetField,
            Input: compileAsSFC`
                <template>
                    <input :oninput={{this$.handleInput}} />
                </template>
                
                <script>
                    function Input( options ) {
                        const onChanged = $();
                
                        const state = options( {
                            [ onChanged ]() {}
                        } );
                
                        this$.handleInput = e => state[ onChanged ]( e.target.value );
                    }
                
                    export default Component( Template, Input );
                </script>
            `
        } )`
            <template>
                Value: {{value}}
                <Input
                    onChanged={{this$.setField( $.value )}}
                />
            </template>
            
            <script>
                function Dummy( options ) {
                    options( {
                        [ $.value ]: ''
                    } );
                }

                export default Component( SetField, Template, Dummy );
            </script>
        `,
        {},
        {
            directives: {
                oninput
            }
        }
    );

    function fill( value ) {
        const element = meta.ctx.container.querySelector( 'input' );
        element.value = value;
        element.dispatchEvent( new Event( 'input' ) );
    }

    fill( 'Hi!' );
    expect( meta.toJSON() ).toMatchSnapshot();
    expect( meta.component.options.value ).toBe( 'Hi!' );

    fill( 'Hello!' );
    expect( meta.toJSON() ).toMatchSnapshot();
    expect( meta.component.options.value ).toBe( 'Hello!' );
} );
