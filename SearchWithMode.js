#title="言語について検索"
#tooltip = "現在開いているファイルの言語について、Googleで検索します。"
/*
 * 言語について検索 Ver 1.0
 *
 * 現在開いているファイル(編集モード)について、Googleで検索します。
 * ex). PHPを開いている状態で起動すると、「PHP [選択した単語]」でGoogle検索します
 */

var width = 600;
var height = 800;
var google_url = "https://www.google.co.jp/?gws_rd=ssl#q=";
var text = document.mode;
text = text + " " + document.selection.text;
var s =  prompt("Web検索", text);
if(s != "") {
  var excel =  new ActiveXObject( "Excel.Application" );
  var messagepos = excel.ExecuteExcel4Macro('CALL("user32","GetMessagePos","J")');
  excel.quit();
  var y = messagepos >> 16
  var x = 0xFFFF & messagepos;
  var ie = new ActiveXObject( "InternetExplorer.Application" );
  ie.top = y - height / 2;
  ie.left = x - width / 2;
  ie.width = width;
  ie.height = height;
  ie.addressBar = false;
  ie.menuBar = false;
  ie.statusBar = false;
  ie.navigate( google_url + s);
  ie.visible = true;
}