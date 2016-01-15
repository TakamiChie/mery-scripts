// lib.js:Meryスクリプトで汎用的に利用する関数をまとめたライブラリ

var functions = {
  fso: new ActiveXObject('Scripting.FileSystemObject'),
  shell: new ActiveXObject("WScript.Shell"),
  /** ファイル関係 **/
  /**
    *  ファイル名を取得する。
    *  もし、ファイルが未保存であった場合、テンポラリファイルに保存してそれを返す。
    *
    *  return ファイル名
    */
  getFile: function(){
    var fn = document.fullname;
    if(this.fso.fileExists(fn)){
      // ファイルはありまーす
      return fn;
    }else{
      // 一時ファイル生成
      fn = this.createTempPath();
      var s = this.fso.createTextFile(fn, true);
      try{
        s.write(document.text);
      }finally{
        s.close();
      }
      return fn;
    }
  },
  /**
    * テンポラリフォルダのパスを生成して返す。
    *
    * return テンポラリフォルダ上のファイル名 
    */
  createTempPath: function(){
    return this.fso.buildPath(this.fso.getSpecialFolder(2), this.fso.GetTempName());;
  },
  /**
    * テキストファイルを読み込みます
    *
    * path 読み込み対象となるファイル名
    * return 読み込まれたテキストファイル
    */
  loadFromFile: function(path){
    var ts = fso.OpenTextFile(path);
    try{
      var t = ts.atEndOfStream ? "" : ts.ReadAll();
      return t;
    }finally{
      ts.Close();
    }
  },
  
  /** プロセス利用 **/
  /**
    * 任意のコマンドラインアプリケーションを実行し、その標準出力および、標準エラーを取得する。
    *
    * command 実行するコマンド
    * return 連想配列("out" => 標準入力, "err" => 標準エラー, "c" => リターンコード)
    */
  run: function(command){
    var pstdout = this.createTempPath();
    var pstderr = this.createTempPath();
    try{
      var trucommand = "cmd /c " + command + " 1> " + pstdout + " 2> " + pstderr;
      var ret = this.shell.run(trucommand, 0, true);
      // 戻り値生成
      return {
          "c": ret,
          "out": this.loadFromFile(pstdout),
          "err": this.loadFromFile(pstderr)
        };
    }finally{
      this.fso.deleteFile(pstdout);
      this.fso.deleteFile(pstderr);
    }
  },
  /** ユーティリティ **/
  /**
    * スクリプトマクロファイルのディレクトリパスを取得します。
    *
    * return スクリプトマクロファイルのディレクトリパス
    */
  getScriptDir: function(){
    return this.fso.getParentFolderName(ScriptFullName);s
  },
  
  VERSION: "1.0.0"
}
