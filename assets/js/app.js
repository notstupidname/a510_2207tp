(function() {
"use strict"

const body = document.querySelector('body');
const nav = document.querySelector('#nav');
const navToggle = document.querySelector('a[href="#nav"]');
const navClose = document.querySelector('#nav .close');

let hideNav = () => {
    nav.classList.remove('visible');
    body.classList.remove('menu-visible');
}

let toggleNav = () => {
    nav.classList.toggle('visible');
    body.classList.toggle('menu-visible');
}

//Hide nav on body click
body.addEventListener('click', (e) => {
    if (body.classList.contains('menu-visible')) {
        e.preventDefault();
        e.stopPropagation();
        hideNav();
    }
}, false);

nav.addEventListener('click', (e) => {
    e.stopPropagation();
}, false);

navToggle.addEventListener('click', (e) =>{
    e.preventDefault();
    e.stopPropagation();
    toggleNav();
}, false);
navClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideNav();
}, false);

// Transition effect
let transition = function(e) {
    let href = this.getAttribute('href');
    let target = this.getAttribute('target');
    if (!href || href.indexOf('#') != -1 || href.indexOf('tel') != -1 || href.indexOf('wa.me') != -1 || href.indexOf('mailto') != -1 || target == '_blank')
        return;
    e.preventDefault();
    e.stopPropagation();
    hideNav();
    body.classList.add('transition');
    window.setTimeout(function() {
        window.location.href = href;
    }, 250);
}

body.addEventListener('click', function(e) {
    for (let target = e.target; target && target != this; target = target.parentNode) {
        if (target.matches('a')) {
            transition.call(target, e);
            break;
        }
    }
}, false);

nav.addEventListener('click', function(e) {
    for (let target = e.target; target && target != this; target = target.parentNode) {
        if (target.matches('a')) {
            transition.call(target, e);
            break;
        }
    }
}, false);

// Remove transition if page loaded from bfcache
window.addEventListener('pageshow', (e) => {
    if (e.persisted === true) {
        body.classList.remove('transition');
    }
}, false);

// Loading animation
window.addEventListener('DOMContentLoaded', () => {
    body.classList.remove('is-loading');
    body.classList.remove('transition');
});

// Logo Animation
const logo = document.querySelector('#nav a.logo');
logo.addEventListener('mouseenter', () => {
    logo.dataset.counter = parseInt(Math.floor(Math.random()*3));
    if (Math.random() < 0.05){
        logo.dataset.counter = "3";
    };
}, false);

// Popups open
const popupOpeners = document.querySelectorAll('.popup-opener');
for (const popupOpener of popupOpeners) {
    popupOpener.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        const popup_id = this.dataset.popup;
        const popupEl = document.getElementById(popup_id);
        if (popupEl) {
            popupEl.classList.remove("fhide");
            popupEl.classList.add("fade-in");
        }
        const overlayEl = document.querySelector('.global_overlay');
        if (overlayEl) {
            overlayEl.classList.remove("hide");
            overlayEl.classList.add("fade-in");
        }
    })
}

// Popups close
const popupCloseAll = document.querySelectorAll('.popup_close');
for (const popupClose of popupCloseAll) {
    popupClose.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        const popup_id_string = this.dataset.popup;
        const popup_id_array = popup_id_string.split(' ');
        for (const popup_id of popup_id_array) {
            const popupEl = document.getElementById(popup_id);
            if (popupEl) {
                popupEl.classList.remove("fade-in");
                popupEl.classList.add("fade-out");
                window.setTimeout(function() {
                    popupEl.classList.add("fhide");
                    popupEl.classList.remove("fade-out");
                }, 250, popupEl);
            }
        }
        const overlayEl = document.querySelector('.global_overlay');
        if (overlayEl) {
            overlayEl.classList.remove("fade-in");
            overlayEl.classList.add("fade-out");
            window.setTimeout(function() {
                overlayEl.classList.add("hide");
                overlayEl.classList.remove("fade-out");
            }, 250, overlayEl);
        }
    })
}

// Scroll to top
const arrowToTop = document.querySelector('a.top');
if (arrowToTop) {
    arrowToTop.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, 0);
    });
};

// Form submission
const formsAll = document.querySelectorAll('.ajax-form');
for (const form of formsAll) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = "https://worker-email.notstupid.workers.dev/"

        const form_loading = this.parentNode.querySelector('.form-loading');
        const form_success = this.parentNode.querySelector('.form-success');
        const form_error = this.parentNode.querySelector('.form-error');

        const payload = {
            name: this.elements["name"].value,
            phone: this.elements["phone"].value,
            email: this.elements["email"] ? this.elements["email"].value:"no_email",
            message: this.elements["message"] ? this.elements["message"].value:"no_message",
            page: this.elements["page"].value
        }
        this.classList.add('fhide');
        form_loading.classList.remove('fhide');
        form_loading.classList.add('fade-in');

        let request = new XMLHttpRequest();
        request.open('POST', url);
        // request.setRequestHeader('Content-type', 'application/json');

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                console.log('Success');
                console.log(this.responseText);
                form_loading.classList.add('fhide');
                form_success.classList.remove('fhide');
                form_success.classList.add('fade-in');
            } else {
                // We reached our target server, but it returned an error
                console.log('Server returned error');
                form_loading.classList.add('fhide');
                form_error.classList.remove('fhide');
                form_error.classList.add('fade-in');
            }
        };
        request.onerror = function() {
            console.log('Connection error');
            form_loading.classList.add('fhide');
            form_error.classList.remove('fhide');
            form_error.classList.add('fade-in');
        };
        request.send(JSON.stringify(payload));

    }, false);
}

// 2207_TP
const areaLinks = document.querySelectorAll('.area-link');
const svgAreas = document.querySelectorAll('.svg-area');
const shareButton = document.querySelector('#share_button');

for (const areaLink of areaLinks){
    areaLink.addEventListener('mouseover',function(e){
        const areaNumber = this.dataset.area;
        const svgArea = document.querySelector(`.svg-area[data-area="${areaNumber}"]`);
        // console.log(svgArea);
        if (svgArea){
            svgArea.classList.add('area-active');
        };
          
    });

    areaLink.addEventListener('mouseout',function(e){
        const areaNumber = this.dataset.area;
        const svgArea = document.querySelector(`.svg-area[data-area="${areaNumber}"]`);
        // console.log(svgArea);
        if (svgArea){
            svgArea.classList.remove('area-active');
        };
          
    });
};

for (const svgArea of svgAreas){
    svgArea.addEventListener('mouseover',function(e){
        const areaNumber = this.dataset.area;
        const areaLink = document.querySelector(`.area-link[data-area="${areaNumber}"]`);
        // console.log(svgArea);
        if (areaLink){
            areaLink.classList.add('area-active');
        };
          
    });

    svgArea.addEventListener('mouseout',function(e){
        const areaNumber = this.dataset.area;
        const areaLink = document.querySelector(`.area-link[data-area="${areaNumber}"]`);
        // console.log(svgArea);
        if (areaLink){
            areaLink.classList.remove('area-active');
        };
          
    });
}
})();
