document.querySelectorAll('input').forEach(input => {
    // Check if autocomplete is off
    if (input.getAttribute('autocomplete') === 'off') {
        input.setAttribute('autocomplete', 'on');
    }
});