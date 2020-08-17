export function decrypt(str) {
  let j = 4;
  var first = parseInt(str[0]);
  var second = parseInt(str[1]);
  var third = parseInt(str[2]);
  var fourth = parseInt(str[3]);
  code = '';
  for (var i = j; i < j + first; i++) {
    code += str[i];
  }
  code += '.';
  j += first;
  for (var i = j; i < j + second; i++) {
    code += str[i];
  }
  code += '.';
  j += second;
  for (var i = j; i < j + third; i++) {
    code += str[i];
  }
  code += '.';
  j += third;
  for (var i = j; i < j + fourth; i++) {
    code += str[i];
  }
  console.log(code);
  return code;
}
