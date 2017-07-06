document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1200;
  canvas.height = 500;


  // player properties
  let playerName;
  let strokeCount = 0;
  let inAir = false;

  //starting location
  const sx = 20;
  const sy = 395;

  //ball properties
  let handle = null;
  var x = sx;
  var y = sy;
  var iy = -10 // angle
  var vx = 1 ; // power max(15?)
  var vy = iy;
  var g = 1;


  // FIX THE HUD
  const drawHUD = () => {
    const hudx = Math.sign(vx) + vx;
    const hudy = Math.sign(vy) + vy;
    const mx = x + hudx;
    const my = y + hudy;
    console.log(mx, my);
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


  // game physics
  const collision = () => {
    console.log(vx, vy, iy)

    // hole
    if (x > 1100 && x < 1120) {
      if (y > 394){
        vx = 0;
      }
      if (y > 408) {
        console.log("winner");
        clearInterval(handle);
        iy = -10;
        vx = 1;
        vy = iy;
        return drawRest(); // draw WINNER
      }
    } else if (x > 149 && x < 400) {
      // water
      if (y > 394) {
        vy /= 2;
        vx /= 2;
        if (y > 590) {
          console.log("soaked!");
          clearInterval(handle);
          iy = -5;
          vx = 1;
          vy = iy;
          return drawRest(); // draw WETTER
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
          return drawRest("sand"); // draw BEACHED
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

   const gravityCalc = (n) => {
    return n + g;
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
    drawBall();
    drawHUD();
  }


  // terrain
  const drawTerrain = () => {
    // grass
    ctx.beginPath();
    ctx.rect(0, 400, 1220, 120);
    ctx.fillStyle = "green";
    ctx.fill();

    // water
    ctx.beginPath();
    ctx.rect(150, 400, 250, 120);
    ctx.fillStyle = "blue";
    ctx.fill();

    // sand
    ctx.beginPath();
    ctx.rect(820, 400, 100, 120);
    ctx.fillStyle = "wheat";
    ctx.fill();

    // green
    ctx.beginPath();
    ctx.rect(930, 400, 1220, 120);
    ctx.fillStyle = "#4fd67b";
    ctx.fill();

    // hole
    ctx.beginPath();
    ctx.rect(1100, 400, 20, 15);
    ctx.fillStyle = "white";
    ctx.fill();
  }


  // user controls
  const doKeyDown = (e) => {
    if (!inAir) {
      switch(e.keyCode){
        case 32:
          window.addEventListener("keyup", doKeyUp, false);
          console.log(vx);
          drawRest();
          return vx = Math.sign(vx)*(Math.abs(vx) + 2);
        case 97: //a
          if (Math.sign(vx) === 1) {
            vx = -1 * vx;
          }
          console.log(vx);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return drawRest();
        case 100: //d
          if (Math.sign(vx) === -1) {
            vx = -1 * vx;
          }
          console.log(vx);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return drawRest();
        case 115: //s
          vy += 2;
          iy += 2;
          console.log(vy);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return drawRest();
        case 119: //w
          vy -= 2;
          iy -= 2;
          console.log(vy);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return drawRest();
        default:
          return null;
      }
    }
  }

  const doKeyUp = (e) => {
    if (e.keyCode === 32) {
      return handle = setInterval(drawCollision, 30);
    }
  }

  // game start
  drawRest();
  window.addEventListener("keypress", doKeyDown, false);
})