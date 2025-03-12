// ==UserScript==
// @name         Instagram Multiple Floating Chat Bubbles with Notifications
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds multiple floating chat bubbles with notification indicators.
// @author       You
// @match        https://www.instagram.com/
// @exclude      https://www.instagram.com/direct/*
// @exclude      https://www.instagram.com/direct/inbox/*
// @exclude      https://www.instagram.com/direct/requests/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const bubbles = [
      //vau
        {
            url: "https://www.instagram.com/direct/t/17849831711501991/",
            image: "https://instagram.fdac99-1.fna.fbcdn.net/v/t51.29350-15/412599413_1437124243822938_6078999980740930483_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMjUzeDk0NS5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fdac99-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2AEOfjFl1v9t_FddpFSr-7NOLAnIGuF-NJKIFbTw-WJIf3BgOSBA5Qrj58ATpr7rr0U&_nc_ohc=n_24RWe_DF0Q7kNvgHPbq2n&_nc_gid=65fd7017dfab405b9b18d1d7618ec000&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzI2MTUyMzI0MDE1MzMxNzMzMA%3D%3D.3-ccb7-5&oh=00_AYHS-0UKwngHFcc-otE_YStb6il0SaUVGmBhllFM13CS0w&oe=67D28A3B&_nc_sid=7a9f4b",
            position: { top: "80px", right: "20px" },
            hasNotification: false // Initial state
        },
      //sayo
        {
            url: "https://www.instagram.com/direct/t/17842609524235614/",
            image: "https://instagram.fdac99-1.fna.fbcdn.net/v/t51.2885-15/481828093_17883038244235614_1911226061613657144_n.webp?efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi43MzR4NzM1LnNkci5mNzU3NjEuZGVmYXVsdF9pbWFnZSJ9&_nc_ht=instagram.fdac99-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2AH6Uaz1rDUWGJi_C_UvTGWzhqUU4cxOFm8u_1DEFFtELPcQ-pfaO1i2HRdEV-sOZsw&_nc_ohc=VjsNi2m2fdIQ7kNvgGikMBO&_nc_gid=65a21cb9f3ae45b8ad45832e608827ba&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzU3ODU1NzMwODY2MzkyNDUzNQ%3D%3D.3-ccb7-5&oh=00_AYEhieiYv1qM7UDR0NCee42M5TriPCVoi2lsMDCpX43CbA&oe=67D2940D&_nc_sid=7a9f4b",
            position: { top: "20px", right: "20px" },
            hasNotification: false
        },
      //gorg
        {
            url: "https://www.instagram.com/direct/t/17848009317175198/",
            image: "https://instagram.fdac99-1.fna.fbcdn.net/v/t51.29350-15/479492911_1171725124485093_1198324287172508842_n.heic?stp=dst-jpg_e35_s1080x1080_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0Mzkuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=instagram.fdac99-1.fna.fbcdn.net&_nc_cat=109&_nc_oc=Q6cZ2AEB7jSbjoJUNw5sNPC4qzUrZC5dhH9V8F5KecJlCY23AHIo9qIBtIIDSwf6ubiqebk&_nc_ohc=DPWkeSYry9IQ7kNvgFvcfCu&_nc_gid=b44e8bb865cc4c7f923e952e49c98ff2&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzU2ODEyNDk4Nzc0NjExNTM4MA%3D%3D.3-ccb7-5&oh=00_AYE1r0EvAwAML87AqlkpOMSqFu39gWcuI165fkUhugUCWQ&oe=67D27C7B&_nc_sid=7a9f4b",
            position: { top: "200px", right: "20px" },
            hasNotification: false
        },
      //shiro
        {
            url: "https://www.instagram.com/direct/t/17851497815494939/",
            image: "https://instagram.fdac99-1.fna.fbcdn.net/v/t51.29350-15/464263413_1466046647403823_5172276388907237859_n.heic?stp=dst-jpg_e35_p1080x1080_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=instagram.fdac99-1.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2AH4ZVhqkRUrXhej2bHVSMXuVnkj1Xc0-S_adxGB4I30QMpJeRBckaug4mk-RfMMj9w&_nc_ohc=ypVADUoOgC0Q7kNvgEq9AmD&_nc_gid=309adb9f67904df3ae0098acc8049301&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzQ4NDI3ODc4MTE2NTUwOTkxMw%3D%3D.3-ccb7-5&oh=00_AYENhyltW4dMWtzIKjRJ0ZK4fKQr35LSRe9NNDmMbrMYxg&oe=67D286A0&_nc_sid=7a9f4b",
            position: { top: "140px", right: "20px" },
            hasNotification: false
        },

    ];

    const bubbleSize = "40px";
    const notificationSize = "18px"; // Size of the red notification dot.

    // Create bubbles
    bubbles.forEach(bubbleData => {
        const bubble = document.createElement('div');
        bubble.style.position = 'fixed';
        bubble.style.width = bubbleSize;
        bubble.style.height = bubbleSize;
        bubble.style.borderRadius = '50%';
        bubble.style.backgroundImage = `url(${bubbleData.image})`;
        bubble.style.backgroundSize = 'cover';
        bubble.style.cursor = 'pointer';
        bubble.style.zIndex = '1000';
        bubble.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        bubble.style.transition = 'transform 0.2s ease-in-out';

        // Set position
        Object.entries(bubbleData.position).forEach(([key, value]) => {
            bubble.style[key] = value;
        });

        // Notification dot
        const notificationDot = document.createElement('div');
        notificationDot.style.position = 'absolute';
        notificationDot.style.top = '-5px'; // Position the dot in the top right corner
        notificationDot.style.right = '-5px';
        notificationDot.style.width = notificationSize;
        notificationDot.style.height = notificationSize;
        notificationDot.style.borderRadius = '50%';
        notificationDot.style.backgroundColor = 'red';
        notificationDot.style.display = bubbleData.hasNotification ? 'block' : 'none'; // Initially hidden
        bubble.appendChild(notificationDot);

        // Hover effect
        bubble.addEventListener('mouseover', () => {
            bubble.style.transform = 'scale(1.1)';
        });

        bubble.addEventListener('mouseout', () => {
            bubble.style.transform = 'scale(1)';
        });

        // Click event
        bubble.addEventListener('click', () => {
            window.open(bubbleData.url, '_blank');
            // Clear notification when clicked
            bubbleData.hasNotification = false;
            notificationDot.style.display = 'none';
        });

        // Append to body
        document.body.appendChild(bubble);

        // Fade-in animation
        bubble.style.opacity = '0';
        let opacity = 0;
        const fadeIn = setInterval(() => {
            opacity += 0.1;
            bubble.style.opacity = opacity.toString();
            if (opacity >= 1) {
                clearInterval(fadeIn);
            }
        }, 50);

        // Function to simulate a new message (for testing)
        // In a real scenario, you'd need to check the Instagram API or website for new messages.
        function simulateNewMessage() {
            bubbleData.hasNotification = true;
            notificationDot.style.display = 'block';
        }

        // Simulate a new message after a random time (for testing)
        // setInterval(() => {
        //     simulateNewMessage();
        // }, Math.random() * 60000 + 10000); // Random time between 10 and 70 seconds.
        // uncomment the above section to simulate notifications.
    });

    // Style adjustments
    GM_addStyle(`
        /* Add any additional styling here */
    `);
})();
