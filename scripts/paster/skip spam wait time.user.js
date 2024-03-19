// ==UserScript==
// @name         skip paster.so spam wait time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip wait time no more spam check
// @author       skyline1
// @match        https://paster.so/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract links from script tags
    function extractLinksFromScriptTags() {
        const scriptTags = document.getElementsByTagName('script');
        const links = new Set(); // Using Set to automatically remove duplicates

        // Recursive function to extract links from nested script tags
        function extractLinksFromElement(element) {
            if (element.tagName.toLowerCase() === 'script') {
                const text = element.textContent;
                const regex = /https?:\/\/[^\s\\'"]+/g; // Updated regex
                let match;
                while ((match = regex.exec(text)) !== null) {
                    links.add(match[0]);
                }
            }

            // Recursively traverse child nodes
            const children = element.children;
            for (let i = 0; i < children.length; i++) {
                extractLinksFromElement(children[i]);
            }
        }

        // Extract links from all script tags
        for (let i = 0; i < scriptTags.length; i++) {
            extractLinksFromElement(scriptTags[i]);
        }

        return Array.from(links); // Convert Set to Array for easier handling
    }

    // Function to create and style the display box for links
    function createLinkDisplay(links) {
        const linkDisplay = document.createElement('div');
        linkDisplay.style.position = 'fixed';
        linkDisplay.style.top = '20px';
        linkDisplay.style.right = '20px';
        linkDisplay.style.padding = '10px';
        linkDisplay.style.background = 'linear-gradient(to bottom, #4b6cb7, #182848)';
        linkDisplay.style.borderRadius = '5px';
        linkDisplay.style.color = 'white';
        linkDisplay.style.zIndex = '9999';
        linkDisplay.style.maxHeight = '300px';
        linkDisplay.style.overflowY = 'auto';

        // Create and append link elements
        links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.textContent = link;
            linkElement.style.display = 'block';
            linkElement.style.marginBottom = '5px';
            linkElement.style.color = 'white';
            linkDisplay.appendChild(linkElement);
        });

        document.body.appendChild(linkDisplay);
    }

    // Extract links from script tags, remove duplicates, and display them
    const links = extractLinksFromScriptTags();
    createLinkDisplay(links);
})();
