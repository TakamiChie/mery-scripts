#title="構文チェック"
#tooltip="現在開いているファイルを、各種コンパイラ・インタプリタで構文チェックします"
#include "lib.js"

// 定数
var fso = functions.fso;
var shell = functions.shell;
var libdir = fso.buildPath(functions.getScriptDir(), "SyntaxChecker");

// 実行前に、実在ファイルなら上書き保存する
if(fso.fileExists(document.fullname)){
  document.save();
}
// 処理
var file = functions.getFile();
var mode = document.mode;
var modefile = fso.buildPath(libdir, mode) + ".js";
if(fso.fileExists(modefile)){
  /** 初期化処理 **/
  var currentpos = document.selection.getActivePos();
  // ブックマーク消し
  document.selection.setActivePos(0, false);
  document.selection.clearBookMark();
  while(document.selection.nextBookMark()){
    document.selection.clearBookMark();
  }
  // アウトプットバー削除
  outputBar.visible = false;
  outputBar.clear();
  // ステータスクリア
  status = "";
  // 描画停止
  redraw = false;
  try{
    //
    var mc = (new Function("return " + functions.loadFromFile(modefile)))();
    var cmd = mc.executable + " " + mc.arguments.replace("%1", file);
    var out = functions.run(cmd);
    // 出力をパース
    var codes = mc.onparse(out["out"], out["err"]);
    if(codes["check"]){
      status = "構文エラーはありません";
      document.selection.setActivePos(currentpos, false);
    }else{
      // ブックマーク設置
      for(var i = 0; i < codes["errors"].length; i++){
        document.selection.setActivePoint(mePosLogical, 0, codes["errors"][i]["line"], true);
        document.selection.setbookmark();
      }
      document.selection.setActivePos(currentpos, false);
      // 出力
      var display = codes["console"] ? codes["console"] : out["out"];
      outputBar.visible = true;
      outputBar.writeln(display);
      editor.ExecuteCommandByID(2189); // エディタにフォーカスを戻す
    }
  }finally{
    redraw = true;
  }
}else{
  // 非サポートの拡張子
  alert("本ファイルの構文チェックはサポートされていません。");
}
