document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1200;
  canvas.height = 500;

  // player properties
  let playerName;
  let strokeCount = 0;


  //starting location
  const sx = 20;
  const sy = 395;

  //ball properties
  var x = sx;
  var y = sy;
  var iy = -10 // angle
  var vx = 1 ; // power max(15?)
  var vy = iy;
  let inAir = false;
  var g = 1;

  const normalizeBallProps = () => {
    x = sx;
    y = sy;
    iy = -10;
    vx = 1 ;
    vy = iy;
  }


  // FIX THE HUD
  const drawHUD = () => {
    const hudx = Math.sign(vx) + vx;
    const hudy = Math.sign(vy) + vy;
    const mx = x + hudx;
    const my = y + hudy;
    // console.log(mx, my);
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(mx + hudx, my + hudy);
    ctx.stroke();
  }

  // ball image
  const ballRadius = 5;
  const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "red";
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

    if (x > 1100 && x < 1120) {
      // hole
      if (y > 394){
        vx = 0;
        vy = 2;
      }
      if (y > 409) {
        console.log("winner");
        strokeCount = 0;
        clearInterval(handle);
        normalizeBallProps();
        setTimeout(() => drawRest(), 3000); // draw WINNER
      }
    } else if (x > 149 && x < 400) {
      // water
      if (y > 394) {
        vy /= 2;
        vx /= 2;
        if (y > 490) {
          console.log("soaked!");
          clearInterval(handle);
          normalizeBallProps();
          setTimeout(() => drawRest(), 3000);
          // return drawRest(); // draw WETTER
        }
      }
    } else if (x > 819 && x < 922) {
      // sand
      if (y > 394) {
        vy /= 1.1;
        vx /= 2;
        if (y > 410) {
          console.log("beached!");
          clearInterval(handle);
          iy = -5;
          vx = 1;
          vy = iy;
          return drawRest(); // draw BEACHED
        }
      }
    } else if (y >= 394) {
      // grass + green
      iy /= 2;
      vy = iy;
      vx /= 1.3;
      if (Math.abs(vx) < 1) {
        console.log("I'm resting tho");
        clearInterval(handle);
        iy = -5;
        vx = 1;
        vy = iy;
        return drawRest();
      }
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
    console.log(strokeCount);
    inAir = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTerrain();
    drawBall();
    drawHUD();
  }


  // terrain //////// terrain //////// terrain //////// terrain //////// terrain //////

  let fairway = {};
  const drawFairway = (fairway) => {
    fairway.x = 0;
    fairway.y = 400;
    fairway.xw = 1220;
    fairway.yw = 120;
  }

  let water = {};
  const drawWater = water => {
    water.x = 150;
    water.y = 400;
    water.xw = 250;
    water.yw = 120;
  }

  let sand = {};
  const drawSand = sand => {
    sand.x = 820;
    sand.y = 400;
    sand.xw = 100;
    sand.yw = 120;
  }

  let green = {};
  const drawGreen = (green) => {
    green.x = 930;
    green.y = 400;
    green.xw = 1220;
    green.yw = 120;
  }

  let hole = {};
  const drawHole = (hole) => {
    hole.x = 1100;
    hole.y = 400;
    hole.xw = 20;
    hole.yw = 15;
  }

  const drawTerrain = () => {
    // fairway
    drawFairway(fairway)
    ctx.beginPath();
    ctx.rect(fairway.x, fairway.y, fairway.xw, fairway.yw);
    ctx.fillStyle = "green";
    ctx.fill();

    // water
    drawWater(water);
    ctx.beginPath();
    ctx.rect(water.x, water.y, water.xw, water.yw);
    ctx.fillStyle = "blue";
    ctx.fill();

    // sand
    drawSand(sand);
    ctx.beginPath();
    ctx.rect(sand.x, sand.y, sand.xw, sand.yw);
    ctx.fillStyle = "wheat";
    ctx.fill();

    // green
    drawGreen(green);
    ctx.beginPath();
    ctx.rect(green.x, green.y, green.xw, green.yw);
    ctx.fillStyle = "#4fd67b";
    ctx.fill();

    // hole
    drawHole(hole);
    ctx.beginPath();
    ctx.rect(hole.x, hole.y, hole.xw, hole.yw);
    ctx.fillStyle = "#bffaf7";
    ctx.fill();
  }


  // user controls ///////// user controls ///////// user controls ///////// user controls //
  const doKeyDown = (e) => {
    if (!inAir) {
      switch(e.keyCode){
        case 32:
          window.addEventListener("keyup", doKeyUp, false);
          // console.log(vx);
          drawRest();
          return vx = Math.sign(vx)*(Math.abs(vx) + 2);
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
    if (e.keyCode === 32) {
      strokeCount++;
      return handle = setInterval(drawCollision, 30);
    }
  }

  // game start
  drawRest();
  window.addEventListener("keypress", doKeyDown, false);
})