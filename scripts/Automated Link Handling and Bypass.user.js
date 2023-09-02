// ==UserScript==
// @name         Justpaste.it and bypass.city skip wait
// @namespace    skyline1
// @version      3.3
// @description  Skips redirect message on justpaste.it and opens bypassed links on bypass.city in the same tab with retries
// @author       skyline1
// @match        https://bypass.city/bypass*
// @match        https://justpaste.it/*
// @grant        none
// @downloadURL  https://github.com/imwaitingnow/skyline-scripts/raw/main/scripts/Automated%20Link%20Handling%20and%20Bypass.user.js
// @updateURL    https://github.com/imwaitingnow/skyline-scripts/raw/main/scripts/Automated%20Link%20Handling%20and%20Bypass.user.js
// @licence      GPL-3.0-or-later
// ==/UserScript==

(function() {
    'use strict';
    // Modify link text for all links with extra spaces in the URL
    function clickLinkByClass() {
        const link = document.querySelector('.redirectLink.redirectLinkBold');
        if (link) {
            link.click();
        } else {
            console.log("Link with the specified class not found.");
        }
    }

// Call the function to click the link with the specified class
    clickLinkByClass();

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

    // Function to update the timer display
    function updateTimerDisplay(seconds) {
        const timerDisplay = document.getElementById('bypassFailedTimerBox');
        if (timerDisplay) {
            if (seconds > 0) {
                timerDisplay.textContent = `Refreshing in ${seconds} seconds...`;
                timerDisplay.style.display = 'block'; // Show the display
            } else {
                timerDisplay.style.display = 'none'; // Hide the display
            }
        }
    }



    // Function to check for the "Bypass failed" text and start a timer if found
    function checkForBypassFailedText() {
        const bodyText = document.body.textContent;
        const bypassFailedText = "Bypass failed";

        if (bodyText.includes(bypassFailedText)) {
            if (bypassFailedTimer === null) {
                console.log("Bypass failed detected. Starting timer...");
                let secondsLeft = 30; // 30 seconds

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

    // Function to replace URLs with link text
    function replaceURLsWithLinkText() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const linkText = link.textContent.trim();
            if (linkText.startsWith('https://') || linkText.startsWith('http://')) {
                link.href = linkText;
            }
        });
    }


    // Retry opening links and calling functions every 1 second
    function retryActions() {
        openLinks();
        replaceURLsWithLinkText();
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

    // Start functions when the page is ready
    checkForBypassFailedText();
    retryActions();

})();