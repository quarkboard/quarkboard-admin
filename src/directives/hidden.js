import Vue from 'vue';

// Extract the function out, up here, so I'm not writing it twice
const hidden = (el, binding) =>
    (el.style.visibility = binding.value ? 'hidden' : '');

/**
 * Hides an HTML element, keeping the space it would have used if it were visible (css: Visibility)
 */
Vue.directive('hidden', {
    // Run on initialisation (first render) of the directive on the element
    bind: hidden,

    // Run on subsequent updates to the value supplied to the directive
    update: hidden,
});
