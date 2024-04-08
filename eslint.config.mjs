import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      'no-empty': 'warn', // disallow empty block statements (no-empty)
      'no-console': 'off', // Removed rule 'disallow the use of console' from recommended eslint rules
      'no-unused-vars': 'off', // Removed rule 'disallow unused variables' from recommended eslint rules
      'no-mixed-spaces-and-tabs': 'off', // Removed rule 'disallow mixed spaces and tabs for indentation' from recommended eslint rules
      'no-undef': 'off',

      'no-template-curly-in-string': 'warn', // Warn against template literal placeholder syntax in regular strings
      'consistent-return': 'warn', // Warn if return statements do not either always or never specify values
      'array-callback-return': 'warn', // Warn if no return statements in callbacks of array methods
      'eqeqeq': 'error', // Require the use of === and !==
      'no-alert': 'off', // Disallow the use of alert, confirm, and prompt
      'no-caller': 'error', // Disallow the use of arguments.caller or arguments.callee
      'no-eq-null': 'error', // Disallow null comparisons without type-checking operators
      'no-eval': 'error', // Disallow the use of eval()
      'no-extend-native': 'warn', // Warn against extending native types
      'no-extra-bind': 'warn', // Warn against unnecessary calls to .bind()

      'no-extra-label': 'warn', // Warn against unnecessary labels
      'no-floating-decimal': 'error', // Disallow leading or trailing decimal points in numeric literals
      'no-implicit-coercion': 'warn', // Warn against shorthand type conversions
      'no-loop-func': 'warn', // Warn against function declarations and expressions inside loop statements
      'no-new-func': 'error', // Disallow new operators with the Function object
      'no-new-wrappers': 'warn', // Warn against new operators with the String, Number, and Boolean objects
      'no-throw-literal': 'error', // Disallow throwing literals as exceptions    
      'prefer-promise-reject-errors': 'error', // Require using Error objects as Promise rejection reasons
      'for-direction': 'error', // Enforce “for” loop update clause moving the counter in the right direction
      'getter-return': 'error', // Enforce return statements in getters
      'no-await-in-loop': 'warn', // Disallow await inside of loops
      'no-compare-neg-zero': 'error', // Disallow comparing against -0
      'no-catch-shadow': 'warn', // Warn against catch clause parameters from shadowing variables in the outer scope
      'no-shadow-restricted-names': 'error', // Disallow identifiers from shadowing restricted names
      'callback-return': 'error', // Enforce return statements in callbacks of array methods
      'handle-callback-err': 'error', // Require error handling in callbacks
      'no-path-concat': 'warn', // Warn against string concatenation with __dirname and __filename
      'prefer-arrow-callback': 'warn'
    }
  },
  // // overrides for test files
  // {
  //   files: ['*-test.js','*.spec.js'],
  //   rules: {
  //     'no-unused-expressions': 'off'
  //   }
  // }
];
