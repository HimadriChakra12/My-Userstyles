// ==UserScript==
// @name         Instagram Sticker Sidebar with Toggle
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a toggleable sticker sidebar to Instagram DMs
// @author       You
// @match        https://www.instagram.com/direct/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- Styles ---
    const style = document.createElement('style');
    style.innerHTML = `
        #stickerToggle {
            position: fixed;
            bottom: 0%;
            right: 10%;
            background: var(--ig-primary-background);
            color: #fff;
            padding: 10px;
            border-radius: 100%;
            cursor: pointer;
            z-index: 9998;
            transform: translateY(-50%);
        }

        #stickerSidebar {
            position: fixed;
            top: 10px;
            right: 2px;
            width: 140px;
            background: #1c1c1c;
            border-left: 0px solid #ccc;
            z-index: 9999;
            padding: 10px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: -2px 0 6px rgba(0,0,0,0.2);
        }

        #stickerSidebar img {
            width: 100px;
            margin-bottom: 10px;
            cursor: grab;
        }

        #addStickerBtn {
            background: #1c1c1c;
            color: #fff;
            padding: 5px;
            border: 1px solid #c8c8c8;
            width: 20%;
            margin-bottom: 10px;
            cursor: pointer;
        }

        #closeStickerSidebar {
            position: absolute;
            top: 10px;
            right: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            color: #666;
            transition : 1s ease-in-out;
        }

        #addStickerInput {
            display: none;
        }
    `;
    document.head.appendChild(style);

    // --- Toggle Button ---
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'stickerToggle';
    toggleBtn.textContent = '౨ৎ';
    document.body.appendChild(toggleBtn);

    // --- Sidebar UI ---
    const sidebar = document.createElement('div');
    sidebar.id = 'stickerSidebar';
    sidebar.style.display = 'none';
    sidebar.innerHTML = `
        <div id="closeStickerSidebar">✕</div>
        <button id="addStickerBtn">+</button>
        <input type="file" id="addStickerInput" accept="image/*">
        <div id="stickerList"></div>
    `;
    document.body.appendChild(sidebar);

    // --- Elements ---
    const addStickerBtn = document.getElementById('addStickerBtn');
    const addStickerInput = document.getElementById('addStickerInput');
    const stickerList = document.getElementById('stickerList');
    const closeSidebarBtn = document.getElementById('closeStickerSidebar');

    // --- Local Storage ---
    function saveStickers(stickers) {
        localStorage.setItem('ig_stickers', JSON.stringify(stickers));
    }

    function loadStickers() {
        return JSON.parse(localStorage.getItem('ig_stickers') || '[]');
    }

    // --- DOM Sticker Rendering ---
    function addStickerToDOM(src) {
        const img = document.createElement('img');
        img.src = src;
        img.draggable = true;
        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', src);
        });
        stickerList.appendChild(img);
    }

    function refreshStickers() {
        stickerList.innerHTML = '';
        const stickers = loadStickers();
        stickers.forEach(addStickerToDOM);
    }

    // --- Events ---
    addStickerBtn.addEventListener('click', () => {
        addStickerInput.click();
    });

    addStickerInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const stickers = loadStickers();
            stickers.push(event.target.result);
            saveStickers(stickers);
            addStickerToDOM(event.target.result);
        };
        reader.readAsDataURL(file);
    });

    toggleBtn.addEventListener('click', () => {
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.style.display = 'none';
    });

    // --- Drag and Drop into Message Input ---
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => {
        const data = e.dataTransfer.getData('text/plain');
        const msgBox = document.querySelector('[contenteditable="true"]');
        if (msgBox) {
            msgBox.focus();
            document.execCommand('insertImage', false, data);
        }
    });

    refreshStickers();
})();

