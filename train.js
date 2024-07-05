class Train{
  //train has a name
  //train has a color
  //train has a speed
  constructor(name,color,length,type,segmentsArray){
    this.id="T" + Math.random().toString(16).slice(2)
    this.color=color
    this.length=length //number of coaches
    this.segmentsArray = segmentsArray
    this.name=name
    this.points = this.getPointsNew(segmentsArray)
    this.type=type  //either passenger or freight
    this.speed=this.getSpeed(type,length) //speed will depend on whether it is passenger or freight and on length
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
  getPoints(path){
    console.log(path)
    let array=[]
    let arrayIndex=0
    let lastRow
    let lastColumn
    let stepX=Game.GAME_WIDTH/Game.COLS
    let stepY=Game.GAME_HEIGHT/Game.ROWS
    // let stepX=this.game.GAME_WIDTH/this.game.COLS
    // let stepY=this.game.GAME_HEIGHT/this.game.ROWS
    //starting point
    array[arrayIndex]={x:(path.start.column)*stepX,y:(path.start.row)*stepY}
    lastRow=path.start.row
    lastColumn=path.start.column
    for (const segment of path.to) {
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
  draw(ctx,iteration){
      //speed is highest when one iteration results in 
      //one unit of movement in the train.
      const coachWidth=5
      const coachLength=Game.GAME_WIDTH/Game.COLS
      let index
      let length
      let width
      let startX
      let startY

      let speed=this.speed
      if(iteration%speed==0){
        index=iteration/speed
      }else{
        return
      }

      index = index % (this.points.length+this.length)
      
      
      //draw a coach/engine at index position
      if(index<this.points.length){
        //what direction is this coach travelling
        
        length  = (this.points[index].xDirection?coachLength:coachWidth) - 1
        width = (this.points[index].xDirection?coachWidth:coachLength) - 1

        startX = this.points[index].x-length/2
        startY = this.points[index].y-width/2
        
        ctx.fillStyle=train.color
        ctx.fillRect(startX,startY,length,width)
      }
      
      //remove/clear a coach at index-train.length position
      if(index-this.length>-1){
        //what direction is this coach travelling
        
        length  = (this.points[index-this.length].xDirection?coachLength:coachWidth)
        width =this.points[index-this.length].xDirection?coachWidth:coachLength

        startX = this.points[index-this.length].x-length/2
        startY = this.points[index-this.length].y-width/2

        ctx.clearRect(startX,startY,length,width)  
      }

      //draw a line from start towards the end
      //console.log(train.length, train.path, train.path.to.length)
      if(this.length && this.points.length>this.length){

        //draw as many lines as the train.length
      }
  }
}