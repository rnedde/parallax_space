/*
Parallax
by Reverie Nedde
July 2024

Read the blog post about this sketch here: 

for NYU IMA Low Res -- Creative Coding 

Week 4 
Creating a parallax effect inspired by 2D animation techniques invented by Lotte Reiniger, and later the multiplane camera invented for Disney Animation.


Instructions: 
move head around to see a simulated 3-D space made from 2-D objects
click sketch to recalibrate
*/

//constants
let SCALE = 1.25; //resize factor of images


//ml5 variables
let video, poseNet, pose;

//image variables
let image1, image2, image3, image4, image5, image6,image7,image8,image9, bg;

//object variables
let bgShape, shape1, shape2, shape3,shape4,shape5,shape6,shape7,shape8,shape9;

//face positions
let faceOriginalPosition, facePosition, faceDifference;

//preload images
function preload(){
  image1 = loadImage("n1.png");
  image2 = loadImage("n2.png");
  image3 = loadImage("n3.png");
  image4 = loadImage("n4.png");
}

//setup
function setup(){
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  imageMode(CENTER);
  
  //ml5 stuff
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video);
  poseNet.on("pose", gotPoses);
  
  //creates shapes
 
  shape1 = new Shape(width/2, height/2, 0, image1, BLEND);//wall
  shape2 = new Shape(width/2, height/2, 0.1, image2, BLEND);//items
  shape3 = new Shape(width/2, height/2, 0.15, image3, BLEND);//desk
  shape4 = new Shape(width/2, height/2, 0.3, image4, BLEND);//me
  
  
  //initializes original position
  faceOriginalPosition = createVector(width/2, height/2);
}

//for ml5
function gotPoses(poses){
  if (poses.length > 0) {
    // Find the face closest to the center of the canvas
    let closestPose = null;
    let closestDistance = Infinity;
    
    poses.forEach(p => {
      let eyePos = createVector(p.pose.rightEye.x, p.pose.rightEye.y);
      let d = dist(eyePos.x, eyePos.y, width/2, height/2);
      if (d < closestDistance) {
        closestDistance = d;
        closestPose = p.pose;
      }
    });

    if (closestPose) {
      pose = closestPose;
    }
  }
}

//draw
function draw(){
  background(200);
  // rect(-100, -100, 5000, 5000);

  
  if(pose){
    //tracks the position of right eye only.
    //updates face position every time it runs.
    let facePosition = createVector(pose.rightEye.x, pose.rightEye.y);
    
    //calibrates face position when mouse is clicked
    if (mouseIsPressed) {
      faceOriginalPosition = createVector(pose.rightEye.x, pose.rightEye.y);
    }
    
    //calculates difference between current and original face vectors. 
    faceDifference = facePosition.copy();
    faceDifference.sub(faceOriginalPosition);
    
    //draws rectangles

    shape1.show();
    shape2.show();
    shape3.show();
    shape4.show();

  }
}

class Shape {
  constructor(x, y, level, image, blend){
    this.x = x;
    this.y = y;
    this.level = level; //determines how much to map to create 3D effect
    this.image = image;
    this.blend = blend;
  }
  
  show(){
    fill(100); 
    this.image.resize(0, height * SCALE); //resizes image while keeping aspect ratio
    let moveAmount = createVector(faceDifference.x, faceDifference.y * -1);
    push();
    moveAmount.mult(this.level);
    blendMode(this.blend);
    translate(moveAmount);
    image(this.image, this.x, this.y);
    pop();
  }
}
