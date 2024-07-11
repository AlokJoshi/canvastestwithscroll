class WaterBodies2{
  constructor(ctx){
    //create a river in the north
    
    let wb2
    let seg=500
    let top=400
    let bottom=450
    let lineWidth=20
    for(let wb=0;wb<16;wb++){
      wb2=new WaterBody2(ctx,wb*seg,top,seg/2+wb*seg,bottom,lineWidth,"round")
      wb2.draw()
      wb2=new WaterBody2(ctx,seg/2+wb*seg,bottom,(wb+1)*seg,top,lineWidth,"round")
      wb2.draw()
    }

    //two rivers flowing into one in the south
    wb2=new WaterBody2(ctx,0,2000,2000,4000,lineWidth,"round")
    wb2.draw()
    wb2=new WaterBody2(ctx,4000,2000,2000,4000,lineWidth,"round")
    wb2.draw()

    wb2=new WaterBody2(ctx,1800,2000,2200,2000,600,"round")
    wb2.draw()

  }
}