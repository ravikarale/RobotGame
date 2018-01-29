var bw = 480;
var bh = 480;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var img1=document.createElement('img');
var img2=document.createElement('img');
var img3=document.createElement('img');
var fileData;
var sp;
img1.src='robot2.png';
img2.src='wall.png';
img3.src='coins.jpeg';

function readFile(file)
{
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        fileData = rawFile.responseText;
      }
    }
  }
  rawFile.send(null);
}

function drawRobots(robots){
  for(i=0;i<robots.length;i++){
    x = robots[i][0][0]*40+50;
    y = robots[i][0][1]*40+45;
    n = robots[i][3];
    var gradient=context.createLinearGradient(0,0,1,0);
    gradient.addColorStop("0.5","black");
    context.fillStyle=gradient;
    var x1=x+7;
    var y1=y+22;
    context.font="11px Georgia";
    context.drawImage(img1,0,0,300,300,x,y,75,75);
    context.fillText(""+n,x1,y1);

  }
}

function drawWalls(walls){
  for(i=0;i<walls.length;i++){
    x = walls[i][0]*40+41;
    y = walls[i][1]*40+41;
    context.drawImage(img2,0,0,300,300,x,y,51,51);
  }
}

function drawCoins(coins){
  for(i=0;i<coins.length;i++){
    x = coins[i][0][0]*40+45;
    y = coins[i][0][1]*40+44;
    n = coins[i][1];
    var gradient=context.createLinearGradient(0,0,1,0);
    gradient.addColorStop("0.5","red");
    context.fillStyle=gradient;
    var x1=x+10;
    var y1=y+20;
    context.font="10px Georgia";
    context.drawImage(img3,0,0,300,300,x,y,40,40);
    context.fillText(""+n,x1,y1);
  }
}

function drawBoard(n,m){
  bh = m*40;
  bw = n*40;
  for (var x = 0,i=0; i <=n; i++,x += 40) {
    context.moveTo( x + 40, 40);
    context.lineTo( x + 40, bh + 40);
  }

  for (var x = 0,i=0; i <= m; x += 40,i++) {
    context.moveTo(40,  x + 40);
    context.lineTo(bw + 40,  x + 40);
  }
  context.strokeStyle = "black";
  context.stroke();
}

function clear(clearList){
  var x,y;
  for(var i = 0; i < clearList.length; i++){
    x = clearList[i][0]*40 + 42;
    y = clearList[i][1]*40 + 42;
    context.clearRect(x , y , 37 , 37)
  }
}

function isSameGridWC(wall,coins,clearList){
  var coin = [];
  for(var j=0;j<coins.length;j++){
    var flag = true;
    for(var i = 0; i < wall.length; i++){
      if(wall[i][0]==coins[j][0][0] && wall[i][1]==coins[j][0][1]){
        flag = false;
        break;
      }
    }
    if(flag)
      coin.push(coins[j]);
    else
      clearList.push(coins[j][0]);
  }
  return [coin,clearList];
}

function isSameGridWR(robots,wall,clearList){
  var robot = [];
  for(var j=0;j<robots.length;j++){
    var flag = true;
    for(var i = 0; i < wall.length; i++){
      if(wall[i][0]==robots[j][0][0] && wall[i][1]==robots[j][0][1]){
        flag = false;
        break;
      }
    }
    if(flag)
      robot.push(robots[j]);
    else{
      alert("Robot "+robots[j][3]+" is die becz robot goes to on the wall");
      clearList.push(robots[j][0]);

    }
  }
  return [robot,clearList];
}

function isRobotOutOfGrid(n,m,robots){
  var robot = [];
  for(var i=0;i<robots.length;i++){
    if((robots[i][0][0] < 0) || (robots[i][0][1] < 0) || (robots[i][0][0] >= n) || (robots[i][0][1] >= m))
      alert("Robot "+robots[i][3]+" is dia becz robot goes out of Grid ");
    else
      robot.push(robots[i]);
  }
  return robot;
}

function isMoreRobotInSameGrid(robots,clearList){
  var robot = [];
  for(var i=0;i<robots.length;i++){
    var robot1 = [robots[i]]
      var flag  = true;
    for(var j=0;j<robots.length;j++){
      if(i!=j && robots[i][0][0]==robots[j][0][0] && robots[i][0][1]==robots[j][0][1] ){
        robot1.push(robots[j]);
        flag = false;
      }
    }
    if(flag){
      robot.push(robots[i]);
    }
    else{
      clearList.push(robots[i][0]);
      var s = "";
      for(var j=0;j<robot1.length;j++)
        s+="Robot "+robots[j][3]+" ";
      alert(s+"are same Grid so kill those Robots");
    }
  }
  return [robot,clearList];
}

