// ==UserScript==
// @name        Bypass Linkvertise
// @version     1.6
// @description  Bypass Linkvertise bans by adding &redirect=true&bplv=true to the end of the URL and removing any `/1` that may be present.
// @author       Bard
// @match       https://bypass.city/bypass?bypass=*
// ==/UserScript==

(function() {
    var url = window.location.href;

    // Remove the `/1` if it is present at the end of the URL.
    if (url.endsWith("/1")) {
        url = url.substring(0, url.length - 2);
    }

    // Add `&redirect=true&bplv=true` to the end of the URL if it is not already present and the URL includes the word "linkvertise".
    if (url.includes("linkvertise") && !url.includes("&redirect=true&bplv=true")) {
        url += "&redirect=true&bplv=true";
    }

    // Redirect the user to the new URL if it is different from the current URL.
    if (url !== window.location.href) {
        window.location.href = url;
    }

    // Prevent the script from redirecting the page again.
    return false;
})();
