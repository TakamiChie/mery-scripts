{
  executable: 'php',
  arguments: '-l -f "%1"',
  onparse: function(output, error){
    var check = true;
    var errors = [];
    var re = /([a-zA-Z ]+):(.+) in .+ on line (\d+)/;
    var target = output.split("\n");
    for(var i = 0; i < target.length; i++){
      var t = target[i];
      if(t != ""){
        var m = re.exec(t);
        if(m != null){
          errors.push({
            "type": m[1],
            "text": m[2],
            "line": m[3]
          });
          check = false;
        }
      }
    }
    return {
        "check"   : check,
        "errors"  : errors,
        "console" : output
      };
  }
};
