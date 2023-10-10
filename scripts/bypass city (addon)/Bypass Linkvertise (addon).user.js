// ==UserScript==
// @name            Bypass Linkvertise
// @version         1.1
// @description     Bypass Linkvertise bans by adding &redirect=true&bplv=true to the end of the URL.
// @author          skyline1
// @match           https://bypass.city/bypass?bypass=*
// ==/UserScript==

(function() {
    var url = window.location.href;
    if (url.includes("linkvertise") && !url.includes("&redirect=true&bplv=true")) {
        url += "&redirect=true&bplv=true";
        window.location.href = url;
    }
})();
