// Initialize iTyped, AOS and render the stamp rally UI
(function(){
    var STORAGE_KEY = 'arStampProgress';
    var COMPLETE_FLAG_KEY = 'arStampCompletedShown';

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
        var completeEl = document.getElementById('stamp-complete');
        if (!grid || !prog) return;

        var collectedCount = list.filter(function (x) { return !!progress.ids[x.id]; }).length;
        prog.textContent = '達成状況: ' + collectedCount + ' / ' + list.length + ' 個';

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
            var strings = ["// 研究テーマの選択を待機しています。テーマを選択してください。"];
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
    };
})();


