document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // constants
  canvas.width = 900;
  canvas.height = 400;
  const ballRadius = 5;

  // player properties
  let playerName = "";
  let strokeCount = 0;
  let ballColor = "red";


  //starting location
  const sx = (ballRadius * 4);
  const sy = (canvas.height - (canvas.height/5) - ballRadius);

  //ball properties
  var x = sx;
  var y = sy;
  var iy = -10 // angle // Math.sin(ang) * pow
  var vx = 1 ; // power max(15?) // Math.cos(ang) * pow
  var vy = iy;
  let inAir = false;
  var g = 1;

  const normalizeBallProps = () => {
    clearInterval(handle);
    x = sx;
    y = sy;
    iy = -10;
    vx = 1 ;
    vy = iy;
  }


  // FIX THE HUD
  const drawHUD = () => {

    // const mx = x + Math.sign(vx) * 5;
    // const my = y - 5;
    const mx = x + Math.sign(vx) * Math.PI/4;
    const my = y - Math.PI/4;

    const hudx = mx + vx + Math.sign(vx)*10;
    const hudy = my + vy;
    // console.log(mx, my);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(hudx, hudy);
    ctx.stroke();
  }

  // ball image
  const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
  }


  // game physics ///////// game physics ///////// game physics ///////// game physics ///////
  let handle = null;

  const gravityCalc = (n) => {
    return n + g;
  }

  const collision = () => {
    // console.log(vx, vy, iy)

    if (x > hole.x && x < (hole.x + hole.xw)) {
      // hole ///////// hole ///////// hole ///////// hole ////
      // hole ///////// hole ///////// hole ///////// hole ////
      if (y > (hole.y - ballRadius + (ballRadius/5))){
        vx = 0;
        vy = 2;
      }
      if (y > (hole.y + (ballRadius*2) + 1)) {
        console.log("winner");
        strokeCount = 0;
        normalizeBallProps();
        setTimeout(() => {
          generateMap();
          drawRest();
        }, 4000);
      }
    } else if (x > water.x && x < (water.x + water.xw)) {
      // water //////// water //////// water //////// water ///
      // water //////// water //////// water //////// water ///
      if (y > (water.y - ballRadius + (ballRadius/5))) {
        vy /= 2;
        vx /= 2;
        if (y > (canvas.height - ballRadius - (ballRadius/5))) {
          console.log("soaked!");
          normalizeBallProps();
          return setTimeout(() => drawRest(), 3000);
        }
      }
    } else if (x > sand.x && x < (sand.x + sand.xw)) {
      // sand //////// sand //////// sand //////// sand /////////
      // sand //////// sand //////// sand //////// sand /////////
      if (y > (sand.y - ballRadius - (ballRadius/5))) {
        vy /= 1.1;
        vx /= 2;
        if (y > (sand.y + ballRadius*2)) {
          console.log("beached!");
          clearInterval(handle);
          iy = -5;
          vx = 1;
          vy = iy;
          return drawRest(); // draw BEACHED
        }
      }
    } else if (y >= (fairway.y - ballRadius - (ballRadius/5))) {
      // grass + green /////// grass + green /////// grass + green /////
      // grass + green /////// grass + green /////// grass + green /////
      iy /= 2;
      vy = iy;
      vx /= 1.3;
      if (Math.abs(vx) < 1) {
        console.log("I'm resting tho");
        clearInterval(handle);
        iy = -10;
        vx = 1;
        vy = iy;
        return drawRest();
      }
    } else if (x < (ballRadius * -1) || x > (canvas.width + ballRadius) ) {
      //off canvas
      console.log("wrong way!");
      clearInterval(handle);
      normalizeBallProps();
      return setTimeout(() => drawRest(), 2000);
    }
  }


  // ball states
  const drawCollision = () => {
    inAir = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTerrain();
    drawBall();
    x += vx;
    y += vy;
    vy = gravityCalc(vy);
    collision(x, y);
  }

  const drawRest = () => {
    inAir = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTerrain();
    drawHUD();
    drawBall();
  }


  // terrain //////// terrain //////// terrain //////// terrain //////// terrain //////

  let fairway = {};
  const drawFairway = (fairway) => {
    fairway.x = 0 - ballRadius;
    fairway.y = canvas.height - (canvas.height/5);
    fairway.xw = canvas.width + (ballRadius * 4);
    fairway.yw = (canvas.height/5) + (ballRadius * 4);
  }

  let green = {};
  const drawGreen = (green) => {
    // green.x = 930;
    // green.xw = 1220;
    green.x = Math.random() * ((canvas.width * 0.8) - (canvas.width/2)) + (canvas.width/2);
    green.y = canvas.height - (canvas.height/5);
    green.xw = Math.random() * ((canvas.width/4.5) - (canvas.width/6)) + (canvas.width/6);
    green.yw = (canvas.height/5) + (ballRadius * 4);
  }

  let hole = {};
  const drawHole = (hole) => {
    hole.x = green.x + ((green.xw /2) - 10);
    hole.y = canvas.height - (canvas.height/5);
    hole.xw = 20;
    hole.yw = 15;
  }

  let water = {};
  const drawWater = water => {
    // water.x = 150;
    // water.xw = 250;

    function waterMaker() {
      const prospectiveX = Math.random() * ((canvas.width * 0.75) - 40) + 40;
      const prospectiveXW = Math.random() * ((canvas.width/5) - (canvas.width/6)) + (canvas.width/6);
      if (prospectiveX + prospectiveXW < green.x) {
        water.x = prospectiveX;
        water.xw = prospectiveXW;
      } else if (prospectiveX > green.x + green.xw) {
        water.x = prospectiveX;
        water.xw = prospectiveXW;
      } else {
        return waterMaker();
      }
    }

    console.log("green", green.x, green.xw)
    waterMaker();
    water.y = canvas.height - (canvas.height/5);
    water.yw = (canvas.height/5) + (ballRadius * 4);
  }

  let sand = {};
  const drawSand = sand => {
    // sand.x = 820;
    // sand.xw = 100;
    function sandMaker() {
      const waterEnd = water.x + water.xw;
      const greenEnd = green.x + green.xw;
      if (greenEnd < canvas.width * 0.8 && waterEnd < canvas.width * 0.8) {
      // sand at the end
          sand.x = canvas.width * 0.82;
          sand.xw = Math.random() * ((canvas.width/5) - (canvas.width/6)) + (canvas.width/6);
      } else if (green.x - (waterEnd) > canvas.width/6) {
        // sand before green
        sand.x = Math.random() * ((green.x - canvas.width*0.065) - waterEnd) + waterEnd;
        sand.xw = Math.random() * ((green.x - sand.x) - (canvas.width * 0.065)) + (canvas.width * 0.065);
      }
    }

    // sand.x = Math.random() * ((canvas.width * 0.75) - (canvas.width/6)) + (canvas.width/6);
    // sand.xw = Math.random() * ((canvas.width/5) - (canvas.width/6)) + (canvas.width/6);
    sandMaker();
    sand.y = canvas.height - (canvas.height/5);
    sand.yw = (canvas.height/5) + (ballRadius * 4);
  }


  const normalizeTerrain = () => {
    fairway = {};
    sand = {};
    water = {};
    green = {};
    hole ={};
  }


  const generateMap = () => {
    normalizeTerrain();
    drawFairway(fairway);
    drawGreen(green);
    drawHole(hole);
    drawWater(water);
    drawSand(sand);
    // console.log("water", water.x, water.xw)
    // console.log("sand", sand.x, sand.xw)
  }

  generateMap();
  const drawTerrain = () => {

    // fairway
    ctx.beginPath();
    ctx.rect(fairway.x, fairway.y, fairway.xw, fairway.yw);
    ctx.fillStyle = "green";
    ctx.fill();

    // water
    ctx.beginPath();
    ctx.rect(water.x, water.y, water.xw, water.yw);
    ctx.fillStyle = "blue";
    ctx.fill();

    // sand
    ctx.beginPath();
    ctx.rect(sand.x, sand.y, sand.xw, sand.yw);
    ctx.fillStyle = "wheat";
    ctx.fill();

    // green
    ctx.beginPath();
    ctx.rect(green.x, green.y, green.xw, green.yw);
    ctx.fillStyle = "#4fd67b";
    ctx.fill();

    // hole
    ctx.beginPath();
    ctx.rect(hole.x, hole.y, hole.xw, hole.yw);
    ctx.fillStyle = "#bffaf7";
    ctx.fill();
  }


  // user controls ///////// user controls ///////// user controls ///////// user controls //
  const doKeyDown = (e) => {
    if (!inAir) {
      switch(e.keyCode){
        case 32: //spacebar
          if (vx <= 29) {
            console.log("power", vx)
            window.addEventListener("keyup", doKeyUp, false);
            drawRest();
            return vx = Math.sign(vx)*(Math.abs(vx) + 2);
          } else {
            return vx;
          }
        case 97: //a
          if (Math.sign(vx) === 1) {
            vx = -1 * vx;
          }
          // console.log(vx);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return drawRest();
        case 100: //d
          if (Math.sign(vx) === -1) {
            vx = -1 * vx;
          }
          // console.log(vx);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return drawRest();
        case 115: //s
          vy += 2;
          iy += 2;
          // console.log(vy);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return drawRest();
        case 119: //w
          vy -= 2;
          iy -= 2;
          // console.log(vy);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return drawRest();
        default:
          return null;
      }
    }
  }

  const doKeyUp = (e) => {
    if (e.keyCode === 32 && !inAir) {
      strokeCount++;
      console.log(strokeCount);
      return handle = setInterval(drawCollision, 30);
    }
  }

  // game start
  drawRest();
  window.addEventListener("keypress", doKeyDown, false);
})