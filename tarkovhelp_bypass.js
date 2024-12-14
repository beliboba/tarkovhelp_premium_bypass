// ==UserScript==
// @name         Tarkov.help premium bypass
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  i want my maps. fuck you
// @author       beliboba
// @match        *://*.tarkov.help/*
// @grant        none
// @license      MIT
// ==/UserScript==


(function() {
    'use strict';

    function modifyResponse(response, url) {
        try {
            const data = JSON.parse(response);

            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(item => {
                    item.premium = false;
                });
            }

            if (data.data && typeof data.data === 'object') {
                if ('premium' in data.data) {
                    data.data.premium = false;
                }
            }

            return JSON.stringify(data);
        } catch (error) {
            console.error('не получилос...', error);
            return response;
        }
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('/tarkov-maps') || url.includes('/api/ru/map/') && url.includes('/info')) {
            this.addEventListener('load', function() {
                try {
                    Object.defineProperty(this, 'responseText', {
                        value: modifyResponse(this.responseText, url)
                    });
                } catch (error) {
                    console.error('не получилос...', error);
                }
            });
        }
        originalOpen.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function() {
        const args = arguments;
        return originalFetch.apply(this, args).then(response => {
            const url = response.url;

            if (url.includes('/tarkov-maps') ||
                (url.includes('/api/ru/map/') && url.includes('/info'))) {
                return response.json().then(data => {

                    if (data.data && Array.isArray(data.data)) {
                        data.data.forEach(item => {
                            item.premium = false;
                        });
                    }


                    if (data.data && typeof data.data === 'object') {
                        if ('premium' in data.data) {
                            data.data.premium = false;
                        }
                    }

                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                });
            }
            return response;
        });
    };
})();
