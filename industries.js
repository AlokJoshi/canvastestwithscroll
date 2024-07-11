class Industries{
  constructor(ctx){
    let ind

    //Industry in the north
    ind=new Industry(ctx,200,200,'small','red')
    ind.draw()
    ind=new Industry(ctx,300,300,'medium','green')
    ind.draw()
    ind=new Industry(ctx,400,400,'large','blue')
    ind.draw()
    
  }
}