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
let SCALE = 1.75; //resize factor of images


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
  bg = loadImage("bg.png")
  image1 = loadImage("1.png");
  image2 = loadImage("2.png");
  image3 = loadImage("3.png");
  image4 = loadImage("4.png");
  image5 = loadImage("5.png");
  image6 = loadImage("6.png");
  image7 = loadImage("7.png");
  image8 = loadImage("8.png");
  image9 = loadImage("9.png");
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
  bgShape = new Shape(width/2, height/2, 0, bg, BLEND);//background
  shape1 = new Shape(width/2, height/2, 0.05, image1, ADD);//nebula 1
  shape2 = new Shape(width/2, height/2, 0.08, image2, HARD_LIGHT);//nebula detail
  shape3 = new Shape(width/2, height/2, 0.1, image3, ADD);//star field
  shape4 = new Shape(width/2, height/2, 0.19, image4, ADD);//highlight stars 1
  shape5 = new Shape(width/2, height/2, 0.21, image5, BLEND);//highlight stars 2
  shape6 = new Shape(width/2, height/2, 0.5, image6, BLEND);//Large planet
  shape7 = new Shape(width/2, height/2, 0.75, image7, BLEND);//small planet
  shape8 = new Shape(width/2, height/2, 0.9, image8, BLEND);//far landscape
  shape9 = new Shape(width/2, height/2, 1, image9, BLEND);//close landscape
  
  
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
    bgShape.show();
    shape1.show();
    shape2.show();
    shape3.show();
    shape4.show();
    shape5.show();
    shape6.show();
    shape7.show();
    shape8.show();
    shape9.show();
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
