class Train{
  //train has a name
  //train has a color
  //train has a speed
  constructor(name,color,speed,length,path){
    this.id="T" & Math.random().toString(16).slice(2)
    this.color=color
    this.speed=speed
    this.length=length //number of coaches
    this.path = path
    this.name=name
    this.points = this.getPoints(path)
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
}