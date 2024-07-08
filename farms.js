class Farms{
  constructor(ctx){
    this.ctx=ctx
  }
  draw(){
    //10 farms in the north y between 500 and 900
    this.ctx.save()
    this.ctx.strokeStyle="green"
    this.ctx.lineCap="round"
    this.ctx.lineWidth=100
    for(let f=0;f<20;f++){
      this.ctx.beginPath()
      this.ctx.moveTo(200+f*200,500)
      this.ctx.lineTo(300+f*200,900)
      this.ctx.stroke()
    }












    this.ctx.restore()

  }
}