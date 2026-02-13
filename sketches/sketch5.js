registerSketch('sk5', function (p) {

  let spotifyHistory;
  let monthlyTotals = {};
  let months = [];
  let maxValue = 0;
  let overallAvg = 0;

  const monthNames = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
    "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
  };

  // Define major school breaks
  const schoolBreaks = [
    { month: "12", name: "Winter Break" },
    { month: "06", name: "Summer Break" },
    { month: "07", name: "Summer Break" },
    { month: "08", name: "Summer Break" },
    { month: "09", name: "Summer Break" }
  ];

  p.preload = function () {
    spotifyHistory = p.loadJSON("sketches/datasets/StreamingHistory_combined.json");
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    spotifyHistory = Object.values(spotifyHistory);

    calculateMonthlyTotals();
    months = Object.keys(monthlyTotals).sort();
    maxValue = Math.max(...Object.values(monthlyTotals));

    overallAvg = Object.values(monthlyTotals).reduce((a, b) => a + b, 0) / months.length;
  };

  function calculateMonthlyTotals() {
    for (let i = 0; i < spotifyHistory.length; i++) {
      let entry = spotifyHistory[i];
      let month = entry.endTime.substring(5, 7); // MM
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
    let numCircles = 4;
    for (let i = 1; i <= numCircles; i++) {
      p.ellipse(0, 0, (radius / numCircles) * i * 2);
    }

    // ---- Radar shape ----
    p.fill(100, 150, 255, 150);
    p.stroke(0);
    p.strokeWeight(1.5);
    p.beginShape();
    for (let i = 0; i < months.length; i++) {
      let angle = p.TWO_PI * i / months.length - p.HALF_PI;
      let value = monthlyTotals[months[i]];
      let r = p.map(value, 0, maxValue, 0, radius);
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // ---- Month markers and labels ----
    for (let i = 0; i < months.length; i++) {
      let angle = p.TWO_PI * i / months.length - p.HALF_PI;
      let value = monthlyTotals[months[i]];
      let r = p.map(value, 0, maxValue, 0, radius);
      let x = r * Math.cos(angle);
      let y = r * Math.sin(angle);

      // Marker circle
      p.fill(255, 50, 50);
      p.noStroke();
      p.ellipse(x, y, 8, 8);

      // Value label
      p.fill(0);
      p.textSize(12);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(Math.round(value), x, y - 5);

      // Month label
      let labelRadius = radius + 30;
      let lx = labelRadius * Math.cos(angle);
      let ly = labelRadius * Math.sin(angle);
      p.fill(0);
      p.textSize(12);

      // Align labels dynamically left/right depending on side
      if (Math.cos(angle) >= 0) {
        p.textAlign(p.LEFT, p.CENTER); // right side
      } else {
        p.textAlign(p.RIGHT, p.CENTER); // left side
      }
      p.text(monthNames[months[i]], lx, ly);
    }

    // ---- Overall average line ----
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

    // ---- School break markers ----
    schoolBreaks.forEach(breakItem => {
      let i = months.indexOf(breakItem.month);
      if (i >= 0) {
        let angle = p.TWO_PI * i / months.length - p.HALF_PI;
        let r = radius + 60;
        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);

        p.fill(255, 165, 0);
        p.noStroke();
        p.ellipse(x, y, 12, 12);

        breakItem.screenX = x;
        breakItem.screenY = y;
      }
    });

    // ---- Tooltip for school breaks ----
    schoolBreaks.forEach(breakItem => {
      let d = p.dist(p.mouseX - centerX, p.mouseY - centerY, breakItem.screenX, breakItem.screenY);
      if (d < 10) { // hover radius
        p.fill(0);
        p.textSize(14);

        let tooltipX = breakItem.screenX + 15;
        let tooltipY = breakItem.screenY - 10;

        if (breakItem.screenX < 0) { // left side
          tooltipX = breakItem.screenX - 15;
          p.textAlign(p.RIGHT, p.BOTTOM);
        } else { // right side
          p.textAlign(p.LEFT, p.BOTTOM);
        }

        p.text(breakItem.name, tooltipX, tooltipY);
      }
    });

    p.pop();

    // ---- Title & subtitle ----
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(24);
    p.text("Monthly Spotify Listening Totals", p.width / 2, 40);
    p.textSize(16);
    p.text("Spotify listening totals by month from 2025-2026", p.width / 2, 70);

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

    // School break marker
    legendY += 20;
    p.fill(255, 165, 0);
    p.ellipse(legendX + 20, legendY, 12, 12);
    p.fill(0);
    p.text("Major school break", legendX + 50, legendY);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
