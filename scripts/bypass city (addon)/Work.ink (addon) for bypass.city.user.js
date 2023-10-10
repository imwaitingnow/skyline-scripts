// ==UserScript==
// @name         Work.ink Bypass Link and URL Change Detector
// @namespace    skyline1
// @version      2.0
// @description  Add current Work.ink URL to bypass link and navigate to it. Detect changes in the current URL.
// @match        https://work.ink/*
// @author       skyline1
// @exclude      *jpg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show the bypass link
    function showBypassLink() {
        // Get the current URL
        var currentURL = window.location.href;

        // Check if the link should be hidden on this page
        var hideOnPages = ['https://work.ink/', 'https://work.ink/search'];
        var hideSubdirectories = ['https://work.ink/search/'];
        var shouldHide = hideOnPages.includes(currentURL) || hideSubdirectories.some(subdir => currentURL.startsWith(subdir));

        // Create a link element
        var linkElement = document.createElement('a');
        linkElement.href = shouldHide ? '#' : createBypassLink(currentURL);
        linkElement.textContent = "Go to Bypassed Link";
        linkElement.style.display = shouldHide ? 'none' : 'block';
        linkElement.style.padding = '10px';
        linkElement.style.backgroundColor = '#00cc00'; // Green color
        linkElement.style.color = 'white';
        linkElement.style.textAlign = 'center';
        linkElement.style.borderRadius = '5px';
        linkElement.style.textDecoration = 'none';
        linkElement.style.fontWeight = 'bold';

        // Create a container div for the top right corner
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '9999'; // Ensure it's on top
        container.appendChild(linkElement);

        // Remove any existing bypass link containers
        var existingContainers = document.querySelectorAll('.bypass-link-container');
        existingContainers.forEach(function(existingContainer) {
            existingContainer.remove();
        });

        // Add the container to the body
        container.className = 'bypass-link-container';
        document.body.appendChild(container);
    }

    // Create the bypass link
    function createBypassLink(url) {
        return "https://bypass.city/bypass?bypass=" + encodeURIComponent(url);
    }

    // Initial execution
    showBypassLink();

    // Listen for navigation events
    window.addEventListener('hashchange', showBypassLink);
    window.addEventListener('popstate', showBypassLink);

    // URL change detection
    var currentURL = window.location.href;

    function checkURLChange() {
        var newURL = window.location.href;
        if (newURL !== currentURL) {
            console.log("URL has changed from:", currentURL);
            console.log("URL has changed to:", newURL);
            currentURL = newURL;
            showBypassLink(); // Update bypass link when URL changes
        }
    }

    // Check for URL changes at an interval (every 1 second in this example)
    setInterval(checkURLChange, 1000);
})();
