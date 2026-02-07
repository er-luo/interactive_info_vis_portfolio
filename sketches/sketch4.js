// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };

  p.draw = function () {
    p.background(245);
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour() % 12;
    let mn = p.minute();
    let sc = p.second() + (p.millis() % 1000) / 1000;

    // Progress values
    let secProgress = sc / 60;
    let minProgress = mn / 60;
    let hourProgress = hr / 12;

    // Subtle hour rotation
    p.rotate(p.map(hourProgress, 0, 1, -10, 10));

    // Hourglass dimensions
    let w = 160;
    let h = 300;
    let neck = 12;

    // Frame
    p.stroke(80);
    p.strokeWeight(4);
    p.noFill();

    p.beginShape();
    p.vertex(-w / 2, -h / 2);
    p.vertex(w / 2, -h / 2);
    p.vertex(neck / 2, 0);
    p.vertex(w / 2, h / 2);
    p.vertex(-w / 2, h / 2);
    p.vertex(-neck / 2, 0);
    p.endShape(p.CLOSE);

    // Sand color
    let sandColor = p.color(220, 190, 130);

    // --- Top sand (draining by minute) ---
    let topSandHeight = p.map(minProgress, 0, 1, h / 2 - 20, 0);
    p.fill(sandColor);
    p.noStroke();

    p.beginShape();
    p.vertex(-w / 2 + 10, -h / 2 + 10);
    p.vertex(w / 2 - 10, -h / 2 + 10);
    p.vertex(neck / 2, -topSandHeight);
    p.vertex(-neck / 2, -topSandHeight);
    p.endShape(p.CLOSE);

    // --- Falling sand (seconds) ---
    p.stroke(sandColor);
    p.strokeWeight(3);
    p.line(0, -10, 0, p.map(secProgress, 0, 1, 10, 40));

    // --- Bottom sand (filling by minute) ---
    p.noStroke();
    let bottomSandHeight = p.map(minProgress, 0, 1, 0, h / 2 - 20);

    p.beginShape();
    p.vertex(-neck / 2, bottomSandHeight);
    p.vertex(neck / 2, bottomSandHeight);
    p.vertex(w / 2 - 10, h / 2 - 10);
    p.vertex(-w / 2 + 10, h / 2 - 10);
    p.endShape(p.CLOSE);

    // --- Digital time ---
    p.fill(80);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text(
      p.nf(p.hour(), 2) + ":" +
      p.nf(p.minute(), 2) + ":" +
      p.nf(p.second(), 2),
      0,
      h / 2 + 30
    );
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