function isInGridWC(walls,coins,n,m,clearList){
  var coin = [];
  for(var i=0;i<coins.length;i++){
    if(!((coins[i][0][0] < 0) || (coins[i][0][1] < 0) || (coins[i][0][0] >= n) || (coins[i][0][1] >= m)))
      coin.push(coins[i]);
    else
      clearList.push(coins[i][0]);
  }
  var wall = [];
  for(var i=0;i<walls.length;i++){
    if(!((walls[i][0] < 0) || (walls[i][1] < 0) || (walls[i][0] >= n) || (walls[i][1] >= m)))
      wall.push(walls[i]);
    else
      clearList.push(walls[i]);
  }
  return [wall,coin,clearList]
}

function validateAll(robots,coins,walls,n,m){
  var clearList = [];
  var ans;
  ans = isMoreRobotInSameGrid(robots,clearList);
  robots  = ans[0];
  clearList = ans[1];
  robots = isRobotOutOfGrid(n,m,robots);
  ans = isSameGridWR(robots,walls,clearList);
  robots  = ans[0];
  clearList = ans[1];
  ans    = isSameGridWC(walls,coins,clearList);
  coins  = ans[0];
  clearList = ans[1];
  ans = isInGridWC(walls,coins,n,m,clearList);
  walls = ans[0];
  coins = ans[1];
  clearList = ans[2];
  clear(clearList);
  return [robots,coins,walls];
}

function side(r,c,sid){
  if(sid == "right")
    r=r-1;
  else if(sid == "left")
    r=r+1;
  else if(sid == "up")
    c=c-1;
  else if(sid == "down")
    c=c+1;
  return [r,c];
}

function chekWall(walls,r,c,sid){
  s = side(r,c,sid);
  r = s[0];
  c = s[1];
  for(var i = 0 ; i < walls.length ; i++){
    if(walls[i][0]==r && walls[i][1]==c){
      return true;
    }
  }
  return false;
}

function chekCoin(coins,r,c,sid){
  s = side(r,c,sid);
  r = s[0];
  c = s[1];
  for(var i = 0 ; i < coins.length ; i++){
    if(coins[i][0][0]==r && coins[i][0][1]==c)
      return true;
  }
  return false;
}

function chekRobot(robots,r,c,sid){
  s = side(r,c,sid);
  r = s[0];
  c = s[1];
  for(var i = 0 ; i < robots.length ; i++){
    if(robots[i][0][0]==r && robot[i][0][1]==c){
      return true;
    }
  }
  return false;
}

function chekEnd(r,c,n,m,sid){
  s = side(r,c,sid);
  r = s[0];
  c = s[1];
  if(r<0 || r > m || c < 0 || c > n )
    return true;
  return false;
}

function getNext(robots,i,cntr){
  for(;cntr>=0;--cntr){
    if(robots[i][1][cntr]=='moveLeft')
      return 'Left';
    else if(robots[i][1][cntr]=='moveRight')
      return 'Right';
    else if(robots[i][1][cntr]=='moveUp')
      return 'Up';
    else if(robots[i][1][cntr]=='moveDown')
      return 'Down';
  }
  return 'Left';
}

function clear(clearList){
  var x,y;
  for(var i = 0; i < clearList.length; i++){
    x = clearList[i][0]*40 + 42;
    y = clearList[i][1]*40 + 42;
    context.clearRect(x , y , 37 , 37)
  }
}
/*
   function robotsStatus(robots,id,cnt)
   {  
   for(var i=0;i<robots.length;i++){
   if(robots[i][3]==id && robots[i][1][cnt]!=undefined)
   document.getElementById("st").value=robots[i][1][cnt];
   }
   }
   */


