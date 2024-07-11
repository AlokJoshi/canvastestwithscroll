class Mountain{
  constructor(ctx,x,y,radiusX,radiusY,rotation,startAngle,endAngle,image_el){
    this.ctx=ctx
    this.x=x
    this.y=y
    this.radiusX=radiusX
    this.radiusY=radiusY
    this.rotation=rotation
    this.startAngle=startAngle
    this.endAngle=endAngle
    this.image_el=image_el
  }  
  draw(){
    let pattern = this.ctx.createPattern(this.image_el, "");
    this.ctx.save()
    this.ctx.strokeStyle=pattern
    this.ctx.fillStyle=pattern
    this.ctx.beginPath()
    this.ctx.moveTo(this.x,this.y)
    this.ctx.ellipse(this.x,this.y,this.radiusX,this.radiusY,this.rotation,this.startAngle,this.endAngle)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.restore();
  }
}
