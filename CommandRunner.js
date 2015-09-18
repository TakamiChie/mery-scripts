#title="コマンドを実行"
#tooltip="ファイルに記載されたコマンドを実行します"

var OUTPUT_FILE = true; // trueにすると、標準出力をコンソールに表示する(out:consoleが使えるようになります)
var fso = new ActiveXObject('Scripting.FileSystemObject');
var shell = new ActiveXObject("WScript.Shell");
var scriptname = scriptFullName;
var executor = fso.buildPath(fso.getParentFolderName(scriptname), "CommandRunner.exe");

// 実行処理
var file = getFile();
var tempfile = createTempPath();
var cmdline;
if(OUTPUT_FILE){
  cmdline = 'cmd /C ""' + executor + '" /file "' + file + '"';
} else {
  cmdline = 'cmd /C ""' + executor + '" /file "' + file + '" > ' + tempfile + '"';
}
shell.run(cmdline, 0, true);

if(fso.fileExists(tempfile)) {
  // 出力読み取り
  var file = fso.openTextFile(tempfile, 1);
  if(!file.atEndOfStream) {
    outputBar.visible = true;
    outputBar.clear(); 
    var s = file.readAll();
    outputBar.writeln(s);
    file.close();
  }else{
    outputBar.visible = false;
    outputBar.clear(); 
  }
}

//
// ファイル名を取得する。
// もし、ファイルが未保存であった場合、テンポラリファイルに保存してそれを返す。
//
function getFile(){
  var fn = document.fullname;
  if(fso.fileExists(fn)){
    // ファイルはありまーす
    return fn;
  }else{
    // 一時ファイル生成
    fn = createTempPath();
    var s = fso.createTextFile(fn, true);
    try{
      s.write(document.text);
    }finally{
      s.close();
    }
    return fn;
  }
}

//
// テンポラリフォルダのパスを生成して返す。
//
function createTempPath(){
  return fso.buildPath(fso.getSpecialFolder(2), fso.GetTempName());;
}