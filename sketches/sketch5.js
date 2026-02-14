registerSketch('sk5', function (p) {

  let spotifyHistory;
  let monthlyTotals = {};
  let monthlyAvgs = {};
  let months = [];
  let maxValue = 0;
  let overallAvg = 0;

  const monthNames = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
    "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
  };

  const monthDays = {
    "01": 31, "02": 28, "03": 31, "04": 30,
    "05": 31, "06": 30, "07": 31, "08": 31,
    "09": 30, "10": 31, "11": 30, "12": 31
  };

  // Meteorological seasons
  const seasons = {
    "12": "Winter", "01": "Winter", "02": "Winter",
    "03": "Spring", "04": "Spring", "05": "Spring",
    "06": "Summer", "07": "Summer", "08": "Summer",
    "09": "Fall",   "10": "Fall",   "11": "Fall"
  };

  const seasonColors = {
    "Winter": [180, 220, 255, 80],
    "Spring": [180, 255, 180, 80],
    "Summer": [255, 230, 150, 80],
    "Fall":   [255, 190, 140, 80]
  };

  p.preload = function () {
    spotifyHistory = p.loadJSON("sketches/datasets/StreamingHistory_combined.json");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    spotifyHistory = Object.values(spotifyHistory);

    calculateMonthlyTotals();
    months = Object.keys(monthlyTotals).sort();

    for (let i = 0; i < months.length; i++) {
      let month = months[i];
      let totalMinutes = monthlyTotals[month];
      let days = monthDays[month];
      monthlyAvgs[month] = totalMinutes / days;
    }

    maxValue = Math.max(...Object.values(monthlyAvgs));

    overallAvg =
      Object.values(monthlyAvgs).reduce((a, b) => a + b, 0) /
      months.length;
  };

  function calculateMonthlyTotals() {
    for (let i = 0; i < spotifyHistory.length; i++) {
      let entry = spotifyHistory[i];
      let month = entry.endTime.substring(5, 7);
      let minutes = entry.msPlayed / 1000 / 60;

      if (!monthlyTotals[month]) monthlyTotals[month] = 0;
      monthlyTotals[month] += minutes;
    }
  }

  p.draw = function () {
    p.background(250);

    let centerX = p.width / 2;
    let centerY = p.height / 2;
    let radius = Math.min(p.width, p.height) * 0.35;

    p.push();
    p.translate(centerX, centerY);

    // --------------------------------------------------
    // SEASONAL QUADRANT BACKGROUND
    // --------------------------------------------------

    let quadrantSize = p.TWO_PI / 4;

    const seasonOrder = ["Winter", "Spring", "Summer", "Fall"];

    for (let i = 0; i < 4; i++) {
      p.fill(...seasonColors[seasonOrder[i]]);
      p.noStroke();

      p.arc(
        0,
        0,
        radius * 2,
        radius * 2,
        -p.HALF_PI + i * quadrantSize,
        -p.HALF_PI + (i + 1) * quadrantSize,
        p.PIE
      );
    }

    // --------------------------------------------------
    // GRID CIRCLES
    // --------------------------------------------------

    p.noFill();
    p.stroke(200);
    let numCircles = 4;
    for (let i = 1; i <= numCircles; i++) {
      p.ellipse(0, 0, (radius / numCircles) * i * 2);
    }

    // --------------------------------------------------
    // RADAR SHAPE
    // --------------------------------------------------

    p.fill(100, 150, 255, 150);
    p.stroke(0);
    p.strokeWeight(1.5);
    p.beginShape();
    for (let i = 0; i < months.length; i++) {
      let angle = p.TWO_PI * i / months.length - p.HALF_PI;
      let value = monthlyAvgs[months[i]];
      let r = p.map(value, 0, maxValue, 0, radius);
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // --------------------------------------------------
    // MONTH MARKERS + LABELS
    // --------------------------------------------------

    for (let i = 0; i < months.length; i++) {
      let angle = p.TWO_PI * i / months.length - p.HALF_PI;
      let value = monthlyAvgs[months[i]];
      let r = p.map(value, 0, maxValue, 0, radius);

      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);

      // Marker
      p.fill(255, 50, 50);
      p.noStroke();
      p.ellipse(x, y, 8, 8);

      // Value label
      p.fill(0);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(Math.round(value) + " minutes a day", x, y - 5);

      // Month label
      let labelRadius = radius + 30;
      let lx = labelRadius * Math.cos(angle);
      let ly = labelRadius * Math.sin(angle);

      if (Math.cos(angle) >= 0) {
        p.textAlign(p.LEFT, p.CENTER);
      } else {
        p.textAlign(p.RIGHT, p.CENTER);
      }

      p.text(monthNames[months[i]], lx, ly);
    }

    // --------------------------------------------------
    // OVERALL AVERAGE LINE
    // --------------------------------------------------

    p.stroke(0, 150, 50);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < months.length; i++) {
      let angle = p.TWO_PI * i / months.length - p.HALF_PI;
      let r = p.map(overallAvg, 0, maxValue, 0, radius);
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // --------------------------------------------------
    // SEASON LABELS
    // --------------------------------------------------

    p.noStroke();
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);

    for (let i = 0; i < 4; i++) {
      let season = seasonOrder[i];

      // Get base color
      let base = seasonColors[season];

      // Create darker version (reduce RGB by 40%)
      let darkR = base[0] * 0.6;
      let darkG = base[1] * 0.6;
      let darkB = base[2] * 0.6;

      p.fill(darkR, darkG, darkB);

      let angle = -p.HALF_PI + quadrantSize * (i + 0.5);
      let labelRadius = radius + 70;
      let x = labelRadius * Math.cos(angle);
      let y = labelRadius * Math.sin(angle);

      p.text(season, x, y);
    }


    // --------------------------------------------------
    // TITLE
    // --------------------------------------------------

    p.push();              // isolate title styling
    p.resetMatrix();        // reset any translate/rotate/scaling
    p.fill(0);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(24);
    p.text("How much music did I listen to each season?", p.width / 2, 20);

    p.textSize(16);
    p.text("My spotify listening average minutes per day (2025–2026)", p.width / 2, 50);
    p.pop();

    p.push();

    // ---- Legend ----
    let legendX = 50;
    let legendY = 50;

    // Average line
    p.stroke(0, 150, 50);
    p.strokeWeight(2);
    p.line(legendX, legendY, legendX + 40, legendY);
    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text("Overall average", legendX + 50, legendY);
    p.text("Overall daily average", legendX + 50, legendY);
    p.pop();

  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

});
