// ==UserScript==
// @name         Justpaste.it and bypass.city skip wait
// @namespace    skyline1
// @version      0.1
// @description  Skips redirect message on justpaste.it and opens bypassed links on bypass.city in the same tab with retries
// @author       skyline1
// @grant        none
// @license      MIT
// @match        https://justpaste.it/redirect/*/*
// @match        https://bypass.city/*
// ==/UserScript==

(function() {
    'use strict';

    function isAbsoluteLink(url) {
        return url.startsWith("http://") || url.startsWith("https://");
    }

    function isDiscordLink(url) {
        return url.includes("discord.gg") || url.includes("discord.com");
    }

    function isPatreonLink(url) {
        return url.includes("patreon.com");
    }

    function isCloudflareLink(url) {
        return url.includes("cloudflare.com");
    }

    function openLinkInSameTab(url) {
        window.location.href = url;
    }

    function openLinks() {
        const allLinks = document.querySelectorAll('a');
        let openedLink = false;

        allLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref && isAbsoluteLink(linkHref) && !isDiscordLink(linkHref) && !isPatreonLink(linkHref) && !isCloudflareLink(linkHref) && !openedLink) {
                openLinkInSameTab(linkHref);
                openedLink = true;
            }
        });

        if (!openedLink) {
            setTimeout(openLinks, 1000); // Retry after 1 second
        }
    }

    // Run the function when the page is fully loaded
    window.addEventListener('load', () => {
        if (window.location.href.includes('justpaste.it/redirect')) {
            const targetClass = "redirectLink redirectLinkBold";
            const elements = document.getElementsByClassName(targetClass);

            if (elements.length > 0) {
                elements[0].click();
                console.log("Clicked on the element.");
            } else {
                console.log("Element not found.");
            }
        } else {
            openLinks();
        }
    });

})();
