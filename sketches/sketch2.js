// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
function setup() {
  p.createCanvas(p.windowWidth, p.windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background('black');

  let hr = hour() % 12;
  let mn = minute();
  let sc = second();

  let scAngle = map(sc, 0, 60, 0, 360);
  let mnAngle = map(mn, 0, 60, 0, 360);
  let hrAngle = map(hr + mn / 60, 0, 12, 0, 360);
  
  let d = day();
  let m = month();
  
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayOfWeek = days[d];
  
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  let monthAbv = months[m];
  

  translate(width / 2, height / 2);

  noFill();
  strokeCap(ROUND);
  
  //faded circles in background to help visualize progress
  stroke('#4a1c1c');
  strokeWeight(12);
  circle(0,0,300);
  
  stroke('#163b16');
  strokeWeight(12);
  circle(0,0,260);
  
  stroke('#2c2c42');
  strokeWeight(12);
  circle(0,0,220);

  // Seconds ring
  stroke('#ff6464');
  strokeWeight(12);
  arc(0, 0, 300, 300, -90, hrAngle - 90);

  // Minutes ring
  stroke('#00ff64');
  strokeWeight(12);
  arc(0, 0, 260, 260, -90, mnAngle - 90);

  // Hours ring
  stroke('#6464ff');
  strokeWeight(12);
  arc(0, 0, 220, 220, -90, scAngle - 90);
  
  

  // Digital time + date
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(24);
  fill('white');
  text(
    nf(hour(), 2) + ":" + nf(mn, 2) + ":" + nf(sc, 2) + 
    '\n' + dayOfWeek + ', ' + monthAbv + ". " + m,
    0,
    0
  );


}

});
