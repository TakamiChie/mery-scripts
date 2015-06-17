#title="FileExecutor"
#tooltip="現在開いているファイルを、各種コンパイラ・インタプリタで開きます。"

var fso = new ActiveXObject('Scripting.FileSystemObject');
var shell = new ActiveXObject("WScript.Shell");
var scriptname = scriptFullName;
var executor = fso.buildPath(fso.getParentFolderName(scriptname),"FileExecutor.exe");

// 実行処理
var file = getFile();
var cmdline = '"' + executor + '" /file "' + file + '" /type ' + document.mode;
var proc = shell.exec(cmdline);
while(proc.status == 0) sleep(10);

// 出力読み取り
outputBar.visible = true;
outputBar.clear();
outputBar.writeln(proc.stdout.readall());
outputBar.writeln(proc.stderr.readall());

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