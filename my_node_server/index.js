// Expressモジュールを読み込む
const express = require('express');
// Expressアプリケーションのインスタンスを作成
const app = express();
// サーバーが待ち受けるポート番号
const port = 8000;

// 【追加】'public' ディレクトリ内のファイルを静的ファイルとして公開する
// これにより、 http://localhost:8000/view.html でファイルにアクセス可能になる
app.use(express.static('public'));


// ルートパス (/) へのGETリクエストに対する処理
app.get('/', (req, res) => {
  
  // サーバーの実行ファイルからの相対パスで view.html を送信
  res.sendFile(__dirname + '/public/view.html');
  
});


// 指定したポートでサーバーを起動
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
