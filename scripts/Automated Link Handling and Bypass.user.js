// ==UserScript==
// @name         Justpaste.it and bypass.city skip wait
// @namespace    skyline1
// @version      1.0
// @description  Skips redirect message on justpaste.it and opens bypassed links on bypass.city in the same tab with retries
// @author       skyline1
// @match        https://bypass.city/bypass*
// @match        https://justpaste.it/redirect/*
// @downloadURL  https://github.com/imwaitingnow/skyline-scripts/raw/main/scripts/Automated%20Link%20Handling%20and%20Bypass.user.js
// @updateURL    https://github.com/imwaitingnow/skyline-scripts/raw/main/scripts/Automated%20Link%20Handling%20and%20Bypass.user.js
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

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

    // Retry opening links and clicking the element every 1 second
    function retryActions() {
        openLinks();
        clickElement();
        setTimeout(retryActions, 1000);
    }

    // Run the combined functions when the page is fully loaded
    window.addEventListener('load', () => {
        retryActions();
    });

})();
