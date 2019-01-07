class ThirtySixViewsApp {
  //----------
  constructor() {
    //----------
    // DOM Sections
    this.mainSection = document.querySelector('main');
    this.introSection = document.querySelector('.intro');
    this.aboutSection = document.querySelector('.about-section');
    this.bioSection = document.querySelector('.bio-section');
    this.indexSection = document.querySelector('.index-section');
    this.mainImage = document.querySelector('.main-image');
    this.introSection = 'about';

    //----------
    // OSD MODE
    this.openSeadragonShown = false;
    this.infoModalShown = false;
    this.openSeadragonViewer = document.querySelector('#openseadragon');
    this.osdBackButton = document.querySelector('.osd-back-button');
    this.osdInfoButton = document.querySelector('.source-info-button');
    this.infoModal = document.querySelector('.controls-info-modal');
    this.contentBlocker = document.querySelector('.content-blocker');
    this.columns = 6;
    this.rows = 6;

    // this.metadataElement = this.makeMetadataElement();

    this.introNavButtons = [
      {
        key: 'about',
        el: document.querySelector('#about-btn')
      },
      {
        key: 'bio',
        el: document.querySelector('#bio-btn')
      },
      {
        key: 'gallery',
        el: document.querySelector('#gallery-btn')
      }
    ];

    this.addButtonListeners();
    this.getMetadata(this.saveMetadata);
  }

  //----------
  addButtonListeners = () => {
    //----------
    // Main Navigation
    this.introNavButtons.forEach(function(button) {
      button.el.addEventListener('click', function() {
        if (button.key === 'about') {
          App.introSection = 'about';
          App.aboutSection.classList.remove('hidden');
          App.bioSection.classList.add('hidden');
          App.mainImage.classList.remove('hidden');
          App.mainImage.classList.add('main-collage');
          App.mainImage.classList.remove('main-portrait');
        } else if (button.key === 'bio') {
          App.introSection = 'bio';
          App.aboutSection.classList.add('hidden');
          App.bioSection.classList.remove('hidden');
          App.mainImage.classList.remove('hidden');
          App.mainImage.classList.remove('main-collage');
          App.mainImage.classList.add('main-portrait');
        } else if (button.key === 'gallery') {
          App.toggleOpenSeadragon();
        }
      });
    });

    // OSD NAVIGATION
    this.osdBackButton.addEventListener('click', this.toggleOpenSeadragon);
    this.osdInfoButton.addEventListener('click', this.toggleInfoModal);
    this.contentBlocker.addEventListener('click', this.toggleInfoModal);
  };

  //----------
  toggleOpenSeadragon = () => {
    if (!this.openSeadragonShown) {
      this.openSeadragonShown = true;
      this.mainSection.classList.add('hidden');
      this.openSeadragonViewer.classList.remove('hidden');
      this.createOSDViewer();
    } else {
      this.openSeadragonShown = false;
      this.mainSection.classList.remove('hidden');
      this.openSeadragonViewer.classList.add('hidden');
      this.hideOSDViewer();
    }
  };

  //----------
  toggleInfoModal = () => {
    if (!this.infoModalShown) {
      this.infoModalShown = true;
      this.infoModal.classList.remove('fade-out');
      this.contentBlocker.classList.remove('fade-out');
      this.infoModal.classList.add('fade-in');
      this.contentBlocker.classList.add('fade-in');
    } else {
      this.closeInfoModal();
    }
  };

  //----------
  closeInfoModal = () => {
    this.infoModalShown = false;
    this.infoModal.classList.remove('fade-in');
    this.contentBlocker.classList.remove('fade-in');
    this.infoModal.classList.add('fade-out');
    this.contentBlocker.classList.add('fade-out');
  };

  //----------
  createOSDViewer = () => {
    const hokusaiDziSet = [];

    for (let i = 1; i <= 36; i++) {
      let path = `../assets/tilesources/hokusai-${i}.dzi`;

      hokusaiDziSet.push(path);
    }

    this.viewer = OpenSeadragon({
      id: 'openseadragon',
      prefixUrl: '../lib/openseadragon/images/',
      tileSources: hokusaiDziSet,
      showNavigator: false,
      defaultZoomLevel: 0,
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
        clickToZoom: true
      },
      placeholderFillStyle: 'rgba(0, 0, 0, 0.2)'
    });

    this.viewer.addHandler('open', function() {
      App.arrangeImages();
      App.createOSDOverlays();
      console.log(App.viewer.viewport);
      let oldBounds = App.viewer.viewport.getBounds();
      let newBounds = new OpenSeadragon.Rect(
        -0.75,
        2.2,
        10,
        oldBounds.height / oldBounds.width
      );
      App.viewer.viewport.fitBounds(newBounds, true);
    });
  };

  //----------
  arrangeImages = () => {
    let count = this.viewer.world.getItemCount();
    let i, bounds, tiledImage;
    let width = 0;
    let height = 0;
    let gap = 0.5;
    let x = 0;
    let y = 0;
    let column = 0;
    let row = 0;

    // Iterate through the images
    for (i = 0; i < count; i++) {
      // Get contextual information on image[i]
      // Width and height to set the dimensions in the world:
      // - Must be collected because each image has a different width/height
      // -- Otherwise there could be overlap
      tiledImage = this.viewer.world.getItemAt(i);
      bounds = tiledImage.getBounds();

      // Sets width/height to its space in viewport coordinates
      width = bounds.width;
      height = bounds.height;

      // Sets top-left corner of each image starting with (0, 0):
      // - X and Y will be adjusted by the previous images bounds.width/height.
      let pos = new OpenSeadragon.Point(x, y);

      // Checks if the bounds width is greater than the bounds height
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
      }

      // Actually moves that image to the calculated position
      tiledImage.setPosition(pos, true);

      // Gives the image it's position in our grid
      tiledImage.hokusai = {
        column: column,
        row: row
      };

      // Once the position has been set, it moves to the next column space
      column++;

      // Sets the x where the next image will go to the cumulative bounds.width
      // of the images before it plus the gap (margin).
      x += width + gap;

      // Checks if the image[i] has reached the final column
      if (i > 0 && i % this.columns === this.columns - 1) {
        // If it has, set the x back to the beginning column pos
        x = 0;
        // Beginning column counter over again.
        column = 0;
        // Sets the y so it starts where the next row should go, which is the
        // cumulative of bounds height of the images before it plus the gap (margin)
        y += height + gap;
        // Add to the row counter
        row++;
      }
    }
  };

  //----------
  createOSDOverlays = () => {
    const overlay = this.viewer.svgOverlay();
    const svgWrapper = overlay.node();

    let count = this.viewer.world.getItemCount();
    let i, bounds, tiledImage;

    for (i = 0; i < count; i++) {
      // console.log('make card overlay', i);
      let metadata = this.hokusaiData[i];
      tiledImage = this.viewer.world.getItemAt(i);
      bounds = tiledImage.getBounds();

      // Initialize SVG.js Wrapper
      let draw = SVG(svgWrapper).size('100vw', '100vh');
      let card = draw.nested();

      // Make Card Rectangle
      let rect = card.rect(0.3, 0.1).attr({
        fill: '#fffcf7',
        stroke: 'rgba(0, 0, 0, 0.08)',
        'stroke-width': 0.02
      });

      // Move Card
      card.move(bounds.x, bounds.y - 0.125);

      // Make Card Text;
      this.makeCardText(draw, card, bounds, i);
    }

    // Add resize handler
    this.viewer.addHandler('resize', function() {
      overlay.resize();
    });
  };

  //----------
  makeCardText = (draw, card, bounds, i) => {
    const metadata = this.hokusaiData[i];
    let lineThreshold = 45;
    let titleKanji = metadata.titleKanji;
    let titleJp = metadata.titleJp;
    let titleEng = metadata.titleEng;
    let lastIdealSpaceIndex = titleEng.lastIndexOf(' ', lineThreshold);
    let lastIdealPeriodIndex = titleEng.lastIndexOf('.', lineThreshold);
    let indexToSplitLineAt =
      lastIdealPeriodIndex > lastIdealSpaceIndex ?
        titleEng.lastIndexOf('.', lineThreshold) :
        titleEng.lastIndexOf(' ', lineThreshold);

    let titleEngIsOneLiner = titleEng.length <= lineThreshold;

    let collectionNumberPosX = titleEngIsOneLiner ? 0.242 : 0.27;
    let collectionNumberPosY = titleEngIsOneLiner ? 0.01 : 0.03;

    let titleEngLine1 =
      titleEng.length <= lineThreshold ?
        null :
        titleEng.slice(0, indexToSplitLineAt);

    let titleEngLine2 =
      titleEng.length > lineThreshold ?
        titleEng.slice(indexToSplitLineAt) :
        null;

    let collectionNumber = metadata.key;

    let text = card.text(function(add) {
      add
        .tspan(titleKanji)
        .font({ 'font-size': 0.01, 'font-weight': 200 })
        .attr('letter-spacing', '.003px')
        .newLine();
      add
        .tspan(titleJp)
        .font({ 'font-size': 0.01, 'font-style': 'italic' })
        .newLine();

      if (titleEngIsOneLiner) {
        add
          .tspan(titleEng)
          .font({ 'font-size': 0.01 })
          .newLine();
      } else {
        add
          .tspan(titleEngLine1)
          .font({ 'font-size': 0.01 })
          .newLine();
        add
          .tspan(titleEngLine2)
          .font({ 'font-size': 0.01 })
          .newLine();
      }

      add
        .tspan(collectionNumber)
        .font({ 'font-size': 0.01, 'font-weight': 200 })
        .move(collectionNumberPosX, collectionNumberPosY);
    });

    text.font('family', 'Noto Sans JP');

    this.alignCardText(bounds, titleEngIsOneLiner, titleEngLine1, i);
  };

  //----------
  alignCardText = (bounds, titleEngIsOneLiner, titleEngLine1, i) => {
    let textCollection = document.querySelectorAll('[id*="SvgjsText"]');
    let engLine, engLine1, engLine2;

    textCollection.forEach(function(collection) {
      let kanjiLine = collection.children[0];
      let jpLine = collection.children[1];
      let engLine = titleEngIsOneLiner ? collection.children[2] : null;
      let engLine1 = titleEngIsOneLiner ? null : collection.children[2];
      let engLine2 = titleEngIsOneLiner ? null : collection.children[3];

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
  };

  //----------
  getMetadata = callback => {
    const request = new XMLHttpRequest();
    let data;
    request.open('GET', '../data/hokusai-metadata.json', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        data = JSON.parse(request.responseText);
        callback(data);
      } else {
        // We reached our target server, but it returned an error
        console.error(
          request.status,
          'There was a retrieval error of some sort'
        );
      }

      return data;
    };

    request.onerror = function() {
      console.error('There was a connection error of some sort');
    };

    request.send();
  };

  //----------
  saveMetadata = data => {
    this.hokusaiData = data;
  };

  //----------
  hideOSDViewer = () => this.openSeadragonViewer.classList.add('hidden');

  //----------
  setTiledImagePlaceholder = (tiledImage, ctx) => {
    console;
    let img = new Image();
    img.src = '../assets/bg/felt.png';
    img.onload = function() {
      let pattern = ctx.createPattern(img, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, 300, 300);
    };
  };
}

const App = new ThirtySixViewsApp();
