
(() => {

  document.addEventListener("DOMContentLoaded", () => {
    // const GAME_WIDTH=4000
    // const GAME_HEIGHT=4000
    // const ROWS=800
    // const COLS=800
    // const CELL_WIDTH =GAME_WIDTH/COLS
    // const CELL_HEIGHT = GAME_HEIGHT/ROWS
    let iteration=0
    let mouse = {}
    let pointToClear = {}
    let nextPoint = {}
    let ctx    /*context*/
    let bctx   /*background canvas context*/
    let trains /* trains object*/
    let animationFrame
    let pathStack=[]
    let buildingPath=false

    console.log('Hello from addEventListener')

    let canvas1 = document.getElementById("canvas1")
    ctx = canvas1.getContext('2d')

    let background = document.getElementById("background")
    bctx = background.getContext('2d')

    canvas1.height = Game.GAME_HEIGHT
    canvas1.width = Game.GAME_WIDTH
    background.height = Game.GAME_HEIGHT
    background.width = Game.GAME_WIDTH

    ctx.font = "bold 20px serif";
    
    trains=new Trains()
    let train
    train = new Train( 'Mumbai Express','blue',25,'passenger',
        [{row:1,column:1},
          {row:1,column:60},
          {row:10,column:60},
          {row:10,column:50}]
    )
    trains.add(train.id,train)

    train = new Train( 'Delhi Express','red',10,'freight',
      [{row:100,column:100},
          {row:100,column:90},
          {row:90,column:90},
          {row:90,column:100}]
    )
    trains.add(train.id,train)

    createGrid()

    startGame()


    //add listener for buttonTrainAdd
    document.getElementById("buttonTrainAdd").addEventListener('click',()=>{
      //start the process of creating a new train
      //show the hidden input elements
      document.getElementById("newTrain").style="display:grid"
      
    })

    document.getElementById("buttonTrainAddOk").addEventListener('click',clickedButtonTrainAddOK)
    
    // document.getElementById("buttonTrainAddOk").addEventListener('click',()=>{
    //   document.getElementById("buttonTrainAddOk").onclick=clickedButtonTrainAddOK
    // })

    document.addEventListener('keyup',(event)=>{
      console.log(event)
      if(event.code=='KeyT'){
        let el1 = document.getElementById("train")
        el1.style=`display:grid;top:${mouse.y}px;left:${mouse.x}px`
        let el2 = document.getElementById('buttonTrainRoute')
        el2.onclick=clickedButtonTrainRoute
      }
      if(event.code=='KeyX'){
        let el = document.getElementById("train")
        el.style="display:none"
      }
    })

    function clickedButtonTrainRoute(){
      buildingPath=true
    }
    
    function clickedButtonTrainAddOK(){
      //access the train add form and create a new train and add it to trains
      let trainName,trainColor,trainLength,trainType,trainSpeed
      let trainPath=[]
      let el
      trainName=document.getElementById('trainName').textContent
      //document. querySelector('input[type = radio]:checked'). value
      trainColor=document. querySelector( 'input[name = "trainColor"]:checked'). value
      // trainColor=document.getElementById('trainColor').textContent
      trainType=document. querySelector( 'input[name = "trainType"]:checked'). value
      trainLength=document.getElementById('trainLength').textContent
      //train speed depends on the Train type
      for(let i=0;i<pathStack.length;i++) trainPath.push(pathStack[i])
      let train = new Train(trainName,trainColor,trainLength,trainType,trainPath)
    }

    function clickedButtonTrainAddCancel(){
      buildingPath=false
      pathStack=[]
    }

    document.addEventListener('mousemove',(event)=>{
      mouse={x:event.pageX,y:event.pageY}
      if(buildingPath){
        let startPoint = pathStack[pathStack.length-1]
        drawGuide(startPoint)
      }
    })

    document.addEventListener('click',(event)=>{
      if(event.ctrlKey && buildingPath){
        //convert event.pageX to column number based on number of columns
        // pathStack.push({column:Math.floor(event.pageX/Game.CELL_WIDTH),row:Math.floor(event.pageY/Game.CELL_HEIGHT)})
        if(pathStack.length==0){
          pathStack.push({column:Math.floor(mouse.x/Game.CELL_WIDTH),row:Math.floor(mouse.y/Game.CELL_HEIGHT)})
          
        }else{
          pathStack.push({column:Math.floor(nextPoint.x/Game.CELL_WIDTH),
                          row:Math.floor(nextPoint.y/Game.CELL_HEIGHT),
                          x:Math.floor(nextPoint.x/Game.CELL_WIDTH)*Game.CELL_WIDTH,
                          y:Math.floor(nextPoint.y/Game.CELL_HEIGHT)*Game.CELL_HEIGHT})

        }

        // if(pathStack.length==0){

        //   pathStack.push({x:event.pageX,y:event.pageY})
        // }else{
        //   pathStack.push({x:nextPoint.x,y:nextPoint.y})  
        // }

        console.log(pathStack)
        displayPath()
      }
    })

    function displayPath(){
      const DOT=8
      ctx.beginPath()
      ctx.fillStyle="red"
      ctx.strokeStyle="red"
      ctx.moveTo(pathStack[0].x,pathStack[0].y)
      ctx.fillRect(pathStack[0].x-DOT/2,pathStack[0].y-DOT/2,DOT,DOT)
      for(i=1;i<pathStack.length;i++){
        ctx.fillRect(pathStack[i].x-DOT/2,pathStack[i].y-DOT/2,DOT,DOT)
        ctx.lineTo(pathStack[i].x,pathStack[i].y)
      }  
      ctx.stroke()
      ctx.closePath()
    }

    function drawGuide(startPoint){
      const DOT = 4

      if(startPoint) {
        startPoint.x = startPoint.column*Game.CELL_WIDTH
        startPoint.y = startPoint.row*Game.CELL_HEIGHT

        //draw x line
        ctx.moveTo(startPoint.x,startPoint.y)
        console.log(`moving to ${startPoint.x},${startPoint.y}`)
        console.log(`mouse location ${mouse.x},${mouse.x}`)
        
        let a =Math.abs(mouse.x-startPoint.x)
        let b=Math.abs(mouse.y-startPoint.y)
        
        if (pointToClear.x){
          ctx.clearRect(pointToClear.x-DOT/2,pointToClear.y-DOT/2,DOT,DOT)
        }
        
        ctx.beginPath()
        ctx.fillStyle='red'
        
        //we need to check if the user is trying to reverse the track in the direction of the
        //previous point. For instance if users previous 2 points are 
        //{x:100;y:100} and {x:300,y:100} then if he is trying to move again on the x axis
        //towards {x:100,y:100}, he should not be allowed to do so. Similarly on the y axis
        let movingBackxDirection= false
        let movingBackyDirection= false
        let movedInxDirection
        let movedInyDirection
        let psl=pathStack.length
        if(psl>1){
          movedInxDirection = pathStack[psl-1].y==pathStack[psl-2].y
          if(movedInxDirection){
            movingBackxDirection = pathStack[psl-2].x<pathStack[psl-1].x?mouse.x<pathStack[psl-1].x:mouse.x>pathStack[psl-1].x
          }else{ 
            //moved in y direction 
            movingBackyDirection = pathStack[psl-2].y<pathStack[psl-1].y?mouse.y<pathStack[psl-1].y:mouse.y>pathStack[psl-1].y
          }
        }
        
        if(a>b && !movingBackxDirection){
          ctx.fillRect(mouse.x-DOT/2,startPoint.y-DOT/2,DOT,DOT)
          ctx.fill()
          ctx.closePath()
          pointToClear = {x:mouse.x,y:startPoint.y}
          nextPoint = {x:mouse.x,y:startPoint.y}
          
        }else if (b>=a && !movingBackyDirection){
          ctx.fillRect(startPoint.x-DOT/2,mouse.y-DOT/2,DOT,DOT)
          ctx.fill()
          ctx.closePath()
          pointToClear = {x:startPoint.x,y:mouse.y}
          nextPoint  = {x:startPoint.x,y:mouse.y}
        }
        
        ctx.closePath()
        ctx.stroke()
      }
    }
      
    function startGame(){
      //test
      console.log(trains.list())


      //test
      let points
      let entries = trains.entries()
      for(let t=0;t<entries.length;t++){
        let trainId = entries[t][0]
        let train = entries[t][1]
        points = train.points
        drawPoints(points)
        console.log(points)
      }
      // for(let train=0;trains.entries();train++){
      //   let trainId = trains[train][0]
      //   let train = trains[train][1]
      //   points = train.points
      //   drawPoints(trains[train].points)
      //   console.log(trains[train].points)
      // }
      drawGame()
      // animationFrame = requestAnimationFrame(drawGame)
    }


    function drawPoints(points){
      ctx.save()
      ctx.strokeStyle='brown'
      ctx.lineWidth = 1 
      ctx.setLineDash([2,2]);
      
      ctx.beginPath()
      ctx.moveTo(points[0].x,points[0].y)
      for(let index=1;index<points.length;index++){
        ctx.lineTo(points[index].x,points[index].y)
      }
      ctx.stroke()
      ctx.closePath()
    }
    function displayIteration(iteration){
      ctx.clearRect(Game.GAME_WIDTH-50,0,100,40)
      ctx.fillText(iteration,Game.GAME_WIDTH-50,20)
    }
    function drawGame(){
      iteration++
      displayIteration(iteration)
      if(trains){
        trains.draw(ctx,iteration)
      }
      requestAnimationFrame(drawGame)
    }
    function drawTrain(train,iteration){
      //speed is highest when one iteration results in 
      //one unit of movement in the train.
      const coachWidth=5
      const coachLength=Game.GAME_WIDTH/Game.COLS
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

      index = index % (train.points.length+train.length)
      
      
      //draw a coach/engine at index position
      if(index<train.points.length){
        //what direction is this coach travelling
        
        length  = (train.points[index].xDirection?coachLength:coachWidth) - 1
        width = (train.points[index].xDirection?coachWidth:coachLength) - 1

        // startX = train.points[index].negXDirection? train.points[index].x-length : train.points[index].x
        // startY = train.points[index].negYDirection? train.points[index].y-width : train.points[index].y
        startX = train.points[index].x-length/2
        startY = train.points[index].y-width/2
        
        ctx.fillStyle=train.color
        ctx.fillRect(startX,startY,length,width)
        // ctx.strokeStyle='black'
        // ctx.lineWidth="2"
        // ctx.rect(startX,startY,length,width )
      }
      
      //remove/clear a coach at index-train.length position
      if(index-train.length>-1){
        //what direction is this coach travelling
        
        length  = (train.points[index-train.length].xDirection?coachLength:coachWidth)
        width =train.points[index-train.length].xDirection?coachWidth:coachLength

        // startX = train.points[index-train.length].negXDirection? train.points[index-train.length].x-length : train.points[index-train.length].x
        // startY = train.points[index-train.length].negYDirection? train.points[index-train.length].y-width : train.points[index-train.length].y
        startX = train.points[index-train.length].x-length/2
        startY = train.points[index-train.length].y-width/2

        ctx.clearRect(startX,startY,length,width)  
      }

      //draw a line from start towards the end
      //console.log(train.length, train.path, train.path.to.length)
      if(train.length && train.points.length>train.length){

        //draw as many lines as the train.length
      }
    }

    function createGrid(){
      
      bctx.save()
      bctx.lineWidth=0.5;
      
      bctx.beginPath();
      
      
      for(let x=0;x<=Game.COLS;x++){
        let startX = x*Game.GAME_WIDTH/Game.COLS
        bctx.moveTo(startX,0)
        bctx.lineTo(startX,Game.GAME_HEIGHT)
      }
      for(let y=0;y<=Game.ROWS;y++){
        let startY = y*Game.GAME_HEIGHT/Game.ROWS
        bctx.moveTo(0,startY)
        bctx.lineTo(Game.GAME_WIDTH,startY)
      }

      
      bctx.stroke()
      bctx.restore()
    }

    

    
    
  });
})()