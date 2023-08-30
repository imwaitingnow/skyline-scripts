// ==UserScript==
// @name         Justpaste.it and bypass.city skip wait
// @namespace    skyline1
// @version      1.4
// @description  Skips redirect message on justpaste.it and opens bypassed links on bypass.city in the same tab with retries
// @author       skyline1
// @match        https://bypass.city/bypass*
// @match        https://justpaste.it/redirect/*
// @downloadURL  https://github.com/imwaitingnow/skyline-scripts/raw/main/scripts/Automated%20Link%20Handling%20and%20Bypass.user.js
// @updateURL    https://github.com/imwaitingnow/skyline-scripts/raw/main/scripts/Automated%20Link%20Handling%20and%20Bypass.user.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let bypassFailedTimer = null;

    // Function to check if a URL is an absolute link
    function isAbsoluteLink(url) {
        return url.startsWith("http://") || url.startsWith("https://");
    }

    // Function to open link in the same tab
    function openLinkInSameTab(url) {
        window.location.href = url;
    }

    // Function to find and open links with rel="noopener noreferrer"
    function openLinks() {
        const allLinks = document.querySelectorAll('a');
        let openedLink = false;

        allLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkRel = link.getAttribute('rel');
            if (linkHref && isAbsoluteLink(linkHref) && linkRel && linkRel.includes('noopener') && linkRel.includes('noreferrer') && !openedLink) {
                openLinkInSameTab(linkHref);
                openedLink = true;
            }
        });

        if (!openedLink) {
            setTimeout(openLinks, 1000); // Retry after 1 second
        }
    }

    // Function to find and click on the redirect skip element
    function clickElement() {
        const targetClass = "redirectLink redirectLinkBold";
        const elements = document.getElementsByClassName(targetClass);

        if (elements.length > 0) {
            elements[0].click(); // Click the first element with the specified class
            console.log("Clicked on the element.");
        } else {
            console.log("Element not found.");
        }
    }

    // Function to update the timer display
    function updateTimerDisplay(seconds) {
        const timerDisplay = document.getElementById('bypassFailedTimerBox');
        if (timerDisplay) {
            timerDisplay.textContent = `Refreshing in ${seconds} seconds...`;
        }
    }

    // Function to check for the "Bypass failed" text and start a timer if found
    function checkForBypassFailedText() {
        const bodyText = document.body.textContent;
        const bypassFailedText = "Bypass failed";

        if (bodyText.includes(bypassFailedText)) {
            if (bypassFailedTimer === null) {
                console.log("Bypass failed detected. Starting timer...");
                let secondsLeft = 60; // 1 minute in seconds

                bypassFailedTimer = setInterval(() => {
                    if (secondsLeft > 0) {
                        updateTimerDisplay(secondsLeft);
                        secondsLeft--;
                    } else {
                        clearInterval(bypassFailedTimer);
                        console.log("Timer finished. Refreshing page...");
                        location.reload();
                    }
                }, 1000); // Update every 1 second
            }
        } else {
            clearInterval(bypassFailedTimer);
            bypassFailedTimer = null;
            updateTimerDisplay(0); // Clear timer display
        }

        setTimeout(checkForBypassFailedText, 1000); // Check every 1 second
    }

    // Retry opening links and clicking the element every 1 second
    function retryActions() {
        openLinks();
        clickElement();
        setTimeout(retryActions, 1000);
    }

    // Create a styled box for the timer display
    const timerDisplayBox = document.createElement('div');
    timerDisplayBox.id = 'bypassFailedTimerBox';
    timerDisplayBox.style.position = 'fixed';
    timerDisplayBox.style.bottom = '20px';
    timerDisplayBox.style.right = '20px';
    timerDisplayBox.style.zIndex = '9999';
    timerDisplayBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    timerDisplayBox.style.color = 'white';
    timerDisplayBox.style.padding = '10px';
    timerDisplayBox.style.borderRadius = '5px';
    timerDisplayBox.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(timerDisplayBox);

    // Run the check function when the page is fully loaded
    window.addEventListener('load', () => {
        checkForBypassFailedText();
        retryActions();
    });

})();
