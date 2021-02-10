console.log('connected');


/*variables*/
var maxLev=6;// number of levels
var margins=["40px","20px","10px","8px","4px"];//margins between coins on levels
var size=["120px","105px","95px","85px","75px"];//coins dimentions 
var difficulty=30.0;
var num=2;//starting level
var i=0;//variable to check the coin state (front or back)
var currentBackground;
var currentCoin;
var currentOdd;
var change=50;
/* clear Table */ 
function clearTable(){
    var playArea=document.getElementById('playArea');
    playArea.innerHTML="";
}

function start(){
    choose();
    rebuildTable();
    correct();
}

/* rebuild Table on level change */
//creating coins.
//needs some polishing for sure
function createElement(){
    var element=document.createElement('td');
    var  coin =document.createElement('dev');
    coin.id="coin";
    coin.className="flip-container";
    // coin.addEventListener('click',function(){
    //     onClick();
    // });
    var flipper=document.createElement('div');
    flipper.className="flipper";
    var front=document.createElement('div');
    front.className="front";
    front.style.background=currentCoin;
    front.style.height=size[(num-2)%maxLev];
    front.style.width=size[(num-2)%maxLev];
    var back=document.createElement('div');
    back.className="back";
    back.style.background=currentCoin;
    back.style.height=size[(num-2)%maxLev];
    back.style.width=size[(num-2)%maxLev];
    flipper.append(front);
    flipper.append(back);
    flipper.style.height=size[(num-2)%maxLev];
    flipper.style.width=size[(num-2)%maxLev];
    flipper.style.margin=margins[(num-2)%maxLev];
    coin.append(flipper);
    element.append(coin);
    return element;
}
//creating a row with num no of elements
function createRow(){
    var row =document.createElement('tr');
    for(var nCol=0;nCol<num;nCol++)
    {
        row.append(createElement());
    }
    return row;
}
//craating table with n num of rows
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 5);
}
function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 5);
}
function rebuildTable(){
    var x=document.getElementById('playArea');
    fade(x);
    changeBackground();
    setTimeout(function(){
    clearTable();
    var playArea=document.getElementById('playArea');
    for(var nRow=0;nRow<num;nRow++){
        playArea.appendChild(createRow());
    }
    playArea.opacity= 0;
    unfade(playArea)
    num++;
    if(num>6)
    num=6;
    i=0;
    var y=document.querySelectorAll(".front");
    var random=Math.floor(Math.random()*100)%y.length;
        for(var j = 0;j<y.length;j++){
            var temp = y[j];
            if(j==random)
            {
                    temp.style.background=currentOdd;
            }
    }
    choose();
    var y=document.querySelectorAll(".back");
    random=Math.floor(Math.random()*100)%y.length;
        for(var j = 0;j<y.length;j++){
            var temp = y[j];
            temp.style.background=currentCoin;
            if(j==random)
            {
                    temp.style.background=currentOdd;
            }
    }
    $('#load').css('background-color',currentCoin);
    },200);
    
}


/*colors*/
//lighten or darken a color
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}
//choosing colors
function choose(){
    currentBackground=getRandomColor();
    currentCoin=getRandomColor();
    var temp=Math.floor(Math.random()*100)%2;
    if(temp){
        currentOdd=shadeColor(currentCoin,difficulty);
    }
    else{
        currentOdd=shadeColor(currentCoin,difficulty);
    }
}
//generating random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
//restricting multiple taps.
var isActive=true;

//getsElementColor
function getColor(rowIndex,colIndex){
    var toFind=".back";
    if(i%2==0)
    toFind = ".front";
    var coin=document.getElementById('playArea').rows[rowIndex].cells[colIndex].querySelector(toFind);
    return coin.style.background;
}
function checkWin(rowIndex,colIndex){
    var colorthis=getColor(rowIndex,colIndex);
    var colorForward=getColor(rowIndex,(colIndex+1)%(num-1));
    var colordown=getColor((rowIndex+1)%(num-1),colIndex);
    if(colorthis!=colorForward&&colorthis!=colordown){
        console.log("true");
        return true;
    }
    console.log("false");
        return false;
}
$(document).on('click','#coin',function(){
    var col=$(this).closest('td').index();
    var row=$(this).closest('tr').index();
    console.log(row+" "+ col);
    onClick(row,col);
})

