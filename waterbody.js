class WaterBody{
  constructor(ctx,infoArray){
    this.infoArray=infoArray
    this.ctx=ctx
  }
  draw(){
    this.ctx.save()
    this.ctx.fillStyle="blue"
    this.ctx.beginPath();
    for(let i=0;i<this.infoArray.length;i++){
      let r=this.infoArray[i].radians
      let tr_x=this.infoArray[i].translate.x
      let tr_y=this.infoArray[i].translate.y
      let rx=this.infoArray[i].rectangle.x
      let ry=this.infoArray[i].rectangle.y
      let rw=this.infoArray[i].rectangle.width
      let rh=this.infoArray[i].rectangle.height
      this.ctx.translate(tr_x-(r<0?20:0),tr_y)
      // this.ctx.moveTo(rx,ry);
      this.ctx.rotate(r)
      this.ctx.fillRect(rx,ry,rw,rh);
    }
    this.ctx.closePath()

    this.ctx.restore()
  }
}