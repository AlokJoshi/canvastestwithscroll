class Industry{
  constructor(ctx,x,y,size,material){
    this.ctx=ctx
    this.x=x
    this.y=y
    this.size=size
    this.material=material
  }
  draw(){
    
    const numDoors=2
    const baseWidth=40
    const baseHeight=15
    const baseDoorWidth=6
    const baseDoorHeight=8
    const baseChimneyHeight=12
    const baseChimneyWidth=4
    const factor=this.size=='small'?0.75:this.size=='medium'?1:1.25
    const w = baseWidth*factor
    const h = baseHeight*factor
    const bdh = baseDoorHeight*factor
    const bdw = baseDoorWidth*factor
    const bch = baseChimneyHeight*factor
    const bcw = baseChimneyWidth*factor

    const distBetweenDoors=(w-2*bdw)/(numDoors+1)

    this.ctx.lineWidth=2
    this.ctx.strokeStyle='black'
    this.ctx.fillStyle=this.material=='red'?'red':this.material=='blue'?'blue':'green';
    
    this.ctx.beginPath()
    // this.ctx.moveTo(this.x-w/2,this.y-h/2)
    this.ctx.fillRect( this.x,this.y,w,h)
    this.ctx.strokeRect(this.x,this.y,w,h)
    for(let d=0;d<numDoors;d++){
      //drawDoors
      this.ctx.strokeStyle='yellow'
      this.ctx.strokeRect(this.x+(d+1)*distBetweenDoors+d*bdw,this.y+(h-bdh),bdw,bdh)
    }
    //drawChimney
    this.ctx.fillStyle='black'
    this.ctx.fillRect(this.x+w-bcw,this.y-bch,bcw,bch)

    this.ctx.restore()
  }
}