function onClick(row,col){
    if(checkWin(row,col)){
        if(isActive){
            isActive = false;
            correct();
            levelUp();
            setTimeout(function(){
                isActive = true;
            },200);
        }
    }
    else{
        fail();
    }
}
var tick=0;
var score=0;
function correct(){
    var x=Number(document.getElementById('current-score').innerHTML);
    document.getElementById('current-score').innerHTML=score++;
    clearTimeout(timer);
    tick=0;
    var percent= tick +"%";
    $('#load').css('width',percent);
    clock();
}
function fail(){
    // tick+=100;
}
function log3(val) {
    return Math.log(val) / Math.log(3);
}
function levelUp(){
    var random=Math.random();
    if(random>0.60)
    difficulty/=1.1;
    var pre=Math.floor(log3(score+3));
    var now=Math.floor(log3(score+4));
    if(pre!=now){
        console.log('rebuilding');
        rebuildTable();
    }
    else{
        console.log("flipping")
        flip();
    }
}
// clock
var time=10;
var timer;
function clock(){
    tick++;
    if(tick>500){
        timeout();
    }
    else{
    var percent= tick/5 +"%";
    $('#load').css('width',percent);
    timer=setTimeout(clock,time);
    }
}

function timeout(){
    $('#playArea').css('pointer-events','none');
    for(var k=0;k<num-1;k++){
        for(var t=0;t<num-1;t++){
            if(checkWin(k,t))
            {
                var coin=document.getElementById('playArea').rows[k].cells[t].querySelector('.front');
                coin.style.border='5px solid white';
                var coin=document.getElementById('playArea').rows[k].cells[t].querySelector('.back');
                coin.style.border='5px solid white';
            }
        }
    }
}


// var loader = document.getElementById('loader')
//   , border = document.getElementById('border')
//   , α = 0
//   , π = Math.PI
//   , t = 30;
// function draw() {
//   α++;
//   α %= 360;
//   var r = ( α * π / 180 )
//     , x = Math.sin( r ) * 50
//     , y = Math.cos( r ) * - 50
//     , mid = ( α > 180 ) ? 1 : 0
//     , anim = 'M 0 0 v -50 A 50 50 1 ' 
//            + mid + ' 1 ' 
//            +  x  + ' ' 
//            +  y  + ' z';
//   //[x,y].forEach(function( d ){
//   //  d = Math.round( d * 1e3 ) / 1e3;
//   //});
 
//   loader.setAttribute( 'd', anim );
//   border.setAttribute( 'd', anim );
//   setTimeout(draw,t)// Redraw
// }

// function penalty(){
//     // α+=60;
//     draw();
// }



//changing bakground color
function changeBackground(){
    $('#body').animate({'background-color':currentBackground});
}
function flip(){
        console.log('flip');
        choose();
        changeBackground();
        var color=currentCoin;
        $('#load').css('background-color',color);
        var x=document.querySelectorAll(".flip-container");
        for(var j = 0;j<x.length;j++) {
            x[j].classList.toggle("flip");
        }
        var y;
        setTimeout(function(){
        if(i%2==0)
        y=document.querySelectorAll(".front");   
        else
        y=document.querySelectorAll(".back");
        var random=Math.floor(Math.random()*100)%y.length;
        for(var j = 0;j<y.length;j++){
                var temp = y[j];
                temp.style.background=color;
                if(j==random)
                {
                    temp.style.background=currentOdd;
                    // temp.textContent="odd";
                }
            }
            i++;
        },200);
}

//selecting color variation (major, miner)
