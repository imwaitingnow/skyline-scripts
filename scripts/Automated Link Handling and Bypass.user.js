// ==UserScript==
// @name         Justpaste.it and bypass.city skip wait
// @namespace    skyline1
// @version      3.2
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

    let bypassFailedTimer = null;
    let hasClickedTargetBlankLink = false;

    // Modify link text for all links with extra spaces in the URL
    window.addEventListener('load', function() {
        const links = document.querySelectorAll('a[href*="justpaste.it"][target="_blank"][rel="nofollow"]');
        links.forEach(function(link) {
            const hrefParts = link.href.split("justpaste.it");
            if (hrefParts.length > 2) {
                // Remove everything before the second "justpaste.it" occurrence
                link.href = "https://justpaste.it" + hrefParts.slice(-1);
                link.textContent = "https://justpaste.it" + hrefParts.slice(-1);
            }
        });
    });
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
        const allLinks = document.querySelectorAll('a[target="_blank"][rel*="noopener noreferrer"]');
        let openedLink = false;

        allLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref) {
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
            if (linkText && isAbsoluteLink(linkText)) {
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

    // Add your code snippet here
    // Function to find and click on links with target="_blank" and rel="noopener noreferrer"
    function clickTargetBlankLinks() {
        if (!hasClickedTargetBlankLink) {
            const targetBlankLinks = document.querySelectorAll('a[target="_blank"][rel="noopener noreferrer"]');

            if (targetBlankLinks.length > 0) {
                const link = targetBlankLinks[0];
                link.click(); // Click the first link with target="_blank" and rel="noopener noreferrer"
                console.log("Clicked on the link with target='_blank' and rel='noopener noreferrer'.");
                hasClickedTargetBlankLink = true; // Mark that a link has been clicked
            } else {
                console.log("No links with target='_blank' and rel='noopener noreferrer' found.");
            }
        }
    }

    // Start the retry process for target="_blank" links
    setInterval(clickTargetBlankLinks, 1000);

})();
