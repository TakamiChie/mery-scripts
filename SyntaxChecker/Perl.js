{
  executable: 'perl',
  arguments: '-c "%1"',
  onparse: function(output, error){
    var check = true;
    var errors = [];
    var re = /(.+) at .+ line (\d+)/;
    var target = error.split("\n");
    for(var i = 0; i < target.length; i++){
      var t = target[i];
      if(t != ""){
        var m = re.exec(t);
        if(m != null){
          errors.push({
            "type": "Error",
            "text": m[1],
            "line": m[2]
          });
          check = false;
        }
      }
    }
    return {
        "check"   : check,
        "errors"  : errors,
        "console" : error
      };
  }
};
