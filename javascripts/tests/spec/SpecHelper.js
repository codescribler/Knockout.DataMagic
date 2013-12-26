beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return binder.currentlyPlayingSong === expectedSong &&
             binder.isPlaying;
    }
  });
});
