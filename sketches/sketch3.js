// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
   p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };

  p.draw = function () {
    p.background(0);

    // Time values
    let hr = p.hour() % 12;
    let mn = p.minute();
    let sc = p.second();

    // Angle mappings
    let scAngle = p.map(sc, 0, 60, 0, 360);
    let mnAngle = p.map(mn, 0, 60, 0, 360);
    let hrAngle = p.map(hr + mn / 60, 0, 12, 0, 360);

    let now = new Date();
    let dayIndex = now.getDay();        
    let dateNum = p.day();              
    let monthIndex = p.month() - 1;     


    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


    // Center canvas
    p.translate(p.width / 2, p.height / 2);

    p.noFill();
    p.strokeCap(p.ROUND);

    // Background guide circles
    p.stroke('#4a1c1c');
    p.strokeWeight(12);
    p.circle(0, 0, 300);

    p.stroke('#163b16');
    p.circle(0, 0, 260);

    p.stroke('#2c2c42');
    p.circle(0, 0, 220);

    // Seconds ring
    p.stroke('#ff6464');
    p.arc(0, 0, 300, 300, -90, scAngle - 90);

    // Minutes ring
    p.stroke('#00ff64');
    p.arc(0, 0, 260, 260, -90, mnAngle - 90);

    // Hours ring
    p.stroke('#6464ff');
    p.arc(0, 0, 220, 220, -90, hrAngle - 90);

    // Digital time + date
    p.noStroke();
    p.fill('white');
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);

    p.text(
      p.nf(hr, 2) + ":" + p.nf(mn, 2) + ":" + p.nf(sc, 2) +
      "\n" +  days[dayIndex] + ", " + months[monthIndex] + ". " + dateNum,
      0,
      0
    );
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
