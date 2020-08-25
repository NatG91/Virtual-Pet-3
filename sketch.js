//Create variables here
var dog,happyDog,database,foodS,foodStock
var foodStock,lastFed
var bedroomImg,gardenImg,washroomImg;

function preload()
{
  //load images here
  dogStanding=loadImage("images/dogImg.png");
  happyDog=loadImage("images/dogImg1.png");
  bedroomImg=loadImage("images/Bed Room.png");
  gardenImg=loadImage("images/Garden.png");
  washroomImg=loadImage("images/Wash Room.png")
}

function setup() {
  createCanvas(1000,800);
  database=firebase.database();
  dog=createSprite(800,250,20,20);
  dog.addImage(dogStanding);
  dog.scale=0.2
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed the dog");
  feed.position(900,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(1000,95);
  addFood.mousePressed(addFoods);

  foodObject=new Food();
  
  //reading the game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
}


function draw() {  

background(46,139,87);

foodObject.display();

if(keyWentDown(UP_ARROW)){
  writeStock(foodS);
  dog.addImage(happyDog);
}

textSize(15);
fill('White');
stroke(1);
//text('Note: Press the UP_ARROW Key To Feed Drago Milk!',30,60);
drawSprites();
//text('Food Remaining:'+foodS,100,120)

fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
lastFed=data.val();
});

fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Feed: "+ lastFed%12 + "PM", 350,30);
}else if(lastFed==0){
  text("Last Feed : 12 AM",350,30);
} else{
  text("Last Feed : "+lastFed+ " AM", 350,30)
}

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
} else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}
//function to update gameStates in the database
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
}

function readStock(data){
  foodS=data.val();
}
function writeStock(x){
  if (x<=0){
x=0;
  } else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })

}

//function to update food stock and the last fed time

function feedDog(){
  dog.addImage(happyDog);

  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function readStock(data){ foodS=data.val(); foodObject.updateFoodStock(foodS) } foodObject.updateFoodStock(foodS)
