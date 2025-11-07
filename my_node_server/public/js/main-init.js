// Initialize iTyped, AOS and render the stamp rally UI
(function(){
    var STORAGE_KEY = 'arStampProgress';
    var COMPLETE_FLAG_KEY = 'arStampCompletedShown';
    var REWARD_MODAL_SHOWN_KEY = 'arRewardModalShown';
    var CONFETTI_SHOWN_KEY = 'arConfettiShown';

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

    function showRewardModal() {
        var modal = document.getElementById('reward-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    function hideRewardModal() {
        var modal = document.getElementById('reward-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    function showImageModal() {
        var modal = document.getElementById('image-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    function hideImageModal() {
        var modal = document.getElementById('image-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    function downloadImage(imageId, filename) {
        var img = document.getElementById(imageId);
        if (!img) return;
        
        var link = document.createElement('a');
        link.href = img.src;
        link.download = filename || 'kawanobe.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function downloadAllImages() {
        var images = [
            { id: 'reward-image-1', filename: 'kawanobe1.png' },
            { id: 'reward-image-2', filename: 'kawanobe2.png' },
            { id: 'reward-image-3', filename: 'kawanobe3.png' }
        ];
        
        // 少し間隔を空けてダウンロード（ブラウザの制限を回避）
        images.forEach(function(image, index) {
            setTimeout(function() {
                downloadImage(image.id, image.filename);
            }, index * 300);
        });
    }

    function initRewardModal() {
        var rewardYesBtn = document.getElementById('reward-yes');
        var rewardNoBtn = document.getElementById('reward-no');
        var closeImageBtn = document.getElementById('close-image-modal');
        var downloadAllBtn = document.getElementById('download-all-images');

        if (rewardYesBtn) {
            rewardYesBtn.addEventListener('click', function() {
                hideRewardModal();
                showImageModal();
            });
        }

        if (rewardNoBtn) {
            rewardNoBtn.addEventListener('click', function() {
                hideRewardModal();
            });
        }

        if (closeImageBtn) {
            closeImageBtn.addEventListener('click', function() {
                hideImageModal();
            });
        }

        // 個別ダウンロードボタン
        var downloadSingleBtns = document.querySelectorAll('.download-single');
        downloadSingleBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var imageId = this.getAttribute('data-image-id');
                var filename = this.getAttribute('data-filename');
                downloadImage(imageId, filename);
            });
        });

        // すべてダウンロードボタン
        if (downloadAllBtn) {
            downloadAllBtn.addEventListener('click', function() {
                downloadAllImages();
            });
        }

        // モーダル外をクリックしたら閉じる
        var rewardModal = document.getElementById('reward-modal');
        var imageModal = document.getElementById('image-modal');
        
        if (rewardModal) {
            rewardModal.addEventListener('click', function(e) {
                if (e.target === rewardModal) {
                    hideRewardModal();
                }
            });
        }

        if (imageModal) {
            imageModal.addEventListener('click', function(e) {
                if (e.target === imageModal) {
                    hideImageModal();
                }
            });
        }
    }

    function triggerConfetti() {
        try {
            var container = document.getElementById('confetti');
            if (!container) return;
            var colors = ['#22C55E','#3B82F6','#F59E0B','#EF4444','#A855F7','#14B8A6','#F472B6'];
            var pieceCount = Math.min(160, Math.max(80, Math.floor(window.innerWidth / 6)));
            for (var i = 0; i < pieceCount; i++) {
                var piece = document.createElement('div');
                piece.className = 'confetti-piece';
                var size = 6 + Math.random() * 8;
                piece.style.width = size + 'px';
                piece.style.height = (size + 4) + 'px';
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.backgroundColor = colors[(Math.random() * colors.length) | 0];
                piece.style.transform = 'rotate(' + (Math.random()*360) + 'deg)';
                var duration = 3 + Math.random() * 2.5;
                piece.style.animationDuration = duration + 's';
                container.appendChild(piece);
                (function(p, d){
                    setTimeout(function(){
                        if (p && p.parentNode) p.parentNode.removeChild(p);
                    }, d * 1000 + 200);
                })(piece, duration);
            }
        } catch (e) {}
    }

    // ===== 背景アニメーション（星/パーティクル + パララックス） =====
    function initAnimatedBackground() {
        try {
            var reduceMotion = false;
            try {
                reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            } catch (e) {}
            if (reduceMotion) return;

            var canvas = document.getElementById('bg-canvas');
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
            var width = 0, height = 0;
            var particles = [];
            var mouseOffsetX = 0, mouseOffsetY = 0;

            function resize() {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = Math.floor(width * dpr);
                canvas.height = Math.floor(height * dpr);
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                spawnParticles();
            }

            function spawnParticles() {
                var target = Math.round(Math.min(220, Math.max(100, width * height / 8000)));
                particles.length = 0;
                for (var i = 0; i < target; i++) {
                    var depth = Math.random(); // 0 (近) ~ 1 (遠)
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        vx: (Math.random() - 0.5) * (0.15 + 0.35 * (1 - depth)),
                        vy: (Math.random() - 0.5) * (0.15 + 0.35 * (1 - depth)),
                        r: 0.8 + 2.2 * (1 - depth),
                        a: 0.5 + 0.5 * Math.random(),
                        tw: Math.random() * Math.PI * 2,
                        tws: 0.005 + 0.02 * Math.random(),
                        hue: 180 + Math.random() * 120,
                        depth: depth
                    });
                }
            }

            function draw(t) {
                ctx.clearRect(0, 0, width, height);
                var parallaxX = mouseOffsetX * 8;
                var parallaxY = mouseOffsetY * 8;
                for (var i = 0; i < particles.length; i++) {
                    var p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    // 端でラップ
                    if (p.x < -10) p.x = width + 10;
                    if (p.x > width + 10) p.x = -10;
                    if (p.y < -10) p.y = height + 10;
                    if (p.y > height + 10) p.y = -10;

                    // 瞬き
                    p.tw += p.tws;
                    var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));

                    // パララックス（遠いほど動きが小さい）
                    var px = p.x + parallaxX * p.depth;
                    var py = p.y + parallaxY * p.depth;

                    // グローする円
                    var grad = ctx.createRadialGradient(px, py, 0, px, py, p.r * 3);
                    grad.addColorStop(0, 'hsla(' + p.hue + ', 80%, 70%, ' + (alpha * 0.9) + ')');
                    grad.addColorStop(1, 'hsla(' + p.hue + ', 80%, 70%, 0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(px, py, p.r * 3, 0, Math.PI * 2);
                    ctx.fill();

                    // コア部分
                    ctx.fillStyle = 'hsla(' + p.hue + ', 90%, 85%, ' + Math.min(1, alpha + 0.2) + ')';
                    ctx.beginPath();
                    ctx.arc(px, py, p.r, 0, Math.PI * 2);
                    ctx.fill();
                }
                rafId = requestAnimationFrame(draw);
            }

            function onPointerMove(e) {
                var cx = width / 2;
                var cy = height / 2;
                var x = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) || cx;
                var y = (e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY) || cy;
                mouseOffsetX = (x - cx) / width;  // -0.5 ~ 0.5
                mouseOffsetY = (y - cy) / height; // -0.5 ~ 0.5
            }

            var rafId = 0;
            window.addEventListener('resize', resize, { passive: true });
            window.addEventListener('mousemove', onPointerMove, { passive: true });
            window.addEventListener('touchmove', onPointerMove, { passive: true });
            resize();
            rafId = requestAnimationFrame(draw);
        } catch (e) {}
    }

    function renderStampUI() {
        var list = [
            { id: 'moritaMarker', label: '森田' },
            { id: 'aikawaMarker', label: '相川' },
            { id: 'asakawa', label: '浅川' },
            { id: 'ikeuchi', label: '池内' },
            { id: 'iwata', label: '岩田' },
            { id: 'kobayashi', label: '小林' },
            { id: 'kumada', label: '熊田' },
            { id: 'kurosawa', label: '黒澤' },
            { id: 'miura', label: '三浦' },
            { id: 'moriya', label: '森谷' },
            { id: 'motone', label: '元根' },
            { id: 'naruse', label: '成瀬' },
            { id: 'nedu', label: '根津' },
            { id: 'nishino', label: '西野' },
            { id: 'nogawa', label: '野川' },
            { id: 'oikawa', label: '及川' },
            { id: 'onigata', label: '鬼形' },
            { id: 'owari', label: '尾張' },
            { id: 'sakumaMarker', label: '佐久間' },
            { id: 'satou', label: '佐藤' },
            { id: 'shimamura', label: '島村' },
            { id: 'toriiMarker', label: '鳥居' },
            { id: 'toyama', label: '外山' },
            { id: 'yamaguchi', label: '山口' }
        ];

        var progress = loadProgress();
        var grid = document.getElementById('stamp-grid');
        var prog = document.getElementById('stamp-progress');
        var progBar = document.getElementById('stamp-progressbar');
        var completeEl = document.getElementById('stamp-complete');
        if (!grid || !prog) return;

        var collectedCount = list.filter(function (x) { return !!progress.ids[x.id]; }).length;
        prog.textContent = '達成状況: ' + collectedCount + ' / ' + list.length + ' 個';
        if (progBar) {
            var percent = Math.round((collectedCount / list.length) * 100);
            progBar.style.width = percent + '%';
        }

        if (completeEl) {
            var isCompleted = collectedCount === list.length;
            if (isCompleted) {
                completeEl.classList.add('show');
                try {
                    var shown = localStorage.getItem(COMPLETE_FLAG_KEY);
                    if (!shown) {
                        localStorage.setItem(COMPLETE_FLAG_KEY, '1');
                        setTimeout(function(){ alert('コンプリート達成！おめでとうございます！'); }, 100);
                    }
                    // リワードモーダルを表示（一度だけ）
                    var rewardShown = localStorage.getItem(REWARD_MODAL_SHOWN_KEY);
                    if (!rewardShown) {
                        setTimeout(function() {
                            showRewardModal();
                            localStorage.setItem(REWARD_MODAL_SHOWN_KEY, '1');
                        }, 500);
                    }
                    // コンフェッティ（一度だけ）
                    var confettiShown = localStorage.getItem(CONFETTI_SHOWN_KEY);
                    if (!confettiShown) {
                        setTimeout(function(){ triggerConfetti(); }, 200);
                        localStorage.setItem(CONFETTI_SHOWN_KEY, '1');
                    }
                } catch (e) {}
            } else {
                completeEl.classList.remove('show');
            }
        }

        grid.innerHTML = '';
        list.forEach(function (item, index) {
            var wrap = document.createElement('div');
            wrap.className = 'stamp-item';

            var circle = document.createElement('div');
            var isCollected = !!progress.ids[item.id];
            circle.className = 'stamp-circle' + (isCollected ? ' collected' : '');
            circle.textContent = isCollected ? 'GET' : (index + 1);

            var label = document.createElement('div');
            label.className = 'stamp-label';
            label.textContent = item.label;

            wrap.appendChild(circle);
            wrap.appendChild(label);
            grid.appendChild(wrap);
        });
    }

    window.onload = function () {
        // iTyped 初期化
        try {
            var strings = ["研究テーマの選択を待機しています。テーマを選択してください。"];
            if (window.ityped && ityped.init) {
                ityped.init(document.querySelector('#main-typing'), {
                    strings: strings,
                    loop: true,
                    typeSpeed: 80,
                    backSpeed: 40,
                    backDelay: 60000,
                    startDelay: 500,
                    showCursor: true
                });
            }
        } catch (e) {}

        // AOS 初期化
        try {
            if (window.AOS) {
                AOS.init({
                    once: true,
                    easing: 'ease-out-back',
                    duration: 1000
                });
            }
        } catch (e) {}

        // スタンプUI描画
        renderStampUI();
        
        // リワードモーダル初期化
        initRewardModal();

        // 背景アニメーション初期化
        initAnimatedBackground();
    };
})();