function speed(cntr,robots,coins,walls,n,m,id)
{
  var myvar = setTimeout(function() {  
    var val='';
    var clearList = [];
    //    robotsStatus(robots,id,cntr);
    for(var i=0;i<robots.length;i++){
      for(var u=0;u<id.length;u++){
        if(robots[i][3]==id[u] && robots[i][1][cntr]!=undefined){
          val+=id[u]+":"+robots[i][1][cntr]+"  ";
        }
      }
      if(cntr<robots[i][1].length){
        clearList.push([robots[i][0][0],robots[i][0][1]]);

        if(robots[i][1][cntr]=='moveLeft')
          robots[i][0][0]+=1;
        else if(robots[i][1][cntr]=='moveRight')
          robots[i][0][0]-=1;
        else if(robots[i][1][cntr]=='moveDown')
          robots[i][0][1]+=1;

        else if(robots[i][1][cntr]=='moveUp')
          robots[i][0][1]-=1;
        else if(robots[i][1][cntr]=='pickCoin'){
          var co= [];
          for(var k = 0 ; k<coins.length;k++){
            if(coins[k][0][0]==robots[i][0][0] && coins[k][0][1]==robots[i][0][1])
              robots[i][2]+=coins[k][1];
            else
              co.push(coins[k]);
          }
          coins = co;
        }
        else if(robots[i][1][cntr]=='dropCoin'){
          if(robots[i][2]){
            coins.push([[robots[i][0][0],robots[i][0][1]],robots[i][2]]);
            robots[i][2] = 0;
          }
        }

        else if(robots[i][1][cntr]!=''){
          var sls  = robots[i][1][cntr].split(' ');
          if(sls[0]=='isNextWall')
            sls[0]='is'+(getNext(robots,i,cntr))+"Wall";
          else if(sls[0]=='isNextCoin')
            sls[0]='is'+(getNext(robots,i,cntr))+"Coin";
          else if(sls[0]=='isNextRobot')
            sls[0]='is'+(getNext(robots,i,cntr))+"Robot";
          else if(sls[0]=='isNextEnd')
            sls[0]='is'+(getNext(robots,i,cntr))+"End";

          if(sls[0]=='isRightEnd'){
            if(chekEnd(walls,robots[i][0][0],robots[i][0][1],"right"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isLeftEnd'){
            if(chekEnd(walls,robots[i][0][0],robots[i][0][1],"left"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isUpEnd'){
            if(chekEnd(walls,robots[i][0][0],robots[i][0][1],"Up"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isDownEnd'){
            if(chekEnd(walls,robots[i][0][0],robots[i][0][1],"Down"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isRightWall'){
            if(chekWall(walls,robots[i][0][0],robots[i][0][1],"right"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isLeftWall'){
            if(chekWall(walls,robots[i][0][0],robots[i][0][1],"left"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isUpWall'){
            if(chekWall(walls,robots[i][0][0],robots[i][0][1],"up"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isDownWall'){
            if(chekWall(walls,robots[i][0][0],robots[i][0][1],"down"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isLeftCoin'){
            if(chekCoin(coins,robots[i][0][0],robots[i][0][1],"left"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isDownCoin'){
            if(chekCoin(coins,robots[i][0][0],robots[i][0][1],"down"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isUpCoin'){
            if(chekCoin(coins,robots[i][0][0],robots[i][0][1],"up"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isRightCoin'){
            if(chekCoin(coins,robots[i][0][0],robots[i][0][1],"right"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isCoin'){
            if(chekCoin(coins,robots[i][0][0],robots[i][0][1],""))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isLeftRobot'){
            if(chekRobot(robots,robots[i][0][0],robots[i][0][1],"left"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isRightRobot'){
            if(chekRobot(robots,robots[i][0][0],robots[i][0][1],"right"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isUpRobot'){
            if(chekRobot(robots,robots[i][0][0],robots[i][0][1],"up"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          else if(sls[0]=='isDownRobot'){
            if(chekRobot(robots,robots[i][0][0],robots[i][0][1],"down"))
              robots[i][1][cntr]=sls[1];
            else
              robots[i][1][cntr]=sls[2];
          }
          i--;
        }
      }
    }

    document.getElementById("st").value=val;
    document.getElementById("sp").value=sp;
    val='';

    clear(clearList);
    var ans = validateAll(robots,coins,walls,n,m);
    robots = ans[0];
    coins  = ans[1];
    walls  = ans[2];
    drawCoins(coins);
    drawRobots(robots);
    drawWalls(walls);
    cntr += 1;
    speed(cntr,robots,coins,walls,n,m,id);

  } ,sp);
}

function moveRobot(robots,coins,walls,n,m,id){
  var maxlen = 0;
  var rlen = robots.length;
  var cntr = 0;
  for(var i=0;i<rlen;i++){
    if(robots[i][1].length>maxlen)
      maxlen=robots[i][1].length-1;
  }
  speed(cntr,robots,coins,walls,n,m,id);
}


function drawGrid(n,m,r,w,c){
  drawBoard(m,n);
  drawCoins(c);
  drawRobots(r);
  drawWalls(w);
}

function setProgram(robots){
  for( var i=0 ; i<robots.length ; i++ ){
    readFile(robots[i][1]);
    robots[i][1]=fileData.split('\n');

  }
  return robots;
}
function animation(sp)
{
  return sp;
}

function keyFunction(e) {
  var x = e.which;
  var evtobj=window.event? event : e;
  
  if (evtobj.shiftKey) {
    if (x==68)//Decrease the speed
    {
      sp+=500;
    }
    else if(x==73) // Increase the speed
    {
     sp-=500;
    }
  }
  else if(x==68 )// shift+d
  {
    sp+=200;
  }
  else if(x==73) // shift+i
  {
    sp-=200;
  }
}

function myMain(){
  readFile("grid.conf");
  var data = fileData.split('\n');
  var conf = [];
  for(var i = 0 ; i<data.length;i++){
    var d = data[i].replace(/\s/g,'');
    if(d != '' && d[0].replace(/\s/g,'') != '#')
      conf.push(d)
  }

  var n = conf[0];
  var m = conf[1];
  canvas.width = m*40+100;
  canvas.height = n*40+100;

  var robots = JSON.parse(conf[2]);
  var walls  = JSON.parse(conf[3]);
  var coins  = JSON.parse(conf[4]);
  var speed = JSON.parse(conf[5]);
  var id = JSON.parse(conf[6]) ;

  robots= setProgram(robots);
  sp=animation(speed); 
  var ans = validateAll(robots,coins,walls,n,m);
  robots = ans[0];

  coins  = ans[1];
  walls  = ans[2];
  drawGrid(n,m,robots,walls,coins);
  moveRobot(robots,coins,walls,n,m,id);
}

myMain();
