class Train{
  //train has a name
  //train has a color
  //train has a speed
  constructor(id,ctx,bctx,name,color,length,type,segmentsArray){
    this.id=id
    this.color=color
    this.length=length //number of coaches
    this.segmentsArray = segmentsArray
    this.name=name
    this.ctx=ctx
    this.bctx=bctx
    //points is an array of objects. Each obj is 
    //{x:##,y:##,xDirection:t/f,negXDirection:t/f,negYDirection:t/f,overWater:t/f}
    this.points = this.getPointsNew(this.segmentsArray)
    this.type=type  //either passenger or freight
    this.speed=this.getSpeed(type,length) //speed will depend on whether it is passenger or freight and on length
    this.index=0
    this.prevStartX=0 
    this.prevXDirection
    this.prevStartY=0 
    this.prevYDirection
    this.drawTracks()
    return this
  }
  getSpeed(type,length){
    return type=='passenger'?length<=5?1:2:10
  }
  getPointsNew(segmentsArray){
    console.log(segmentsArray)
    let array=[]
    let arrayIndex=0
    let stepX=Game.GAME_WIDTH/Game.COLS
    let stepY=Game.GAME_HEIGHT/Game.ROWS
    
    //starting point
    // array[arrayIndex]={x:(segmentsArray.start.column)*stepX,y:(segmentsArray.start.row)*stepY}
    // lastRow=segmentsArray.start.row
    // lastColumn=segmentsArray.start.column
    let lastRow=segmentsArray[0].row
    let lastColumn=segmentsArray[0].column
    array[arrayIndex]={x:lastColumn*stepX,y:lastRow*stepY}

    for (let i=1;i<segmentsArray.length;i++) {
      let segment = segmentsArray[i]
      if(segment.row!=lastRow){
        let sign=segment.row>lastRow? 1:-1
        let numIterations=Math.abs(segment.row-lastRow)
        for(let i=0;i<numIterations;i++){
          lastRow=lastRow+sign
          array[++arrayIndex]={x:(lastColumn)*stepX,y:(lastRow)*stepY}  
        }
      }
      if(segment.column!=lastColumn){
        let sign=segment.column>lastColumn? 1:-1
        let numIterations=Math.abs(segment.column-lastColumn)
        for(let i=0;i<numIterations;i++){
          lastColumn=lastColumn+sign
          array[++arrayIndex]={x:(lastColumn)*stepX,y:(lastRow)*stepY}  
        }
      }
    }

    for(let i = 1;i<array.length-1;i++){
      //set the direction in which the coach has to be drawn at point on the segment
      array[i].xDirection = array[i].y==array[i+1].y
      array[i].negXDirection = array[i].x < array[i-1].x
      array[i].negYDirection = array[i].y < array[i-1].y
      //check if this point is over water
      let data=this.bctx.getImageData(array[i].x,array[i].y,1,1).data
      array[i].overWater = (data[2]!=0) 
      console.log(array[i].x,array[i].y,`overwater:${array[i].overWater}`)
    }
    array[array.length-1].xDirection=array[array.length-2].xDirection
    array[array.length-1].negXDirection=array[array.length-2].negXDirection
    array[array.length-1].negYDirection=array[array.length-2].negYDirection

    array[0].xDirection = array[1].xDirection
    array[0].negXDirection = array[1].negXDirection
    array[0].negYDirection = array[1].negYDirection

    // console.log(array)
    return array
  }
  
  draw(iteration){
      //speed is highest when one iteration results in 
      //one unit of movement in the train.
      const coachWidth=3
      const coachLength=2*Game.GAME_WIDTH/Game.COLS
      let length
      let width
      let startX
      let startY

      let speed=this.speed
      if(iteration%speed==0){
        this.index++
      }else{
        return
      }

      this.index = this.index % (this.points.length+this.length)
      if(this.index==0) this.prevStartX=0;this.prevStartY=0

      this.ctx.fillStyle=this.color
      this.ctx.strokeStyle='black'
      this.ctx.lineWidth=0.1

      //draw a coach/engine at this.index position
      if(this.index<this.points.length){
        //what direction is this coach travelling
        
        length  = (this.points[this.index].xDirection?coachLength:coachWidth) - 1
        width = (this.points[this.index].xDirection?coachWidth:coachLength) - 1

        if(this.index==0){
          startX=this.points[this.index].x-length/2
          startY=this.points[this.index].y-width/2
        }else{
          if(this.prevXDirection !=this.points[this.index].xDirection){
            if(!this.points[this.index].negXDirection){
              startX = Math.max(this.prevStartX,this.points[this.index].x-length/2)
            }else{
              startX = Math.min(this.prevStartX,this.points[this.index].x-length/2) 
            }
          }else{
            startX = this.points[this.index].x-length/2
          }

          if(this.prevYDirection ==this.points[this.index].xDirection){
            if(!this.points[this.index].negYDirection){
              startY = Math.max(this.prevStartY,this.points[this.index].y-width/2)
            }else{
              startY = Math.min(this.prevStartY,this.points[this.index].y-width/2) 
            }
          }else{
            startY = this.points[this.index].x-length/2
          }
        }
        // if(!this.points[this.index].negXDirection){
        //   startX = Math.max(this.prevStartX,this.points[this.index].x-length/2)
        // }else{
        //   startX = Math.min(this.prevStartX,this.points[this.index].x-length/2)
        // }
        // startY = this.points[this.index].y-width/2
        
        this.ctx.fillRect(startX,startY,length,width)

        this.prevStartX=startX
        this.prevXDirection = this.points[this.index].xDirection

        this.prevStartY=startY
        this.prevYDirection = !this.points[this.index].Direction
      }
      
      //remove/clear a coach at this.index-train.length position
      if(this.index-this.length>-1){
        //what direction is this coach travelling
        
        length  = (this.points[this.index-this.length].xDirection?coachLength:coachWidth)
        width =this.points[this.index-this.length].xDirection?coachWidth:coachLength

        startX = this.points[this.index-this.length].x-length/2
        startY = this.points[this.index-this.length].y-width/2

        this.ctx.clearRect(startX,startY,length,width)  
      }

      //draw a line from start towards the end
      //console.log(train.length, train.path, train.path.to.length)
      if(this.length && this.points.length>this.length){

        //draw as many lines as the train.length
      }
  }
  drawTracks(){
    this.bctx.save()
    
    for(let index=1;index<this.points.length;index++){
      this.bctx.beginPath()
      this.bctx.moveTo(this.points[index-1].x,this.points[index-1].y)
      //if the track goes over waterbody then the color is different
      if(this.points[index].overWater){
        this.bctx.strokeStyle='yellow'
        this.bctx.lineWidth = 4 
        this.bctx.setLineDash([2,2]);
      }else{
        this.bctx.strokeStyle='darkgray'
        this.bctx.lineWidth = 1 
        this.bctx.setLineDash([4,2]);
      }
      this.bctx.lineTo(this.points[index].x,this.points[index].y)
      // this.bctx.closePath()
      this.bctx.stroke()
      // this.bctx.moveTo(this.points[index].x,this.points[index].y)
    }
    this.bctx.restore()
  }
}