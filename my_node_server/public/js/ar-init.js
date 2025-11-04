// Register A-Frame component for video handling and attach marker tracking to localStorage
(function(){
    // ---- Video handler for Satou marker ----
    if (window.AFRAME && !AFRAME.components['videohandler']) {
        AFRAME.registerComponent('videohandler', {
            init: function () {
                var videoEl = document.querySelector('#Vid');
                if (!videoEl) {
                    console.error('Video element #Vid not found');
                    return;
                }

                var onLoadedData = function() {
                    videoEl.muted = true;
                    videoEl.play().catch(function(err) {
                        console.log('Video autoplay blocked:', err);
                    });
                };

                if (videoEl.readyState >= 2) {
                    onLoadedData();
                } else {
                    videoEl.addEventListener('loadeddata', onLoadedData);
                }

                var tryPlay = function () {
                    if (videoEl.readyState >= 2) {
                        try {
                            videoEl.muted = true;
                            var p = videoEl.play();
                            if (p && typeof p.catch === 'function') {
                                p.catch(function (err) {
                                    console.log('Video play failed:', err);
                                });
                            }
                        } catch (e) {
                            console.error('Video play error:', e);
                        }
                    }
                };

                this.el.addEventListener('markerFound', function() {
                    tryPlay();
                });
                this.el.addEventListener('markerLost', function () {
                    try {
                        videoEl.pause();
                        videoEl.currentTime = 0;
                    } catch (e) {
                        console.error('Video pause error:', e);
                    }
                });

                var resume = function () {
                    tryPlay();
                    window.removeEventListener('touchend', resume);
                    window.removeEventListener('click', resume);
                };
                window.addEventListener('touchend', resume);
                window.addEventListener('click', resume);
            }
        });
    }

    // ---- Stamp progress tracking to localStorage ----
    var STORAGE_KEY = 'arStampProgress';

    function loadProgress() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ids: {}, count: 0 };
            var data = JSON.parse(raw);
            if (!data || typeof data !== 'object') return { ids: {}, count: 0 };
            if (!data.ids || typeof data.ids !== 'object') data.ids = {};
            if (typeof data.count !== 'number') data.count = Object.keys(data.ids).length;
            return data;
        } catch (e) {
            return { ids: {}, count: 0 };
        }
    }

    function saveProgress(progress) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {}
    }

    function markFound(markerId) {
        if (!markerId) return;
        var progress = loadProgress();
        if (!progress.ids[markerId]) {
            progress.ids[markerId] = Date.now();
            progress.count = Object.keys(progress.ids).length;
            saveProgress(progress);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        try {
            var markers = document.querySelectorAll('a-marker[id]');
            markers.forEach(function (m) {
                m.addEventListener('markerFound', function () {
                    markFound(m.id);
                });
            });
        } catch (e) {}
    });
})();


