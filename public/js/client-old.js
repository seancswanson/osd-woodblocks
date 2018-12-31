(function() {
  //----------
  var mainSection = document.querySelector('main');
  var introSection = document.querySelector('.intro');
  var aboutSection = document.querySelector('.about-section')
  var bioSection = document.querySelector('.bio-section')
  var indexSection = document.querySelector('.index-section')
  var introImage = document.querySelector('.intro-image');
  console.log(introImage);
  var mobileSize = window.matchMedia('(max-width: 600px)')
  var openSeadragonViewer = document.querySelector('#openseadragon');

  var introNavButtons = [{
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

  window.App = {
    init: function() {
      var self = this;
      this.openSeadragonShown = false;
      this.introSection = 'about';
      // mobileSize.onchange = App.adjustIntroImage(App.introSection);
      console.log(mobileSize);

      introNavButtons.forEach(function(button) {
        console.log(button.el);
        button.el.addEventListener('click', function() {
          if (button.key === 'about') {
            this.introSection = 'about';
            aboutSection.classList.remove('hidden');
            bioSection.classList.add('hidden');
            indexSection.classList.add('hidden');
            introImage.classList.remove('hidden');
            introImage.classList.add('intro-collage');
            introImage.classList.remove('intro-portrait');
            introSection.style.gridTemplateColumns = '';
          } else if (button.key === 'bio') {
            this.introSection = 'bio';
            aboutSection.classList.add('hidden');
            bioSection.classList.remove('hidden');
            indexSection.classList.add('hidden');
            introImage.classList.remove('hidden');
            introImage.classList.remove('intro-collage');
            introImage.classList.add('intro-portrait');
            introSection.style.gridTemplateColumns = '';
          } else if (button.key === 'gallery') {
            self.toggleOpenSeadragon();
            introSection.classList.add('hidden');
            introImage.classList.add('hidden');
          }
        });
      });
    },
    toggleOpenSeadragon: function() {
      var self = this;
      if (!this.openSeadragonShown) {
        this.openSeadragonShown = !this.openSeadragonShown;
        mainSection.classList.add('hidden');
        openSeadragonViewer.style.display = 'block';
        var viewer = OpenSeadragon({
          id: 'openseadragon',
          prefixUrl: '../lib/openseadragon/images/',
          tileSources: '/assets/hokusai-great.dzi',
          showNavigator: true
        });
      } else {
        this.openSeadragonShown = !this.openSeadragonShown;
        mainSection.classList.remove('hidden');
        openSeadragonViewer.style.display = 'none';
        viewer.destroy();
      }
    },
    adjustIntroImage: function(section) {
      if (mobileSize.matches) {
        console.log('match', mobileSize, arguments);
        if (section === 'about') {
          introImage.style.backgroundPosition = 'center';
          introImage.style.backgroundSize = '150%';
        }
      } else {
        console.log('not ', mobileSize, arguments);
        if (section === 'about') {
          introImage.style.backgroundPosition = 'top left';
          introImage.style.backgroundSize = '400%';
        }
      }
    }
  }

  App.init();

})();
