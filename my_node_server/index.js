// Expressモジュールを読み込む
const express = require('express');
// Expressアプリケーションのインスタンスを作成
const app = express();
// サーバーが待ち受けるポート番号
const port = 3000;

// 【追加】'public' ディレクトリ内のファイルを静的ファイルとして公開する
// これにより、 http://localhost:3000/index.html でファイルにアクセス可能になる
app.use(express.static('public'));


// ルートパス (/) へのGETリクエストに対する処理
app.get('/', (req, res) => {
  // レスポンスとして文字列を送信
  // ★ ここを直接HTMLファイルを返すように修正します ★
  // res.send('Hello World! Node.js Server is running!'); 
  
  // サーバーの実行ファイルからの相対パスで index.html を送信
  res.sendFile(__dirname + '/public/index.html');
  
  // 備考: 上記で express.static('public') を設定しているため、
  // res.sendFile() の代わりに res.redirect('/index.html') も機能します。
});


// 指定したポートでサーバーを起動
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
