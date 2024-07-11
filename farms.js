class Farms{
  constructor(ctx){
    // farms along the river in the north
    // code for the river is as follows:
    // let wb2
    // let seg=500
    // let top=300
    // let bottom=450
    // let lineWidth=20
    // for(let wb=0;wb<100;wb++){
      //   wb2=new WaterBody2(ctx,wb*seg,top,seg/2+wb*seg,bottom,lineWidth,"round")
      //   wb2.draw()
      //   wb2=new WaterBody2(ctx,seg/2+wb*seg,bottom,(wb+1)*seg,top,lineWidth,"round")
      //   wb2.draw()
      // }
    let farm
    let top = 200
    let bottom = 350
    let halfWave = 500 //originall called seg
    for(let f=0;f<8;f++){
      farm = new Farm(ctx,f*halfWave,top,halfWave/2+f*halfWave,bottom,'large')
      farm.draw()
      farm = new Farm(ctx,halfWave/2+f*halfWave,bottom,(f+1)*halfWave,top,'large')
      farm.draw()
    }
    top = 450
    bottom = 550
    for(let f=0;f<8;f++){
      farm = new Farm(ctx,f*halfWave,top,halfWave/2+f*halfWave,bottom,'medium')
      farm.draw()
      farm = new Farm(ctx,halfWave/2+f*halfWave,bottom,(f+1)*halfWave,top,'medium')
      farm.draw()
    }
    // draw some farms to the south of the river
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

    //one big farm area in the middle
    this.ctx.save()
    this.ctx.strokeStyle="green"
    this.ctx.lineCap="round"
    this.ctx.lineWidth=200
    
      this.ctx.beginPath()
      this.ctx.moveTo(0,1800)
      this.ctx.lineTo(2000,3800)
      this.ctx.moveTo(2000,3800)
      this.ctx.lineTo(4000,1800)
      this.ctx.stroke()












    this.ctx.restore()

  }
}