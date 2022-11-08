import { this$ } from 'sham-ui-macro/ref.macro';

/**
 * Add this$.setField helper to component
 * @param {Function} options Component options
 */
export function SetField( options ) {
    const state = options();
    this$.setField = field => value => state[ field ] = value;
}

/**
 * Add this$.toggleField helper to component
 * @param {Function} options Component options
 */
export function ToggleField( options ) {
    const state = options();
    this$.toggleField = field => () => state[ field ] = !state[ field ];
}
