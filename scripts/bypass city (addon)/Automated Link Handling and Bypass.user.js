// ==UserScript==
// @name         Justpaste.it and bypass.city skip wait test
// @namespace    skyline1
// @version      3.7
// @description  Skips redirect message on justpaste.it and opens bypassed links on bypass.city in the same tab with retries
// @author       skyline1
// @match        https://bypass.city/*
// @match        https://justpaste.it/*
// @grant        none
// @downloadURL  https://github.com/imwaitingnow/skyline-scripts/raw/main/scripts/Automated%20Link%20Handling%20and%20Bypass.user.js
// @updateURL    https://github.com/imwaitingnow/skyline-scripts/raw/main/scripts/Automated%20Link%20Handling%20and%20Bypass.user.js
// @licence      GPL-3.0-or-later
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = window.location.href;

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
    let linkClicked = false;

    function isAbsoluteLink(url) {
        return url.startsWith("http://") || url.startsWith("https://");
    }

    function openLinkInSameTab(url) {
        window.location.href = url;
    }

    function openLinks() {
        if (linkClicked) {
            return;
        }

        const allLinks = document.querySelectorAll('a');
        let openedLink = false;

        const forbiddenWords = ["word1", "word2", "word3"];

        allLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkRel = link.getAttribute('rel');

            if (linkHref && isAbsoluteLink(linkHref) && linkRel && linkRel.includes('noopener') && linkRel.includes('noreferrer') && !openedLink) {
                if (!forbiddenWords.some(word => document.body.textContent.includes(word))) {
                    openLinkInSameTab(linkHref);
                    openedLink = true;
                    linkClicked = true;
                } else {
                    console.log("Forbidden words found on the page. Not opening the link.");
                }
            }
        });

        if (!openedLink) {
            setTimeout(openLinks, 1000);
        }
    }

    function updateTimerDisplay(seconds) {
        const timerDisplay = document.getElementById('bypassFailedTimerBox');
        if (timerDisplay) {
            if (seconds > 0) {
                timerDisplay.innerHTML = `Refreshing in ${seconds} seconds. <br>`;

                // Create GitHub link element
                const githubLink = document.createElement('a');
                githubLink.href = 'https://github.com/imwaitingnow/skyline-scripts';
                githubLink.textContent = 'GitHub';
                githubLink.style.color = 'white'; // Set link color
                githubLink.style.textDecoration = 'underline'; // Add underline for better visibility

                // Create Discord link element
                const discordLink = document.createElement('a');
                discordLink.href = 'https://discord.gg/qeUSZnxfJg';
                discordLink.textContent = 'Discord';
                discordLink.style.color = 'white'; // Set link color
                discordLink.style.textDecoration = 'underline'; // Add underline for better visibility

                // Create Greasy Fork link element
                const greasyForkLink = document.createElement('a');
                greasyForkLink.href = 'https://greasyfork.org/en/users/1102006-skyline1';
                greasyForkLink.textContent = 'Greasy Fork';
                greasyForkLink.style.color = 'white'; // Set link color
                greasyForkLink.style.textDecoration = 'underline'; // Add underline for better visibility

                // Append links and support message to the timerDisplay
                timerDisplay.appendChild(document.createTextNode('If you need support, you can reach me on '));
                timerDisplay.appendChild(githubLink);
                timerDisplay.appendChild(document.createTextNode(', '));
                timerDisplay.appendChild(discordLink);
                timerDisplay.appendChild(document.createTextNode(', or check out my scripts on '));
                timerDisplay.appendChild(greasyForkLink);

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
        // Check if the URL has changed
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            linkClicked = false; // Reset the flag when the URL changes
            clickLinkByClass();
        }

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
    timerDisplayBox.style.background = 'linear-gradient(135deg, #3498db, #ff6b6b)'; // Metallic blue to pink gradient
    timerDisplayBox.style.color = 'white';
    timerDisplayBox.style.padding = '10px';
    timerDisplayBox.style.borderRadius = '15px'; // Increased border radius for curved edges
    timerDisplayBox.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(timerDisplayBox);



    checkForBypassFailedText();
    retryActions();

})();
