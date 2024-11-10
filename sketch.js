let p0, p1, p2, p3;
let draggingP0 = false,
    draggingP1 = false,
    draggingP2 = false,
    draggingP3 = false;
let offsetX, offsetY;
function setup() {
  createCanvas(1000, 1000);
  strokeWeight(20);
  p0 = createVector(-100, 75);
  p1 = createVector(-110, -120);
  p2 = createVector(170, -55);
  p3 = createVector(140, 90);
  // Slider that controls T
  slider = createSlider(0, 1, 0, 0.01);
  slider.position(20, height - 30);
}
function draw() {
  background(0);
  stroke(255);
  strokeWeight(20);
  translate(400, 400);
  // Calculate lerped points for current t-value
  let t = slider.value();
  let v01 = p5.Vector.lerp(p0, p1, t);
  let v02 = p5.Vector.lerp(p1, p2, t);
  let v03 = p5.Vector.lerp(p2, p3, t);
  let v11 = p5.Vector.lerp(v01, v02, t);
  let v12 = p5.Vector.lerp(v02, v03, t);
  let v21 = p5.Vector.lerp(v11, v12, t);
  // Calculate derivatives
  let v_prime = firstDerivative(p0, p1, p2, p3, t);
  let v_double_prime = secondDerivative(p0, p1, p2, p3, t);
  // Draw structure lines
  strokeWeight(1);
  line(p0.x, p0.y, p1.x, p1.y);
  line(p1.x, p1.y, p2.x, p2.y);
  line(p2.x, p2.y, p3.x, p3.y);
  // Draw bezier curve
  strokeWeight(4);
  stroke(255);
  beginShape();
  noFill();
  for (let t = 0; t <= 1; t += 0.001) {
    let v = cubicBezier(p0, p1, p2, p3, t);
    vertex(v.x, v.y);
  }
  endShape();
  // Draw control points
  stroke(255, 175, 175);
  drawPoint(p0);
  stroke(175, 255, 175);
  drawPoint(p1);
  stroke(175, 175, 255);
  drawPoint(p2);
  stroke(255, 255, 175);
  drawPoint(p3);
  // Draw curve axis
  stroke(100);
  strokeWeight(2);
  line(-300, 0, 300, 0);
  line(0, -300, 0, 300);
  // Print coordinates and derivatives
  strokeWeight(0.7);
  textSize(25)
  textAlign(LEFT, TOP);
  fill(255, 175, 175);
  text(`p0: < ${p0.x.toFixed(2)}, ${p0.y.toFixed(2)} >`, width - 800, -380);
  fill(175, 255, 175);
  text(`p1: < ${p1.x.toFixed(2)}, ${p1.y.toFixed(2)} >`, width - 800, -350);
  fill(175, 175, 255);
  text(`p2: < ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)} >`, width - 800, -320);
  fill(255, 255, 175);
  text(`p3: < ${p3.x.toFixed(2)}, ${p3.y.toFixed(2)} >`, width - 800, -290);
  fill(255);
  text(`t-value: ${t}`, width - 800, -260);
  fill(255, 100, 100);
  text(
    `velocity: < ${v_prime.x.toFixed(2)}, ${v_prime.y.toFixed(2)} >`,
    width - 800,
    -230
  );
  fill(100, 100, 255);
  text(
    `acceleration: < ${v_double_prime.x.toFixed(2)}, ${v_double_prime.y.toFixed(
      2
    )} >`,
    width - 800,
    -200
  );
  // Draw first derivative (red) and related
  translate(350,350);
  strokeWeight(3);
  stroke(255, 0, 0);
  beginShape();
  noFill();
  for (let t = 0; t <= 1; t += 0.001) {
    let v_prime = firstDerivative(p0, p1, p2, p3, t);
    vertex(v_prime.x, v_prime.y);
  }
  endShape();
  stroke(100);
  strokeWeight(2);
  line(-200, 0, 200, 0);
  line(0, -200, 0, 200);
  stroke(255, 100, 100);
  drawArrow(0, 0, v_prime.x, v_prime.y)
  // Draw second derivative (blue)
  translate(-600,0);
  strokeWeight(3);
  stroke(0, 0, 255);
  beginShape();
  noFill();
  for (let t = 0; t <= 1; t += 0.001) {
    let v_double_prime = secondDerivative(p0, p1, p2, p3, t);
    vertex(v_double_prime.x, v_double_prime.y);
  }
  endShape();
  stroke(100);
  strokeWeight(2);
  line(-100, 0, 100, 0);
  line(0, -100, 0, 100);
  stroke(100, 100, 255);
  drawArrow(0, 0, v_double_prime.x, v_double_prime.y)
  // Draw velocity/acceleration on the bezier curve
  translate(250, -350)
  stroke(255, 100, 100);
  drawArrow(v21.x, v21.y, v21.x + v_prime.x, v21.y + v_prime.y);
  stroke(100, 100, 255);
  drawArrow(v21.x, v21.y, v21.x + v_double_prime.x, v21.y + v_double_prime.y)
}
function drawPoint(p) {
  strokeWeight(20);
  point(p.x, p.y);
}
function drawArrow(x1, y1, x2, y2) {
    line(x1, y1, x2, y2);
    let angle = atan2(y2 - y1, x2 - x1);
    let arrowSize = 10;
    let arrowX = x2;
    let arrowY = y2;
    push();
    translate(arrowX, arrowY);
    rotate(angle - PI / 2);
    triangle(0, 0, arrowSize / 2, -arrowSize, -arrowSize / 2, -arrowSize);
    pop();
  }
