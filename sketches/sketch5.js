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

  // ---- Seasons ----
  const seasons = {
    "12": "Winter", "01": "Winter", "02": "Winter",
    "03": "Spring", "04": "Spring", "05": "Spring",
    "06": "Summer", "07": "Summer", "08": "Summer",
    "09": "Fall",   "10": "Fall",   "11": "Fall"
  };

  const seasonColors = {
    "Winter": [120, 170, 255],
    "Spring": [120, 220, 140],
    "Summer": [255, 200, 80],
    "Fall":   [255, 140, 80]
  };

  const schoolBreaks = [
    { month: "12", name: "Winter Break" },
    { month: "06", name: "Summer Break" },
    { month: "07", name: "Summer Break" },
    { month: "08", name: "Summer Break" },
    { month: "09", name: "Summer Break" }
  ];

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

    // ---- Concentric circles ----
    p.noFill();
    p.stroke(200);
    for (let i = 1; i <= 4; i++) {
      p.ellipse(0, 0, (radius / 4) * i * 2);
    }

    // ---- Continuous Season Ring ----
    let arcThickness = 18;
    p.noFill();
    p.strokeWeight(arcThickness);

    let i = 0;
    while (i < months.length) {
      let currentSeason = seasons[months[i]];
      let startIndex = i;

      // count how many consecutive months share this season
      while (
        i < months.length &&
        seasons[months[i]] === currentSeason
      ) {
        i++;
      }

      let endIndex = i;

      let angleStart =
        p.TWO_PI * startIndex / months.length - p.HALF_PI;
      let angleEnd =
        p.TWO_PI * endIndex / months.length - p.HALF_PI;

      let color = seasonColors[currentSeason];
      p.stroke(color[0], color[1], color[2], 180);

      p.arc(
        0,
        0,
        (radius + 45) * 2,
        (radius + 45) * 2,
        angleStart,
        angleEnd
      );
    }

    p.strokeWeight(1);

    // ---- Radar shape ----
    p.fill(100, 150, 255, 150);
    p.stroke(0);
    p.strokeWeight(1.5);
    p.beginShape();
    for (let i = 0; i < months.length; i++) {
      let angle = p.TWO_PI * i / months.length - p.HALF_PI;
      let value = monthlyAvgs[months[i]];
      let r = p.map(value, 0, maxValue, 0, radius);
      p.vertex(r * Math.cos(angle), r * Math.sin(angle));
    }
    p.endShape(p.CLOSE);

    // ---- Month markers & labels ----
    for (let i = 0; i < months.length; i++) {
      let angle = p.TWO_PI * i / months.length - p.HALF_PI;
      let value = monthlyAvgs[months[i]];
      let r = p.map(value, 0, maxValue, 0, radius);
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);

      p.fill(255, 50, 50);
      p.noStroke();
      p.ellipse(x, y, 8, 8);

      p.fill(0);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(Math.round(value) + " min/day", x, y - 5);

      let labelRadius = radius + 30;
      let lx = labelRadius * Math.cos(angle);
      let ly = labelRadius * Math.sin(angle);

      p.textAlign(Math.cos(angle) >= 0 ? p.LEFT : p.RIGHT, p.CENTER);
      p.text(monthNames[months[i]], lx, ly);
    }

    // ---- School Break Markers ----
    for (let b = 0; b < schoolBreaks.length; b++) {
      let breakItem = schoolBreaks[b];
      let index = months.indexOf(breakItem.month);

      if (index >= 0) {
        let angle = p.TWO_PI * index / months.length - p.HALF_PI;
        let r = radius + 75;

        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);

        p.fill(255, 165, 0);
        p.noStroke();
        p.ellipse(x, y, 10, 10);

        breakItem.screenX = x;
        breakItem.screenY = y;
      }
    }

    // ---- Overall Average Line ----
    p.stroke(0, 150, 50);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < months.length; i++) {
      let angle = p.TWO_PI * i / months.length - p.HALF_PI;
      let r = p.map(overallAvg, 0, maxValue, 0, radius);
      p.vertex(r * Math.cos(angle), r * Math.sin(angle));
    }
    p.endShape(p.CLOSE);

    p.pop();

    // ---- Title ----
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(24);
    p.text("Average Daily Spotify Listening by Month", p.width / 2, 40);

    p.textSize(16);
    p.text("Spotify listening average minutes per day (2025–2026)", p.width / 2, 70);

    // ---- Legend ----
    let legendX = 50;
    let legendY = 50;

    p.stroke(0, 150, 50);
    p.strokeWeight(2);
    p.line(legendX, legendY, legendX + 40, legendY);
    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text("Overall daily average", legendX + 50, legendY);

    legendY += 20;
    p.fill(255, 165, 0);
    p.ellipse(legendX + 20, legendY, 10, 10);
    p.fill(0);
    p.text("Major school break", legendX + 50, legendY);

    legendY += 30;

    let seasonList = ["Winter", "Spring", "Summer", "Fall"];
    for (let s = 0; s < seasonList.length; s++) {
      let season = seasonList[s];
      let color = seasonColors[season];

      p.stroke(color[0], color[1], color[2]);
      p.strokeWeight(6);
      p.line(legendX, legendY, legendX + 30, legendY);

      p.noStroke();
      p.fill(0);
      p.text(season, legendX + 40, legendY);

      legendY += 20;
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

});
