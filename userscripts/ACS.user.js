// ==UserScript==
// @name         AparsClassroom Iframe SRC Extractor (Dark Mode, Short URLs)
// @namespace    https://yourdomain.example
// @version      1.4
// @description  Extract iframe src, copy link — dark mode, shortened URL preview
// @match        https://frb.aparsclassroom.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function shortenURL(url, maxLength = 50) {
        if (url.length <= maxLength) return url;
        return url.slice(0, maxLength) + "...........";
    }

    function createButtonPanel(links) {
        if (document.getElementById('iframeExtractorBtn')) return;

        const btn = document.createElement('div');
        btn.id = "iframeExtractorBtn";
        btn.innerHTML = "🔗";
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.id = "iframeExtractorPanel";
        panel.innerHTML = "<b>Iframe SRC Links:</b><br><br>";

        links.forEach((link) => {
            const wrapper = document.createElement('div');
            wrapper.className = "iframeLinkItem";

            const linkBox = document.createElement('div');
            linkBox.className = "iframeLink";

            // show only shortened preview
            linkBox.textContent = shortenURL(link);

            // but copy full link
            linkBox.onclick = () => {
                GM_setClipboard(link);
                linkBox.style.background = "#2e6041";
                setTimeout(() => linkBox.style.background = "", 800);
            };

            wrapper.appendChild(linkBox);
            panel.appendChild(wrapper);
        });

        document.body.appendChild(panel);

        const css = `
/* Floating button */
#iframeExtractorBtn {
    position: fixed;
    top: 1vw;
    right: 20px;
    background: #0000;
    color: #00aaff;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 20px;
    z-index: 999999;
    box-shadow: 0 0 10px #000;

}

/* Panel */
#iframeExtractorPanel {
    position: fixed;
    top: 60px;
    right: 20px;
    background: #161616;
    padding: 12px;
    border: 1px solid #333;
    border-radius: 6px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 999999;
    opacity: 0;
    transition: all 0.25s ease-out;
    pointer-events: none;
    color: #e6e6e6;
    box-shadow: 0 0 12px rgba(0,0,0,0.6);
}

/* Hover to expand panel */
#iframeExtractorBtn:hover + #iframeExtractorPanel,
#iframeExtractorPanel:hover {
    width: 450px;
    opacity: 1;
    pointer-events: auto;
}

/* Link rows */
.iframeLinkItem {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

/* Link display */
.iframeLink {
    flex: 1;
    padding: 6px;
    font-size: 13px;
    background: #202020;
    border-radius: 4px;
    cursor: pointer;
    word-wrap: break-word;
    border: 1px solid #2d2d2d;
    transition: background 0.15s;
}
.iframeLink:hover { background: #2a2a2a; }
`;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function scanAndShow() {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        const links = iframes.map(f => f.src).filter(src => src && src.trim().length > 0);
        if (links.length) createButtonPanel(links);
    }

    scanAndShow();

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes) {
                for (const node of m.addedNodes) {
                    if (
                        node.tagName === 'IFRAME' ||
                        (node.querySelectorAll && node.querySelectorAll('iframe').length > 0)
                    ) {
                        scanAndShow();
                        return;
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
