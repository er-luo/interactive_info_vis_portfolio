// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  // Timer
  let steepTime = 10 * 1000; // 10 seconds for testing
  let startTime;

  // Tea colors
  let lightTea;
  let darkTea;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    startTime = p.millis();

    lightTea = p.color(210, 170, 90, 120); // light tea
    darkTea  = p.color(90, 50, 20, 220);   // dark tea
  };

  p.draw = function() {
    p.background(245);
    p.translate(p.width / 2, p.height / 2);

    // Title
    p.noStroke();
    p.fill(135, 88, 54);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(36);
    p.text("Tea Timer", 0, -p.height / 4);

    // subtitle/instructions
    p.noStroke();
    p.fill(135, 88, 54);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(15);
    p.text("Watch your tea steep!", 0, -p.height / 5);

    // time progress
    let elapsed = p.millis() - startTime;
    let progress = p.constrain(elapsed / steepTime, 0, 1);

    // cup dimensions
    let cupWidth = 220;
    let cupHeight = 160;
    let teaHeight = cupHeight * 0.9;
    let teaTop = cupHeight / 2 - teaHeight;

    // draw tea 
    let teaColor = p.lerpColor(lightTea, darkTea, progress);
    p.noStroke();
    p.fill(teaColor);
    p.rect(-cupWidth / 2, teaTop, cupWidth, teaHeight, 0, 0, 20, 20);

    // draw cup
    p.noFill();
    p.stroke(80);
    p.strokeWeight(4);
    p.rect(-cupWidth / 2, -cupHeight / 2, cupWidth, cupHeight, 0, 0, 30, 30);

    // draw tea bag 
    drawTeaBag(cupWidth, cupHeight);

    // finally making the timer
    p.noStroke();
    p.fill(60);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    if (progress < 1) {
      let remaining = Math.max(0, p.ceil((steepTime - elapsed) / 1000));
      p.text("Steeping: " + remaining + "s", 0, cupHeight / 2 + 40);
    } else {
      p.textSize(32);
      p.fill(80, 150, 60);
      p.text("Done!", 0, cupHeight / 2 + 40);
    }
  };

  function drawTeaBag(cupWidth, cupHeight) {
    p.push();
    let sway = p.sin(p.frameCount * 0.8) * 8;
    let rimX = -cupWidth / 4;
    let rimY = -cupHeight / 2;

    // String
    p.stroke(120);
    p.strokeWeight(1.5);
    p.line(rimX, rimY, rimX + sway, rimY + 30);

    // Tea bag body 
    p.fill(200, 180, 140);
    p.stroke(250);
    p.strokeWeight(2);
    p.rect(rimX + sway - 14, rimY + 30, 28, 36, 4);

    p.pop();
  }

  p.mousePressed = function() {
    startTime = p.millis();
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

});