class WaterBodies2{
  constructor(ctx){
    //create a waterbody in the north
    let wb2
    for(let wb=0;wb<100;wb++){
      wb2=new WaterBody2(ctx,0+wb*100,50,100+wb*100,100)
      wb2.draw()

    }
  }
}