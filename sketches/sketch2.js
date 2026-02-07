// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
p.setup = function () {
  p.createCanvas(p.windowWidth, p.windowHeight);
  p.angleMode(DEGREES);
};

p.draw = function (){
  p.background('black');

  let hr = p.hour() % 12;
  let mn = p.minute();
  let sc = p.second();

  let scAngle = map(sc, 0, 60, 0, 360);
  let mnAngle = map(mn, 0, 60, 0, 360);
  let hrAngle = map(hr + mn / 60, 0, 12, 0, 360);
  
  let d = p.day();
  let m = p.month();
  
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayOfWeek = days[d];
  
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  let monthAbv = months[m];
  

  p.translate(p.width / 2, p.height / 2);

  p.noFill();
  p.strokeCap(ROUND);
  
  //faded circles in background to help visualize progress
  p.stroke('#4a1c1c');
  p.strokeWeight(12);
  p.circle(0,0,300);
  
  p.stroke('#163b16');
  p.strokeWeight(12);
  p.circle(0,0,260);
  
  p.stroke('#2c2c42');
  p.strokeWeight(12);
  p.circle(0,0,220);

  // Seconds ring
  p.stroke('#ff6464');
  p.strokeWeight(12);
  p.arc(0, 0, 300, 300, -90, hrAngle - 90);

  // Minutes ring
  p.stroke('#00ff64');
  p.strokeWeight(12);
  p.arc(0, 0, 260, 260, -90, mnAngle - 90);

  // Hours ring
  p.stroke('#6464ff');
  p.strokeWeight(12);
  p.arc(0, 0, 220, 220, -90, scAngle - 90);
  
  

  // Digital time + date
  p.noStroke();
  p.fill(0);
  p.textAlign(CENTER, CENTER);
  p.textSize(24);
  p.fill('white');
  p.text(
    nf(hr, 2) + ":" + nf(mn, 2) + ":" + nf(sc, 2) + 
    '\n' + dayOfWeek + ', ' + monthAbv + ". " + m,
    0,
    0
  );


};

p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };

});
