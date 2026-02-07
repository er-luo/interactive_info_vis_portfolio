// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  // --- Timer settings ---
  let steepTime = 0; 
  let startTime;
  let timerRunning = false;

  // Tea colors
  let lightTea;
  let darkTea;

  // Inputs, labels, and button
  let minutesInput, secondsInput;
  let minutesLabel, secondsLabel;
  let startButton;

  p.setup = function() {
    let canvas = p.createCanvas(800, 800);
    canvas.parent('sketch-container-sk2');
    p.angleMode(p.DEGREES);
    p.frameRate(60);

    lightTea = p.color(245, 240, 230, 200);
    darkTea  = p.color(90, 50, 20, 220);

    // --- Create inputs ---
    minutesInput = p.createInput('0');
    minutesInput.size(30);
    secondsInput = p.createInput('10');
    secondsInput.size(30);

    minutesLabel = p.createSpan('Min');
    secondsLabel = p.createSpan('Sec');

    startButton = p.createButton('Start Timer');
    startButton.mousePressed(startTimer);

    // Attach inputs to the canvas container
    const parentEl = canvas.parent();
    minutesInput.parent(parentEl);
    secondsInput.parent(parentEl);
    minutesLabel.parent(parentEl);
    secondsLabel.parent(parentEl);
    startButton.parent(parentEl);

    positionInputs();
  };

  function positionInputs() {
  let canvasCenterX = p.width / 2;
  let titleBottomY = p.height / 4 + 40;   // title + subtitle
  let cupTopY = p.height / 2 - 160 / 2;   // cupHeight = 160

  let yPos = (titleBottomY + cupTopY) / 2; // halfway between subtitle and cup rim

  minutesInput.position(canvasCenterX - 80, yPos);
  minutesLabel.position(canvasCenterX - 80, yPos - 20);

  secondsInput.position(canvasCenterX - 40, yPos);
  secondsLabel.position(canvasCenterX - 40, yPos - 20);

  startButton.position(canvasCenterX, yPos + 40);
}

  p.draw = function() {
    p.background(245);

    // --- Title ---
    p.noStroke();
    p.fill(135, 88, 54);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(36);
    p.text("Tea Timer", p.width / 2, p.height / 4);

    // --- Subtitle ---
    p.textSize(15);
    p.text("Watch your tea steep!", p.width / 2, p.height / 4 + 30);

    // --- Cup dimensions ---
    let cupWidth = 220;
    let cupHeight = 160;
    let cupX = p.width / 2 - cupWidth / 2;
    let cupY = p.height / 2 - cupHeight / 2;

    let teaHeight = cupHeight * 0.9;
    let teaTop = cupY + (cupHeight - teaHeight);

    // --- Time progress ---
    let progress = 0;
    if (timerRunning) {
      let elapsed = p.millis() - startTime;
      progress = p.constrain(elapsed / steepTime, 0, 1);
    }

    // --- Draw tea ---
    let teaColor = p.lerpColor(lightTea, darkTea, progress);
    p.noStroke();
    p.fill(teaColor);
    p.rect(cupX, teaTop, cupWidth, teaHeight, 0, 0, 20, 20);

    // --- Dark line on top of tea ---
    p.stroke(80, 50, 20);
    p.strokeWeight(2);
    p.line(cupX, teaTop, cupX + cupWidth, teaTop);

    // --- Cup outline ---
    p.noFill();
    p.stroke(80);
    p.strokeWeight(4);
    p.rect(cupX, cupY, cupWidth, cupHeight, 0, 0, 30, 30);

    // --- Tea bag ---
    drawTeaBag(cupX, cupY, cupWidth, cupHeight);

    // --- Timer text ---
    p.noStroke();
    p.fill(60);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);

    if (!timerRunning) {
      p.text("Set your timer and press Start", p.width / 2, cupY + cupHeight + 40);
    } else if (progress < 1) {
      let elapsed = p.millis() - startTime;
      let remaining = p.max(0, p.ceil((steepTime - elapsed) / 1000));
      p.text("Steeping: " + remaining + "s", p.width / 2, cupY + cupHeight + 40);
    } else {
      p.textSize(32);
      p.fill(80, 150, 60);
      p.text("Done!", p.width / 2, cupY + cupHeight + 40);
    }
  };

  function drawTeaBag(cupX, cupY, cupWidth, cupHeight) {
    p.push();
    let sway = Math.sin(p.frameCount * 0.03) * 8;
    let rimX = cupX + cupWidth / 4;
    let rimY = cupY;

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

  function startTimer() {
    let mins = parseInt(minutesInput.value());
    let secs = parseInt(secondsInput.value());
    if ((isNaN(mins) || mins < 0) || (isNaN(secs) || secs < 0)) return;

    steepTime = (mins * 60 + secs) * 1000;
    startTime = p.millis();
    timerRunning = true;
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    positionInputs();
  };
});
