"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ThirtySixViewsApp = //----------
function ThirtySixViewsApp() {
  var _this = this;

  _classCallCheck(this, ThirtySixViewsApp);

  _defineProperty(this, "init", function () {
    _this.openSeadragonShown = false;
    _this.introSection = 'about';

    _this.addButtonListeners();
  });

  _defineProperty(this, "addButtonListeners", function () {
    //----------
    // Main Navigation
    _this.introNavButtons.forEach(function (button) {
      button.el.addEventListener('click', function () {
        if (button.key === 'about') {
          App.introSection = 'about';
          App.aboutSection.classList.remove('hidden');
          App.bioSection.classList.add('hidden');
          App.indexSection.classList.add('hidden');
          App.mainImage.classList.remove('hidden');
          App.mainImage.classList.add('main-collage');
          App.mainImage.classList.remove('main-portrait');
        } else if (button.key === 'bio') {
          App.introSection = 'bio';
          App.aboutSection.classList.add('hidden');
          App.bioSection.classList.remove('hidden');
          App.indexSection.classList.add('hidden');
          App.mainImage.classList.remove('hidden');
          App.mainImage.classList.remove('main-collage');
          App.mainImage.classList.add('main-portrait');
        } else if (button.key === 'gallery') {
          App.toggleOpenSeadragon();
        }
      });
    }); // OSD NAVIGATION
    // this.osdBackButton.addEventListener('click', this.toggleOpenSeadragon);

  });

  _defineProperty(this, "toggleOpenSeadragon", function () {
    if (!_this.openSeadragonShown) {
      console.log('trying to show');
      _this.openSeadragonShown = true;

      _this.mainSection.classList.add('hidden');

      console.log(_this.openSeadragonViewer);

      _this.openSeadragonViewer.classList.remove('hidden');

      _this.createOSDViewer();
    } else {
      _this.openSeadragonShown = false;

      _this.mainSection.classList.remove('hidden');

      _this.openSeadragonViewer.classList.add('hidden');

      _this.hideOSDViewer();
    }
  });

  _defineProperty(this, "createOSDViewer", function () {
    var hokusaiDziSet = [];

    for (var i = 1; i <= 36; i++) {
      var path = "../assets/tilesources/hokusai-".concat(i, ".dzi");
      hokusaiDziSet.push(path);
    }

    _this.viewer = OpenSeadragon({
      id: 'openseadragon',
      prefixUrl: '../lib/openseadragon/images/',
      tileSources: hokusaiDziSet,
      showNavigator: false,
      minZoomImageRatio: 1,
      maxZoomPixelRatio: 4,
      homeFillsViewer: true,
      visibilityRatio: 0.9,
      gestureSettingsMouse: {
        dblClickToZoom: true,
        clickToZoom: false
      },
      collectionMode: true,
      collectionRows: 6,
      collectionTileSize: 1024,
      collectionTileMargin: 256
    });
  });

  _defineProperty(this, "hideOSDViewer", function () {
    return _this.openSeadragonViewer.classList.add('hidden');
  });

  //----------
  // DOM Sections
  this.mainSection = document.querySelector('main');
  this.introSection = document.querySelector('.intro');
  this.aboutSection = document.querySelector('.about-section');
  this.bioSection = document.querySelector('.bio-section');
  this.indexSection = document.querySelector('.index-section');
  this.mainImage = document.querySelector('.main-image'); //----------
  // OSD

  this.openSeadragonViewer = document.querySelector('#openseadragon'); // this.osdBackButton = document.querySelector('.osd-back-button');

  this.openSeadragonShown = false;
  this.introNavButtons = [{
    key: 'about',
    el: document.querySelector('#about-btn')
  }, {
    key: 'bio',
    el: document.querySelector('#bio-btn')
  }, {
    key: 'gallery',
    el: document.querySelector('#gallery-btn')
  }];
  this.init();
} //----------
;

var App = new ThirtySixViewsApp();
