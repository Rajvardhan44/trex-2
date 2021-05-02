var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver,gameOverImage, Restart,RestartImage;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  
  gameOverImage = loadImage("gameOver.png")
  RestartImage = loadImage("restart.png")
  
}


function setup() {
  createCanvas(windowWidth,windowHeight-120);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.07;

  //trex.setCollider()

  ground = createSprite(camera.x,displayHeight/4,2*displayWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /100;
  //ground.scale=0.2
  
  
  invisibleGround = createSprite(camera.x/2,displayHeight/4 - 10,2*displayWidth,10);
  invisibleGround.visible = false;
  
  

  Restart = createSprite(windowWidth/2,130);  
  Restart.addImage("Restart",RestartImage);
  Restart.scale = 0.05;

  gameOver = createSprite(windowWidth/2,100);  
  gameOver.addImage("Gameover",gameOverImage);
  gameOver.scale = 0.5;

  
  //create Obstacle and Cloud Groups]

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  //to set collider for trex
  trex.setCollider("circle",0,0,40);
  //to display the collider
  trex.debug = false;
  
  score = 0
}

function draw() {
  background("white");
  //displaying score
  text("Score: "+ score, camera.x+500,50);
  trex.velocityX = 0; 
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -6;
    //scoring
    score = score + Math.round(frameCount/60);

    camera.x = trex.x
    camera.y = trex.y
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=160) {
        trex.velocityY = -15;
    }
    if(keyDown("RIGHT_ARROW")) {
      trex.velocityX = 9;
  }
  if(keyDown("LEFT_ARROW")) {
    trex.velocityX = -9;
}

  if(trex.x < 0|| trex.x > windowWidth){
    trex.x = 50
  }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
    
    Restart.visible = false;
    gameOver.visible = false;

  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
   else if (gameState == END) {
      ground.velocityX = 0;
     //changes animation when trex is touching obstacles
     trex.changeAnimation("collided",trex_collided);
     //stops the trex in end state when we press space bar 
    trex.velocityY = 0;
    trex.velocityX = 0; 
     
     //it reduce life time but neverbecome 0 so that they        dont dissappear
     obstaclesGroup.setLifetimeEach(-1)
     cloudsGroup.setLifetimeEach(-1)

     //they set velocity 0 in end state
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     //makes the image visible in end state
     gameOver.x = camera.x
     Restart.x = camera.x
     Restart.visible = true;
     gameOver.visible = true;


     if(mousePressedOver(Restart)) {
      reset();
    }
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    

     
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  score = 0;
  
  gameOver.visible = false;
  Restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  
}
function spawnObstacles(){
   if (frameCount % 80 === 0){
     var obstacle = createSprite(windowWidth-10,165,10,40);
     obstacle.velocityX = -6;

      //generate random obstacles
      var rand = Math.round(random(1,5));
      switch(rand) {
      
           case 1: obstacle.addImage(obstacle1);
                  obstacle.scale = 0.5
                  obstacle.setCollider("rectangle",0,0,100,100)

                  break;
          case 2: obstacle.addImage(obstacle2);
          obstacle.scale = 0.5
          obstacle.setCollider("rectangle",0,0,100,100)

                 break;
          case 3: obstacle.addImage(obstacle3);
         obstacle.setCollider("circle",0,0,150)
             obstacle.scale = 0.2;
                  break;
          case 4: obstacle.addImage(obstacle4);
          obstacle.scale = 0.2;
          obstacle.setCollider("circle",0,0,200)
                  break;
          case 5: obstacle.addImage(obstacle5);
                  obstacle.scale =0.5
                  obstacle.setCollider("rectangle",0,0,100,100)
                  break;
          default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 500;

    obstacle.debug = false
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
       cloud = createSprite(600,100,40,10);
      cloud.y = Math.round(random(10,60));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);

     
    }
}


