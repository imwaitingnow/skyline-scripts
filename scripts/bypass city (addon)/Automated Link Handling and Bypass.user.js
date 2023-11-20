// ==UserScript==
// @name         Justpaste.it and bypass.city skip wait
// @namespace    skyline1
// @version      3.6
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

    function clickLinkByClass() {
        const link = document.querySelector('.redirectLink.redirectLinkBold');
        if (link) {
            link.click();
        } else {
            console.log("Link with the specified class not found.");
        }
    }

    clickLinkByClass();

    let bypassFailedTimer = null;
    let linkClicked = false; // Track whether a link has been clicked

    function isAbsoluteLink(url) {
        return url.startsWith("http://") || url.startsWith("https://");
    }

    function openLinkInSameTab(url) {
        window.location.href = url;
    }

    function openLinks() {
        if (linkClicked) {
            return; // Do nothing if the link has already been clicked
        }

        const allLinks = document.querySelectorAll('a');
        let openedLink = false;

        const forbiddenWords = ["Extracted Paste", "We managed"];

        allLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkRel = link.getAttribute('rel');

            if (linkHref && isAbsoluteLink(linkHref) && linkRel && linkRel.includes('noopener') && linkRel.includes('noreferrer') && !openedLink) {
                if (!forbiddenWords.some(word => document.body.textContent.includes(word))) {
                    openLinkInSameTab(linkHref);
                    openedLink = true;
                    linkClicked = true; // Set the flag to true after clicking the link
                } else {
                    console.log("Forbidden words found on the page. Not opening the link.");
                }
            }
        });

        if (!openedLink) {
            setTimeout(openLinks, 1000); // Retry after 1 second
        }
    }

    function updateTimerDisplay(seconds) {
        const timerDisplay = document.getElementById('bypassFailedTimerBox');
        if (timerDisplay) {
            if (seconds > 0) {
                timerDisplay.textContent = `Refreshing in ${seconds} seconds...`;
                timerDisplay.style.display = 'block';
            } else {
                timerDisplay.style.display = 'none';
            }
        }
    }

    function checkForBypassFailedText() {
        const bodyText = document.body.textContent;
        const bypassFailedTextRegex = /bypass failed|an error has occurred|however\.\.\./i;

        if (bypassFailedTextRegex.test(bodyText)) {
            if (bypassFailedTimer === null) {
                console.log("Bypass failed, error, or 'However...' detected. Starting timer...");
                let secondsLeft = 4;

                bypassFailedTimer = setInterval(() => {
                    if (secondsLeft > 0) {
                        updateTimerDisplay(secondsLeft);
                        secondsLeft--;
                    } else {
                        clearInterval(bypassFailedTimer);
                        console.log("Timer finished. Refreshing page...");
                        location.reload();
                    }
                }, 1000);
            }
        } else {
            clearInterval(bypassFailedTimer);
            bypassFailedTimer = null;
            updateTimerDisplay(0);
        }

        setTimeout(checkForBypassFailedText, 1000);
    }

    function replaceURLsWithLinkText() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const linkText = link.textContent.trim();
            if (linkText.startsWith('https://') || linkText.startsWith('http://')) {
                link.href = linkText;
            }
        });
    }

    function retryActions() {
        openLinks();
        replaceURLsWithLinkText();
        setTimeout(retryActions, 1000);
    }

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

    checkForBypassFailedText();
    retryActions();

})();
