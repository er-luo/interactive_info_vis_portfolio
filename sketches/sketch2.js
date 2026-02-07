// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  // --- Timer settings ---
  let steepTime = 0; // no default time
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
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.frameRate(20);

    lightTea = p.color(245, 240, 230, 200); // light tea
    darkTea  = p.color(90, 50, 20, 220);    // dark tea

    // --- Create inputs ---
    minutesInput = p.createInput('0');
    minutesInput.size(30);
    secondsInput = p.createInput('10');
    secondsInput.size(30);

    // --- Create labels ---
    minutesLabel = p.createSpan('Min');
    secondsLabel = p.createSpan('Sec');

    // --- Create button ---
    startButton = p.createButton('Start Timer');
    startButton.mousePressed(startTimer);

    positionInputs();
  };

  function positionInputs() {
    let yPos = p.height / 2.9;

    minutesInput.position(p.width / 2 - 80, yPos);
    minutesLabel.position(p.width / 2 - 80, yPos - 20);

    secondsInput.position(p.width / 2 - 40, yPos);
    secondsLabel.position(p.width / 2 - 40, yPos - 20);

    startButton.position(p.width / 2, yPos);
  }

  p.draw = function() {
    p.background(245);
    p.translate(p.width / 2, p.height / 2);

    // --- Title ---
    p.noStroke();
    p.fill(135, 88, 54);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(36);
    p.text("Tea Timer", 0, -p.height / 4);

    // --- Subtitle ---
    p.textSize(15);
    p.text("Watch your tea steep!", 0, -p.height / 5);

    // --- Cup dimensions ---
    let cupWidth = 220;
    let cupHeight = 160;
    let teaHeight = cupHeight * 0.9;
    let teaTop = cupHeight / 2 - teaHeight;

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
    p.rect(-cupWidth / 2, teaTop, cupWidth, teaHeight, 0, 0, 20, 20);

    // --- Dark line on top of tea ---
    p.stroke(80, 50, 20);
    p.strokeWeight(2);
    p.line(-cupWidth / 2, teaTop, cupWidth / 2, teaTop);

    // --- Cup outline ---
    p.noFill();
    p.stroke(80);
    p.strokeWeight(4);
    p.rect(-cupWidth / 2, -cupHeight / 2, cupWidth, cupHeight, 0, 0, 30, 30);

    // --- Tea bag ---
    drawTeaBag(cupWidth, cupHeight);

    // --- Timer text ---
    p.noStroke();
    p.fill(60);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);

    if (!timerRunning) {
      p.text("Set your timer and press Start", 0, cupHeight / 2 + 40);
    } else if (progress < 1) {
      let elapsed = p.millis() - startTime;
      let remaining = p.max(0, p.ceil((steepTime - elapsed) / 1000));
      p.text("Steeping: " + remaining + "s", 0, cupHeight / 2 + 40);
    } else {
      p.textSize(32);
      p.fill(80, 150, 60);
      p.text("Done!", 0, cupHeight / 2 + 40);
      timerRunning = false;
    }
  };

  function drawTeaBag(cupWidth, cupHeight) {
    p.push();
    let sway = Math.sin(p.frameCount * 0.8) * 8;
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