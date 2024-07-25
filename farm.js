class Farm{
  constructor(ctx,x1,y1,x2,y2,size){
    this.ctx=ctx
    this.x1=x1
    this.y1=y1
    this.x2=x2
    this.y2=y2
    this.size=size
  }
  draw(){
    this.ctx.save()
    this.ctx.strokeStyle="green"
    this.ctx.lineCap="round"
    this.ctx.lineWidth=this.size=='small'?50:this.size=='medium'?100:200
    this.ctx.beginPath()
    // console.log(this.x1,this.y1,this.x2,this.y2)
    this.ctx.moveTo(this.x1,this.y1)
    this.ctx.lineTo(this.x2,this.y2)
    this.ctx.stroke()
    this.ctx.restore()
  }
}