// ==UserScript==
// @name         AparsClassroom Iframe SRC Extractor
// @namespace    https://yourdomain.example
// @version      1.1
// @description  Find iframe src on frb.aparsclassroom.com and show copy-button
// @match        https://frb.aparsclassroom.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function createButtonPanel(links) {
        // don't create duplicate
        if (document.getElementById('iframeExtractorBtn')) return;

        // Create floating button
        const btn = document.createElement('div');
        btn.id = "iframeExtractorBtn";
        btn.innerHTML = "🔗";
        document.body.appendChild(btn);

        // Create hidden panel
        const panel = document.createElement('div');
        panel.id = "iframeExtractorPanel";
        panel.innerHTML = "<b>Iframe SRC Links:</b><br>";

        links.forEach((link) => {
            const a = document.createElement('div');
            a.className = "iframeLink";
            a.textContent = link;

            a.onclick = () => {
                GM_setClipboard(link);
                a.style.background = "#c7ffda";
                setTimeout(() => a.style.background = "", 800);
            };

            panel.appendChild(a);
        });

        document.body.appendChild(panel);

        // Styles
        const css = `
#iframeExtractorBtn {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #0075ff;
    color: white;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 20px;
    z-index: 999999;
    transition: all 0.3s ease;
    background: #111
}
#iframeExtractorBtn:hover {
    background: #0054c9;
}

#iframeExtractorPanel {
    position: fixed;
    top: 60px;
    right: 20px;
    background: white;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 0px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 999999;
    opacity: 0;
    transition: all 0.25s ease-out;
    pointer-events: none;
}

#iframeExtractorBtn:hover + #iframeExtractorPanel,
#iframeExtractorPanel:hover {
    width: 330px;
    opacity: 1;
    pointer-events: auto;
}

.iframeLink {
    margin: 5px 0;
    padding: 5px;
    font-size: 13px;
    background: #f2f2f2;
    border-radius: 4px;
    cursor: pointer;
    word-wrap: break-word;
}
.iframeLink:hover {
    background: #e1e1e1;
}
`;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function scanAndShow() {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        const links = iframes
            .map(f => f.src)
            .filter(src => src && src.trim().length > 0);
        if (links.length) {
            createButtonPanel(links);
        }
    }

    // Initial scan
    scanAndShow();

    // Also observe DOM mutations: this covers dynamically loaded iframes
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes) {
                for (const node of m.addedNodes) {
                    if (node.tagName === 'IFRAME' || (node.querySelectorAll && node.querySelectorAll('iframe').length > 0)) {
                        scanAndShow();
                        return;
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
