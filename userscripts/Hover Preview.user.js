// ==UserScript==
// @name           Hover Preview Enhanced
// @namespace      HP
// @description    Shows a floating preview of links on hover with modern features and better performance
// @include        *
// @version        1.0.0
// @downloadURL    https://update.greasyfork.org/scripts/8042/Hover%20Preview.user.js
// @updateURL      https://update.greasyfork.org/scripts/8042/Hover%20Preview.meta.js
// @grant          none
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        hoverDelay: 1000,              // Reduced from 1500ms for faster response
        hideDelay: 300,               // Reduced for snappier feel
        popupWidth: 0.85,             // 85% of window width (centered)
        popupHeight: 0.85,            // 85% of window height (centered)
        position: 'center',           // Center position with backdrop
        excludeExtensions: [          // File types to ignore
            'zip', 'rar', '7z', 'tar', 'gz',
            'exe', 'dmg', 'pkg', 'deb', 'rpm',
            'pdf', 'doc', 'docx', 'xls', 'xlsx',
            'mp3', 'mp4', 'avi', 'mkv', 'mov'
        ],
        excludeDomains: [             // Domains that break out of iframes
            'stackoverflow.com',
            'github.com'
        ],
        showLoadingIndicator: true,
        enableKeyboardShortcut: true, // ESC to close preview
        toggleKey: 'F2',              // Key to toggle script on/off
        startEnabled: false           // Start with script disabled (toggle on with F2)
    };

    // State management
    let state = {
        currentLink: null,
        lastLink: null,
        hoverTimer: null,
        hideTimer: null,
        isOverPopup: false,
        popup: null,
        backdrop: null,           // Backdrop overlay
        iframe: null,
        observer: null,
        enabled: CONFIG.startEnabled,  // Track if script is enabled
        statusIndicator: null          // Visual indicator
    };

    // Utility functions
    const utils = {
        shouldExcludeLink(url) {
            try {
                const urlObj = new URL(url, window.location.href);

                // Check for excluded file extensions
                const extension = urlObj.pathname.split('.').pop().toLowerCase();
                if (CONFIG.excludeExtensions.includes(extension)) {
                    return true;
                }

                // Check for excluded domains
                if (CONFIG.excludeDomains.some(domain => urlObj.hostname.includes(domain))) {
                    return true;
                }

                // Exclude same-page anchors
                if (urlObj.hostname === window.location.hostname &&
                    urlObj.pathname === window.location.pathname &&
                    urlObj.hash) {
                    return true;
                }

                return false;
            } catch (e) {
                return true; // Exclude invalid URLs
            }
        },

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // Popup management
    const popup = {
        create() {
            if (state.popup) return;

            // Create backdrop overlay
            state.backdrop = document.createElement('div');
            state.backdrop.id = 'hover-preview-backdrop';
            Object.assign(state.backdrop.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: '2147483646',
                display: 'none',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });

            // Create container
            state.popup = document.createElement('div');
            state.popup.id = 'hover-preview-popup';

            // Create iframe
            state.iframe = document.createElement('iframe');
            state.iframe.className = 'hover-preview-iframe';
            state.iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms');

            // Create loading indicator
            const loader = document.createElement('div');
            loader.className = 'hover-preview-loader';
            loader.textContent = 'Loading preview...';

            state.popup.appendChild(loader);
            state.popup.appendChild(state.iframe);

            // Apply styles
            this.applyStyles();

            // Add event listeners
            state.popup.addEventListener('mouseenter', () => {
                state.isOverPopup = true;
                if (state.hideTimer) {
                    clearTimeout(state.hideTimer);
                }
            });

            state.popup.addEventListener('mouseleave', () => {
                state.isOverPopup = false;
                this.scheduleHide();
            });

            // Click backdrop to close
            state.backdrop.addEventListener('click', (e) => {
                if (e.target === state.backdrop) {
                    state.currentLink = null;
                    this.hide();
                }
            });

            // Add loading event listeners
            state.iframe.addEventListener('load', () => {
                loader.style.display = 'none';
            });

            document.body.appendChild(state.backdrop);
            document.body.appendChild(state.popup);
        },

        applyStyles() {
            // Popup container styles - centered
            Object.assign(state.popup.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${window.innerWidth * CONFIG.popupWidth}px`,
                height: `${window.innerHeight * CONFIG.popupHeight}px`,
                zIndex: '2147483647',
                display: 'none',
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });

            // Iframe styles
            Object.assign(state.iframe.style, {
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
            });

            // Loader styles
            const loader = state.popup.querySelector('.hover-preview-loader');
            Object.assign(loader.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '16px',
                color: '#666',
                display: CONFIG.showLoadingIndicator ? 'block' : 'none'
            });
        },

        show(link) {
            if (!state.popup) {
                this.create();
            }

            const loader = state.popup.querySelector('.hover-preview-loader');

            // Show loader if loading new content
            if (state.iframe.src !== link.href) {
                loader.style.display = CONFIG.showLoadingIndicator ? 'block' : 'none';
                state.iframe.src = link.href;
            }

            // Show backdrop and popup with animation
            state.backdrop.style.display = 'block';
            state.popup.style.display = 'block';

            // Trigger animation
            requestAnimationFrame(() => {
                state.backdrop.style.opacity = '1';
                state.popup.style.opacity = '1';
            });
        },

        hide() {
            if (state.popup) {
                // Fade out animation
                state.backdrop.style.opacity = '0';
                state.popup.style.opacity = '0';

                // Hide after animation completes
                setTimeout(() => {
                    if (state.backdrop) state.backdrop.style.display = 'none';
                    if (state.popup) state.popup.style.display = 'none';
                }, 300);
            }
        },

        scheduleHide() {
            if (state.hideTimer) {
                clearTimeout(state.hideTimer);
            }
            state.hideTimer = setTimeout(() => {
                if (!state.isOverPopup && !state.currentLink) {
                    this.hide();
                }
            }, CONFIG.hideDelay);
        }
    };

    // Link event handlers
    const linkHandlers = {
        handleMouseEnter(event) {
            // Check if script is enabled
            if (!state.enabled) {
                return;
            }

            const link = event.currentTarget;

            // Don't process if it's an excluded link
            if (utils.shouldExcludeLink(link.href)) {
                return;
            }

            state.currentLink = link;

            // Clear any pending hide timer
            if (state.hideTimer) {
                clearTimeout(state.hideTimer);
            }

            // If hovering back to the same link, show immediately
            if (state.lastLink === link.href && state.popup) {
                popup.show(link);
                return;
            }

            // Schedule showing the popup
            if (state.hoverTimer) {
                clearTimeout(state.hoverTimer);
            }

            state.hoverTimer = setTimeout(() => {
                if (state.currentLink === link) {
                    state.lastLink = link.href;
                    popup.show(link);
                }
            }, CONFIG.hoverDelay);
        },

        handleMouseLeave(event) {
            state.currentLink = null;

            if (state.hoverTimer) {
                clearTimeout(state.hoverTimer);
            }

            popup.scheduleHide();
        },

        handleClick(event) {
            // Clear state and hide popup when link is clicked
            state.currentLink = null;
            if (state.hoverTimer) {
                clearTimeout(state.hoverTimer);
            }
            popup.hide();
        }
    };

    // Status indicator
    const statusIndicator = {
        create() {
            state.statusIndicator = document.createElement('div');
            state.statusIndicator.id = 'hover-preview-status';

            Object.assign(state.statusIndicator.style, {
                position: 'fixed',
                top: '10px',
                right: '10px',
                padding: '8px 12px',
                backgroundColor: state.enabled ? '#4CAF50' : '#f44336',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 'bold',
                zIndex: '2147483646',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                opacity: '0',
                pointerEvents: 'none',
                userSelect: 'none'
            });

            this.updateText();
            document.body.appendChild(state.statusIndicator);
        },

        updateText() {
            if (!state.statusIndicator) return;

            if (state.enabled) {
                state.statusIndicator.textContent = 'Hover Preview: ON';
                state.statusIndicator.style.backgroundColor = '#4CAF50';
            } else {
                state.statusIndicator.textContent = `Hover Preview: OFF (${CONFIG.toggleKey} to enable)`;
                state.statusIndicator.style.backgroundColor = '#f44336';
            }
        },

        show() {
            if (!state.statusIndicator) {
                this.create();
            }
            state.statusIndicator.style.opacity = '1';
            setTimeout(() => {
                if (state.statusIndicator) {
                    state.statusIndicator.style.opacity = '0';
                }
            }, 2000);
        },

        toggle() {
            state.enabled = !state.enabled;
            this.updateText();
            this.show();

            // Hide popup if disabling
            if (!state.enabled) {
                state.currentLink = null;
                popup.hide();
            }
        }
    };

    // Keyboard shortcuts
    function handleKeyboard(event) {
        // Toggle script on/off
        if (event.key === CONFIG.toggleKey) {
            event.preventDefault();
            statusIndicator.toggle();
            return;
        }

        // Close preview with ESC
        if (CONFIG.enableKeyboardShortcut && event.key === 'Escape') {
            state.currentLink = null;
            popup.hide();
        }
    }

    // Attach event listeners to all links
    function attachListeners(link) {
        link.addEventListener('mouseenter', linkHandlers.handleMouseEnter);
        link.addEventListener('mouseleave', linkHandlers.handleMouseLeave);
        link.addEventListener('click', linkHandlers.handleClick);
    }

    // Initialize on existing links
    function initExistingLinks() {
        document.querySelectorAll('a[href]').forEach(attachListeners);
    }

    // Watch for new links added to the page
    function watchForNewLinks() {
        state.observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'A' && node.href) {
                            attachListeners(node);
                        }
                        // Check children
                        node.querySelectorAll && node.querySelectorAll('a[href]').forEach(attachListeners);
                    }
                });
            });
        });

        state.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Handle window resize
    const handleResize = utils.debounce(() => {
        if (state.popup) {
            state.popup.style.width = `${window.innerWidth * CONFIG.popupWidth}px`;
            state.popup.style.height = `${window.innerHeight * CONFIG.popupHeight}px`;
        }
    }, 250);

    // Initialize
    function init() {
        // Don't run in iframes
        if (window.self !== window.top) {
            return;
        }

        initExistingLinks();
        watchForNewLinks();

        document.addEventListener('keydown', handleKeyboard);

        window.addEventListener('resize', handleResize);

        // Show initial status
        setTimeout(() => {
            statusIndicator.show();
        }, 1000);

        console.log('Hover Preview Enhanced initialized');
        console.log(`Toggle with ${CONFIG.toggleKey} key`);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        if (state.observer) {
            state.observer.disconnect();
        }
    });

})();
