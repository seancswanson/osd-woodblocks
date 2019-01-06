"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ThirtySixViewsApp = //----------
function ThirtySixViewsApp() {
  var _this = this;

  _classCallCheck(this, ThirtySixViewsApp);

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


    _this.osdBackButton.addEventListener('click', _this.toggleOpenSeadragon);

    _this.osdInfoButton.addEventListener('click', _this.toggleInfoModal);

    _this.contentBlocker.addEventListener('click', _this.toggleInfoModal);
  });

  _defineProperty(this, "toggleOpenSeadragon", function () {
    if (!_this.openSeadragonShown) {
      _this.openSeadragonShown = true;

      _this.mainSection.classList.add('hidden');

      _this.openSeadragonViewer.classList.remove('hidden');

      _this.createOSDViewer();
    } else {
      _this.openSeadragonShown = false;

      _this.mainSection.classList.remove('hidden');

      _this.openSeadragonViewer.classList.add('hidden');

      _this.hideOSDViewer();
    }
  });

  _defineProperty(this, "toggleInfoModal", function () {
    if (!_this.infoModalShown) {
      _this.infoModalShown = true;

      _this.infoModal.classList.remove('hidden');

      _this.contentBlocker.classList.remove('hidden');
    } else {
      _this.closeInfoModal();
    }
  });

  _defineProperty(this, "closeInfoModal", function () {
    _this.infoModalShown = false;

    _this.infoModal.classList.add('hidden');

    _this.contentBlocker.classList.add('hidden');
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
      zoomInButton: 'osd-zoom-in-button',
      zoomOutButton: 'osd-zoom-out-button',
      fullPageButton: 'osd-full-screen-button',
      homeButton: 'osd-home-button',
      // homeFillsViewer: true,
      visibilityRatio: 0.2,
      gestureSettingsMouse: {
        dblClickToZoom: true,
        clickToZoom: false // collectionMode: true,
        // collectionRows: 6,
        // collectionTileSize: 1024,
        // collectionTileMargin: 256

      }
    });

    _this.viewer.addHandler('open', function () {
      App.arrangeImages();
      App.createOSDOverlays();
    });
  });

  _defineProperty(this, "arrangeImages", function () {
    var count = _this.viewer.world.getItemCount();

    var i, bounds, tiledImage;
    var width = 0;
    var height = 0;
    var gap = 0.5;
    var x = 0;
    var y = 0;
    var column = 0;
    var row = 0; // Iterate through the images

    for (i = 0; i < count; i++) {
      // Get contextual information on image[i]
      // Width and height to set the dimensions in the world:
      // - Must be collected because each image has a different width/height
      // -- Otherwise there could be overlap
      tiledImage = _this.viewer.world.getItemAt(i);
      bounds = tiledImage.getBounds(); // Sets width/height to its space in viewport coordinates

      width = bounds.width;
      height = bounds.height; // Sets top-left corner of each image starting with (0, 0):
      // - X and Y will be adjusted by the previous images bounds.width/height.

      var pos = new OpenSeadragon.Point(x, y); // Checks if the bounds width is greater than the bounds height
      // Logic used to set distance of images from each other related to the row they are on

      if (width > height) {
        // Sets the Y that that row of images will have. Further in the loop,
        // the width ends up greater than what the height bounds of the last set of rows were
        // then knocks the next images down further by the last y diff.
        pos.y += (1 - height) / 2;
      } else {
        // Sets the X that the images will be positioned at as the loop continues.
        // For every image until the last column, only the x is adjusted, otherwise,
        // the condition above dictates the next row to begin.
        pos.x += (1 - width) / 2;
      } // Actually moves that image to the calculated position


      tiledImage.setPosition(pos, true); // Gives the image it's position in our grid

      tiledImage.hokusai = {
        column: column,
        row: row
      }; // Once the position has been set, it moves to the next column space

      column++; // Sets the x where the next image will go to the cumulative bounds.width
      // of the images before it plus the gap (margin).

      x += width + gap; // Checks if the image[i] has reached the final column

      if (i > 0 && i % _this.columns === _this.columns - 1) {
        // If it has, set the x back to the beginning column pos
        x = 0; // Beginning column counter over again.

        column = 0; // Sets the y so it starts where the next row should go, which is the
        // cumulative of bounds height of the images before it plus the gap (margin)

        y += height + gap; // Add to the row counter

        row++;
      }
    }
  });

  _defineProperty(this, "createOSDOverlays", function () {
    var overlay = _this.viewer.svgOverlay();

    var svgWrapper = overlay.node();

    var count = _this.viewer.world.getItemCount();

    var i, bounds, tiledImage;

    for (i = 0; i < count; i++) {
      console.log('make card overlay', i);
      var metadata = _this.hokusaiData[i];
      tiledImage = _this.viewer.world.getItemAt(i);
      bounds = tiledImage.getBounds(); // Initialize SVG.js Wrapper

      var draw = SVG(svgWrapper).size('100vw', '100vh');
      var card = draw.nested(); // Make Card Rectangle

      var rect = card.rect(0.3, 0.1).attr({
        fill: '#fffcf7',
        stroke: 'rgba(0, 0, 0, 0.08)',
        'stroke-width': 0.02
      }); // Move Card

      card.move(bounds.x, bounds.y - 0.125); // Make Card Text;

      _this.makeCardText(draw, card, bounds, i);
    } // Align Card Text

  });

  _defineProperty(this, "makeCardText", function (draw, card, bounds, i) {
    var metadata = _this.hokusaiData[i];
    var lineThreshold = 45;
    var titleKanji = metadata.titleKanji;
    var titleJp = metadata.titleJp;
    var titleEng = metadata.titleEng;
    var lastIdealSpaceIndex = titleEng.lastIndexOf(' ', lineThreshold);
    var lastIdealPeriodIndex = titleEng.lastIndexOf('.', lineThreshold);
    var indexToSplitLineAt = lastIdealPeriodIndex > lastIdealSpaceIndex ? titleEng.lastIndexOf('.', lineThreshold) : titleEng.lastIndexOf(' ', lineThreshold);
    var titleEngIsOneLiner = titleEng.length <= lineThreshold;
    var collectionNumberPosX = titleEngIsOneLiner ? 0.242 : 0.27;
    var collectionNumberPosY = titleEngIsOneLiner ? 0.01 : 0.03;
    console.log('make card text', i);
    var titleEngLine1 = titleEng.length <= lineThreshold ? null : titleEng.slice(0, indexToSplitLineAt);
    var titleEngLine2 = titleEng.length > lineThreshold ? titleEng.slice(indexToSplitLineAt) : null; // console.log(titleEng, titleEngLine1, titleEngLine2);

    var collectionNumber = metadata.key;
    var text = card.text(function (add) {
      add.tspan(titleKanji).font({
        'font-size': 0.01,
        'font-weight': 200
      }).attr('letter-spacing', '.003px').newLine();
      add.tspan(titleJp).font({
        'font-size': 0.01,
        'font-style': 'italic'
      }).newLine();

      if (titleEngIsOneLiner) {
        add.tspan(titleEng).font({
          'font-size': 0.01
        }).newLine();
      } else {
        add.tspan(titleEngLine1).font({
          'font-size': 0.01
        }).newLine();
        add.tspan(titleEngLine2).font({
          'font-size': 0.01
        }).newLine();
      }

      add.tspan(collectionNumber).font({
        'font-size': 0.01,
        'font-weight': 200
      }).move(collectionNumberPosX, collectionNumberPosY);
    });
    text.font('family', 'Noto Sans JP');

    _this.alignCardText(bounds, titleEngIsOneLiner, titleEngLine1, i);
  });

  _defineProperty(this, "alignCardText", function (bounds, titleEngIsOneLiner, titleEngLine1, i) {
    var textCollection = document.querySelectorAll('[id*="SvgjsText"]');
    var engLine, engLine1, engLine2;
    console.log(titleEngLine1);
    textCollection.forEach(function (collection) {
      var kanjiLine = collection.children[0];
      var jpLine = collection.children[1];
      var engLine = titleEngIsOneLiner ? collection.children[2] : null;
      var engLine1 = titleEngIsOneLiner ? null : collection.children[2];
      var engLine2 = titleEngIsOneLiner ? null : collection.children[3];
      kanjiLine.setAttribute('dx', 0.03);
      kanjiLine.setAttribute('dy', 0.016);
      jpLine.setAttribute('dx', 0.03);
      jpLine.setAttribute('dy', 0.016);

      if (!titleEngIsOneLiner) {
        engLine1.setAttribute('dx', 0.03);
        engLine1.setAttribute('dy', 0.016);
        engLine2.setAttribute('dx', 0.029);
        engLine2.setAttribute('dy', 0.016);
      } else {
        engLine.setAttribute('dx', 0.03);
        engLine.setAttribute('dy', 0.016);
      }

      collection.setAttribute('y', 0.017);
    });
  });

  _defineProperty(this, "getMetadata", function (callback) {
    var request = new XMLHttpRequest();
    var data;
    request.open('GET', '../data/hokusai-metadata.json', true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        data = JSON.parse(request.responseText);
        callback(data);
      } else {
        // We reached our target server, but it returned an error
        console.error(request.status, 'There was a retrieval error of some sort');
      }

      return data;
    };

    request.onerror = function () {
      console.error('There was a connection error of some sort');
    };

    request.send();
  });

  _defineProperty(this, "saveMetadata", function (data) {
    _this.hokusaiData = data;
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
  this.mainImage = document.querySelector('.main-image');
  this.introSection = 'about'; //----------
  // OSD MODE

  this.openSeadragonShown = false;
  this.infoModalShown = false;
  this.openSeadragonViewer = document.querySelector('#openseadragon');
  this.osdBackButton = document.querySelector('.osd-back-button');
  this.osdInfoButton = document.querySelector('.source-info-button');
  this.infoModal = document.querySelector('.controls-info-modal');
  this.contentBlocker = document.querySelector('.content-blocker');
  this.columns = 6;
  this.rows = 6; // this.metadataElement = this.makeMetadataElement();

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
  this.addButtonListeners();
  this.getMetadata(this.saveMetadata);
} //----------
;

var App = new ThirtySixViewsApp();
