// ==UserScript==
// @name         Tarkov.help premium bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  i want my maps
// @author       beliboba
// @match        *://*.tarkov.help/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    function checkForMapPage() {
        const mapPageElement = document.getElementById('map-page');
        if (mapPageElement) {
            mapPageElement.classList.remove("prem-blur");
            mapPageElement.setAttribute('data-premium-hidden', 'false');
            mapPageElement.setAttribute('data-premium', 'true');
            console.log('готово)))))');
            observer.disconnect();
        }
    }
    const observer = new MutationObserver(checkForMapPage);
    observer.observe(document.body, { childList: true, subtree: true });
})();