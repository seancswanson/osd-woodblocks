(function() {
  //----------
  var mainSection = document.querySelector('main');
  var introSection = document.querySelector('.intro');
  var openSeadragonViewer = document.querySelector('#openseadragon');

  window.App = {
    init: function() {
      this.openSeadragonShown = false;
    },
    toggleOpenSeadragon: function() {
      var self = this;
      if (!this.openSeadragonShown) {
        this.openSeadragonShown = !this.openSeadragonShown;
        mainSection.style.gridTemplateColumns = '1fr 3fr';
        openSeadragonViewer.style.display = 'block';
        var viewer = OpenSeadragon({
          id: 'openseadragon',
          prefixUrl: '../lib/openseadragon/images/',
          tileSources: '/assets/hokusai-great.dzi',
          showNavigator: true
        });
      } else {
        this.openSeadragonShown = !this.openSeadragonShown;
        introSection.style.display = 'block';
        openSeadragonViewer.style.display = 'none';
        viewer.destroy();
      }
    }
  }

  App.init();
})();
