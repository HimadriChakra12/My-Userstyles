// ==UserScript==
// @name         Reddit Sidebar Posts with Iframe
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Opens Reddit posts in a sidebar using an iframe (with compact view).
// @author       You
// @match        https://www.reddit.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add sidebar styles
    GM_addStyle(`
        #sidebar-post {
            position: fixed;
            top: 0;
            right: 0;
            width: 30%;
            height: 100vh;
            background-color: white;
            border-left: 1px solid #ccc;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            padding: 10px;
        }
        #sidebar-post .close-button {
            position: sticky;
            top: 0;
            background: white;
            padding: 5px;
            z-index: 1001;
            cursor: pointer;
            text-align: right;
        }
        #sidebar-post iframe {
            width: 100%;
            height: calc(100vh - 40px);
            border: none;
        }
    `);

    // Create sidebar element
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar-post';
    sidebar.innerHTML = '<div class="close-button">Close</div><iframe id="sidebar-post-iframe"></iframe>';
    document.body.appendChild(sidebar);

    // Close button functionality
    sidebar.querySelector('.close-button').addEventListener('click', () => {
        sidebar.style.display = 'none';
        document.getElementById("sidebar-post-iframe").src = "";
    });

    // Event listener for post links
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'A' && target.href.includes('/r/') && target.href.includes('/comments/')) {
            event.preventDefault();

            const postUrl = target.href + "?compact=true"; // Append compact view parameter
            sidebar.style.display = 'block';
            document.getElementById("sidebar-post-iframe").src = postUrl;
        }
    });
})();
