
function alea(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var test = alea(3,30);;

while(test < 30 || test > 3){
    test = alea(3,30);
    console.log(test);
}
