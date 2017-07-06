document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let handle = null;
  var x = 20;
  var y = 395 ;
  var iy = -5 // angle
  var vx = 1 ; // power max(15?)
  var vy = iy;
  var g = 1;

  canvas.width = 1200;
  canvas.height = 500;

  const ballRadius = 5;

  const gravityCalc = (n) => {
    return n + g;
  }

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

  const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  const collision = () => {
    console.log(vx, vy, iy)
    if (x > 1100 && x < 1120) {
      if (y > 394){
        vx = 0;
      }
      if (y > 408) {
        console.log("winner");
        clearInterval(handle);
        iy = -5;
        vx = 1;
        vy = iy;
        return drawRest();
      }
    } else if (y >= 394) {
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

  const drawCollision = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTerrain();
    drawBall();
    x += vx;
    y += vy;
    vy = gravityCalc(vy);
    collision(x, y);
  }

  const drawRest = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTerrain();
    drawBall();
    drawHUD();
  }

  const drawTerrain = () => {
    ctx.beginPath();
    ctx.rect(0, 400, 1220, 120);
    ctx.fillStyle = "green";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(1100, 400, 20, 15);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  const doKeyDown = (e) => {
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

  const doKeyUp = (e) => {
    if (e.keyCode === 32) {
      return handle = setInterval(drawCollision, 30);
    }
  }

  drawRest();
  window.addEventListener("keypress", doKeyDown, false);
})