// cubic function call
function cubicBezier(p0, p1, p2, p3, t) {
  let v01 = p5.Vector.lerp(p0, p1, t);
  let v02 = p5.Vector.lerp(p1, p2, t);
  let v03 = p5.Vector.lerp(p2, p3, t);
  let v11 = p5.Vector.lerp(v01, v02, t);
  let v12 = p5.Vector.lerp(v02, v03, t);
  let v21 = p5.Vector.lerp(v11, v12, t);
  return v21;
}
// First derivative
function firstDerivative(p0, p1, p2, p3, t) {
  let v01 = p5.Vector.lerp(p0, p1, t);
  let v02 = p5.Vector.lerp(p1, p2, t);
  let v03 = p5.Vector.lerp(p2, p3, t);
  let v11 = p5.Vector.lerp(v01, v02, t);
  let v12 = p5.Vector.lerp(v02, v03, t);
  return p5.Vector.sub(v12, v11).mult(0.75);
}
// Second derivative
function secondDerivative(p0, p1, p2, p3, t) {
  let firstDerivative1 = firstDerivative(p0, p1, p2, p3, t);
  let firstDerivative2 = firstDerivative(p0, p1, p2, p3, t + 0.001);
  let secondDerivative = p5.Vector.sub(firstDerivative2, firstDerivative1).mult(100);
  return secondDerivative;
}
// Mouse is pressed
function mousePressed() {
  if (dist(mouseX, mouseY, p0.x + 400, p0.y + 400) < 20) {
    draggingP0 = true;
    offsetX = mouseX - p0.x;
    offsetY = mouseY - p0.y;
  }
  if (dist(mouseX, mouseY, p1.x + 400, p1.y + 400) < 20) {
    draggingP1 = true;
    offsetX = mouseX - p1.x;
    offsetY = mouseY - p1.y;
  }
  if (dist(mouseX, mouseY, p2.x + 400, p2.y + 400) < 20) {
    draggingP2 = true;
    offsetX = mouseX - p2.x;
    offsetY = mouseY - p2.y;
  }
  if (dist(mouseX, mouseY, p3.x + 400, p3.y + 400) < 20) {
    draggingP3 = true;
    offsetX = mouseX - p3.x;
    offsetY = mouseY - p3.y;
  }
}
// Mouse is dragged
function mouseDragged() {
  if (draggingP0) {
    p0.x = mouseX - offsetX;
    p0.y = mouseY - offsetY;
  }
  if (draggingP1) {
    p1.x = mouseX - offsetX;
    p1.y = mouseY - offsetY;
  }
  if (draggingP2) {
    p2.x = mouseX - offsetX;
    p2.y = mouseY - offsetY;
  }
  if (draggingP3) {
    p3.x = mouseX - offsetX;
    p3.y = mouseY - offsetY;
  }
}
// Mouse is released
function mouseReleased() {
  draggingP0 = false;
  draggingP1 = false;
  draggingP2 = false;
  draggingP3 = false;
}