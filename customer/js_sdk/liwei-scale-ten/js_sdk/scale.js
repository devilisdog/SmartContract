export default {
 random_char:function(n){
                 //获取n位随机值
	 var random_charset = [
	 	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
	 	, 'a', 'b', 'c', 'd', 'e', 'f', 'g'
	 	, 'h', 'i', 'j', 'k', 'l', 'm', 'n'
	 	, 'o', 'p', 'q', 'r', 's', 't'
	 	, 'u', 'v', 'w', 'x', 'y', 'z'];
  	var res = "";
  	for(var i = 0; i < n; i++) {
      		var id = Math.ceil(Math.random() * 35);
      		res += random_charset[id];
	}
  	return res;
 },
 switch_sl(num,system){
	 // 十进制转其它进制，仅支持到十六进制
	 var shiliu=[
	 	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
	 	, 'A', 'B', 'C', 'D', 'E', 'F', 'G'],sl_arr=[];
	 do{
		 var fl_sl=Math.floor(num/system);

		 var yu_sl=num%system;
		 sl_arr.unshift(shiliu[yu_sl]);
		 num=fl_sl;
	 }while(num>0)
	 return sl_arr.join('');
 }
}
