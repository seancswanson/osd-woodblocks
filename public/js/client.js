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

    //----------
    // OSD
    this.openSeadragonViewer = document.querySelector('#openseadragon');
    this.osdBackButton = document.querySelector('.osd-back-button');
    this.openSeadragonShown = false;

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

    this.init();
  }

  //----------
  init = () => {
    this.openSeadragonShown = false;
    this.introSection = 'about';

    this.addButtonListeners();
  };

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
    });

    // OSD NAVIGATION
    this.osdBackButton.addEventListener('click', this.toggleOpenSeadragon);
  };

  //----------
  toggleOpenSeadragon = () => {
    if (!this.openSeadragonShown) {
      console.log('trying to show');
      this.openSeadragonShown = true;
      this.mainSection.classList.add('hidden');
      console.log(this.openSeadragonViewer);
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
      showNavigator: true,
      collectionMode: true,
      collectionRows: 6,
      collectionTileSize: 1024,
      collectionTileMargin: 256
    });
  };

  //----------
  hideOSDViewer = () => this.openSeadragonViewer.classList.add('hidden');
}

const App = new ThirtySixViewsApp();
