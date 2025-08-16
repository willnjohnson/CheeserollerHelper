// ==UserScript==
// @name         Neopets Cheeseroller Autoplayer
// @namespace    GreaseMonkey
// @version      1.0
// @description  Automatically plays the Cheeseroller game on Neopets.
// @author       @willnjohnson
// @match        *://www.neopets.com/medieval/cheeseroller.phtml
// @grant        none
// ==/UserScript==

// This script is designed to automatically run on the Cheeseroller page.
// It checks the current state of the page (start, in-game, or end) and performs
// the appropriate action.

(function() {
    'use strict';

    // Wait for the document to be fully loaded to ensure all elements are available.
    window.addEventListener('load', function() {
        // --- Game Logic Constants ---
        const TARGET_CHEESE = "Quadruple Fudge Cheese";
        const DIVE_LEFT_VALUE = "4"; // The value for the 'Dive Left' option in the form.

        // --- Selectors for different game states ---
        const cheeseInputSelector = 'input[name="cheese_name"]';
        const buyButtonSelector = 'input[type="submit"][value*="Buy "]';
        const goButtonSelector = 'input[type="submit"][value="GO!!!!"]';
        const actionSelectSelector = 'select[name="cheese_action"]';
        const playAgainButtonSelector = 'input[type="submit"][value="Play Again?"]';

        // Helper function to find and click an element.
        function clickElement(selector) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`Cheeseroller: Clicking element with selector: ${selector}`);
                element.click();
                return true;
            }
            return false;
        }

        // Helper function to set a form value and submit.
        function setAndSubmit(selector, value) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`Cheeseroller: Setting value of ${selector} to '${value}' and submitting.`);
                element.value = value;
                element.form.submit();
                return true;
            }
            return false;
        }

        // --- Main Autoplay Loop ---
        // This function orchestrates the gameplay by checking the page state.
        function startAutomation() {
            // State 1: In the middle of the race, 'cheese_action' dropdown is visible.
            const actionSelect = document.querySelector(actionSelectSelector);
            if (actionSelect) {
                // Find the 'Dive Left' option and select it.
                const diveLeftOption = actionSelect.querySelector(`option[value="${DIVE_LEFT_VALUE}"]`);
                if (diveLeftOption) {
                    actionSelect.value = DIVE_LEFT_VALUE;
                    // Find and click the 'Go!' submit button.
                    const submitButton = actionSelect.form.querySelector('input[type="submit"]');
                    if (submitButton) {
                        submitButton.click();
                        console.log("Cheeseroller: Chose 'Dive Left' and submitted form.");
                        return; // Action taken, exit.
                    }
                }
            }

            // State 2: Intermediate page to buy the cheese.
            if (clickElement(buyButtonSelector)) {
                return; // Action taken, exit.
            }

            // State 3: Start countdown page, "GO!!!!" button is visible.
            if (clickElement(goButtonSelector)) {
                return; // Action taken, exit.
            }

            // State 4: End of game, "Play Again?" button is visible.
            if (clickElement(playAgainButtonSelector)) {
                return; // Action taken, exit.
            }

            // State 5: Start of the game, 'cheese_name' input is visible.
            if (setAndSubmit(cheeseInputSelector, TARGET_CHEESE)) {
                return; // Action taken, exit.
            }

            // If no action was taken, log a message. This can happen if the page is not in
            // one of the expected states (e.g., an error page).
            console.log("Cheeseroller: No valid game element found. Script is idle.");
        }

        // Start the automation process.
        startAutomation();
    });
})();
