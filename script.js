(() => {

  document.addEventListener("DOMContentLoaded", () => {
    const GAME_WIDTH=4000
    const GAME_HEIGHT=4000
    const ROWS=800
    const COLS=800
    const CELL_WIDTH =GAME_WIDTH/COLS
    const CELL_HEIGHT = GAME_HEIGHT/ROWS
    const LONG_DISTANCE_MISSILES =10
    const SHORT_DISTANCE_MISSILES =10
    let iteration=0
    let mouse = {}
    let pointToClear = {}
    let nextPoint = {}
    let ctx    /*context*/
    let trains /*an array of trains*/
    let animationFrame
    let pathStack=[]
    let buildingPath=false

    document.addEventListener('mousemove',(event)=>{
      mouse={x:event.clientX,y:event.clientY}
      if(buildingPath){
        let startPoint = pathStack[pathStack.length-1]
        drawGuide(startPoint)
      }
    })

    document.addEventListener('click',(event)=>{
      if(event.ctrlKey){
        if(pathStack.length==0){

          pathStack.push({x:event.clientX,y:event.clientY})
        }else{
          pathStack.push({x:nextPoint.x,y:nextPoint.y})  
        }

        console.log(pathStack)
        displayPath()
        buildingPath=true
      }
    })

    function displayPath(){
      ctx.beginPath()
      ctx.fillStyle="black"
      ctx.strokeStyle="black"
      ctx.moveTo(pathStack[0].x,pathStack[0].y)
      ctx.fillRect(pathStack[0].x,pathStack[0].y,4,4)
      for(i=1;i<pathStack.length;i++){
        ctx.fillRect(pathStack[i].x,pathStack[i].y,4,4)
        ctx.lineTo(pathStack[i].x,pathStack[i].y)
      }  
      ctx.stroke()
      ctx.closePath()
    }
    function drawGuide(startPoint){
      //draw x line
      ctx.moveTo(startPoint.x,startPoint.y)
      console.log(`moving to ${startPoint.x},${startPoint.y}`)
      console.log(`mouse location ${mouse.x},${mouse.y}`)
      
      let a =Math.abs(mouse.x-startPoint.x)
      let b=Math.abs(mouse.y-startPoint.y)

      if (pointToClear){
        // ctx.beginPath()
        ctx.clearRect(pointToClear.x,pointToClear.y,2,2)
        // ctx.closePath()
      }
      ctx.beginPath()
      ctx.fillStyle='red'
      if(a>b){
        //draw a horizontal line
        ctx.fillRect(mouse.x,startPoint.y,2,2)
        ctx.fill()
        ctx.closePath()
        pointToClear = {x:mouse.x,y:startPoint.y}
        nextPoint = {x:mouse.x,y:startPoint.y}
        
      }else{
        //draw a vertical line
        ctx.fillRect(startPoint.x,mouse.y,2,2)
        ctx.fill()
        ctx.closePath()
        pointToClear = {x:startPoint.x,y:mouse.y}
        nextPoint  = {x:startPoint.x,y:mouse.y}
      }
      ctx.closePath()
      ctx.stroke()
    }

    function startGame(){
      let segments
      for(let train=0;train<trains.length;train++){
        segments = getSegments(trains[train])
        trains[train].segments=segments
        drawSegments(trains[train].segments)
        console.log(trains[train].segments)
      }
      animationFrame = requestAnimationFrame(drawGame)
    }
    function drawSegments(segments){
      ctx.save()
      ctx.strokeStyle='brown'
      ctx.lineWidth = 1 
      ctx.setLineDash([2,2]);
      
      ctx.beginPath()
      ctx.moveTo(segments[0].x,segments[0].y)
      for(let index=1;index<segments.length;index++){
        ctx.lineTo(segments[index].x,segments[index].y)
      }
      ctx.stroke()
      ctx.closePath()
    }
    function displayIteration(iteration){
      ctx.clearRect(GAME_WIDTH-50,0,100,40)
      ctx.fillText(iteration,GAME_WIDTH-50,20)
    }
    function drawGame(){
      iteration++
      displayIteration(iteration)
      if(trains){
        drawTrains(iteration)
      }
      requestAnimationFrame(drawGame)
    }
    function drawTrains(iteration){
      for(let train=0;train<trains.length;train++){
        drawTrain(trains[train],iteration)
      }
    }
    function drawTrain(train,iteration){
      //speed is highest when one iteration results in 
      //one unit of movement in the train.
      const coachWidth=5
      const coachLength=GAME_WIDTH/COLS
      let length
      let width
      let startX
      let startY

      let speed=train.speed
      if(iteration%speed==0){
        index=iteration/speed
      }else{
        return
      }

      index = index % (train.segments.length+train.length)
      
      
      //draw a coach/engine at index position
      if(index<train.segments.length){
        //what direction is this coach travelling
        
        length  = (train.segments[index].xDirection?coachLength:coachWidth) - 1
        width = (train.segments[index].xDirection?coachWidth:coachLength) - 1

        // startX = train.segments[index].negXDirection? train.segments[index].x-length : train.segments[index].x
        // startY = train.segments[index].negYDirection? train.segments[index].y-width : train.segments[index].y
        startX = train.segments[index].x-length/2
        startY = train.segments[index].y-width/2
        
        ctx.fillStyle=train.color
        ctx.fillRect(startX,startY,length,width)
        // ctx.strokeStyle='black'
        // ctx.lineWidth="2"
        // ctx.rect(startX,startY,length,width )
      }
      
      //remove/clear a coach at index-train.length position
      if(index-train.length>-1){
        //what direction is this coach travelling
        
        length  = (train.segments[index-train.length].xDirection?coachLength:coachWidth)
        width =train.segments[index-train.length].xDirection?coachWidth:coachLength

        // startX = train.segments[index-train.length].negXDirection? train.segments[index-train.length].x-length : train.segments[index-train.length].x
        // startY = train.segments[index-train.length].negYDirection? train.segments[index-train.length].y-width : train.segments[index-train.length].y
        startX = train.segments[index-train.length].x-length/2
        startY = train.segments[index-train.length].y-width/2

        ctx.clearRect(startX,startY,length,width)  
      }

      //draw a line from start towards the end
      //console.log(train.length, train.path, train.path.to.length)
      if(train.length && train.segments.length>train.length){

        //draw as many lines as the train.length
      }
    }

    function createLongDistanceMissiles(){
      //each missile is a separate object with its own
      //canvas
      for(let m=0;m<LONG_DISTANCE_MISSILES;m++){
        let canvas=document.createElement('canvas')
        canvas.id=`LDM${m+1}`
        canvas.width=CELL_WIDTH*2
        canvas.height=CELL_HEIGHT*3
        canvas.backgroundColor='blue'
        let ctx = canvas.getContext('2d')
        ctx.fillText(`LDM${m+1}`,20,20)
        document.getElementById('assets').appendChild(canvas)
      }
    }
    function createShortDistanceMissiles(){

    }
    function bombCell(row,col){
      //draw a red circle in that cell
      //rows and cols are 0 based
      let centerX = CELL_HEIGHT*(row+0.5) 
      let centerY = CELL_WIDTH*(col+0.5)
      let radius = CELL_WIDTH<CELL_HEIGHT?CELL_WIDTH/2-2:CELL_HEIGHT/2-2
      ctx.beginPath()
      ctx.fillStyle='red'
      ctx.arc(centerX,centerY,radius,0,2*Math.PI)
      ctx.fill()
      ctx.closePath()

      //remove effect of bomb
      setTimeout(()=>{
        //clearBomb 
        ctx.beginPath()
      ctx.fillStyle='rgb(255,200,200)'
      ctx.arc(centerX,centerY,radius,0,2*Math.PI)
      ctx.fill()
      ctx.closePath()
      },Math.random()*1000)
    }
    function randomlyBomb(num){
      for(let i=0;i<num;i++){
        bombCell(Math.floor(Math.random()*ROWS),Math.floor(Math.random()*COLS))
      }
    }
    function createGrid(){
      ctx.save()
      ctx.lineWidth=0.5;
      
      ctx.beginPath();
      
      
      for(let x=0;x<=COLS;x++){
        let startX = x*GAME_WIDTH/COLS
        ctx.moveTo(startX,0)
        ctx.lineTo(startX,GAME_HEIGHT)
      }
      for(let y=0;y<=ROWS;y++){
        let startY = y*GAME_HEIGHT/ROWS
        ctx.moveTo(0,startY)
        ctx.lineTo(GAME_WIDTH,startY)
      }

      
      ctx.stroke()
      ctx.restore()
    }

    console.log('Hello')

    let canvas1 = document.getElementById("canvas1")
    ctx = canvas1.getContext('2d')

    canvas1.height = GAME_HEIGHT
    canvas1.width = GAME_WIDTH

    ctx.font = "bold 20px serif";
    
    // createGrid (ctx)
    randomlyBomb(100)
    createLongDistanceMissiles()
    //bombCell(10,10)
    trains = [
      {name:'Mumbai Express',
        length:15,
        speed:25,
        color:'blue',
        path: {
          start:{row:1,column:1},
          to:[{row:1,column:60},{row:10,column:60},{row:10,column:50}]
        }
      },
      {name:'Delhi Express',
        length:5,
        speed:10,
        color:'red',
        path: {
          start:{row:100,column:100},
          to:[{row:100,column:90},{row:90,column:90},{row:90,column:100}]
        }
      }
    ]
    function getSegments(train){
      console.log(train)
      let array=[]
      let arrayIndex=0
      let lastRow
      let lastColumn
      let stepX=GAME_WIDTH/COLS
      let stepY=GAME_HEIGHT/ROWS
      //starting point
      array[arrayIndex]={x:(train.path.start.column)*stepX,y:(train.path.start.row)*stepY}
      lastRow=train.path.start.row
      lastColumn=train.path.start.column
      for (const segment of train.path.to) {
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

      console.log(array)
      return array
    }
    startGame()
  });
})()