
(() => {

  document.addEventListener("DOMContentLoaded", () => {
    let iteration=0
    let mouse = {}
    let pointToClear = {}
    let nextPoint = {}
    let ctx    /*context*/
    let bctx   /*background canvas context*/
    let gctx   /*guide canvas context*/
    let trains /* trains object*/
    let pathStack=[]
    let buildingPath=false
    let forest_el
    let mountain_el

    let canvas1 = document.getElementById("canvas1")
    ctx = canvas1.getContext('2d')

    let background = document.getElementById("background")
    bctx = background.getContext('2d')

    let guide = document.getElementById("guide")
    gctx = guide.getContext('2d')

    canvas1.height = Game.GAME_HEIGHT
    canvas1.width = Game.GAME_WIDTH
    background.height = Game.GAME_HEIGHT
    background.width = Game.GAME_WIDTH
    guide.height = Game.GAME_HEIGHT
    guide.width = Game.GAME_WIDTH

    ctx.font = "bold 20px serif";
    

    

    startGame()


    //add listener for buttonTrainAdd
    document.getElementById("buttonTrainAdd").addEventListener('click',()=>{
      //start the process of creating a new train
      //show the hidden input elements
      document.getElementById("newTrain").style="display:grid"
      
    })

    document.getElementById("buttonTrainAddOk").addEventListener('click',clickedButtonTrainAddOK)
    document.getElementById("buttonTrainAddCancel").addEventListener('click',clickedButtonTrainAddCancel)

    document.addEventListener('keyup',(event)=>{
      console.log(event)
      if(event.code=='KeyT'){
        let el1 = document.getElementById("train")
        el1.style=`display:grid;top:${mouse.y}px;left:${mouse.x}px`
        let el2 = document.getElementById('buttonTrainRoute')
        el2.onclick=clickedButtonTrainRoute
      }
      if(event.code=='KeyF'){
        let el1 = document.getElementById("finances")
        el1.style=el1.style.display=='none'?`display:grid;`:`display:none;`
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
      let trainName,trainColor,trainLength,trainType
      let trainPath=[]
      let el
      trainName=document.getElementById('trainName').value
      //document. querySelector('input[type = radio]:checked'). value
      trainColor=document. querySelector( 'input[name = "trainColor"]:checked').value
      // trainColor=document.getElementById('trainColor').textContent
      trainType=document. querySelector( 'input[name = "trainType"]:checked').value
      trainLength=document.getElementById('trainLength').value*1
      //train speed depends on the Train type
      for(let i=0;i<pathStack.length;i++) trainPath.push(pathStack[i])
      let train = new Train(Game.getUniqueTrainId(),ctx,bctx,trainName,trainColor,trainLength,trainType,trainPath)
      trains.add(train.id,train)
      buildingPath=false
      pathStack=[]
      document.getElementById('train').style="display:none"
      gctx.clearRect(0,0,Game.GAME_WIDTH,Game.GAME_HEIGHT)
    }
    
    function clickedButtonTrainAddCancel(){
      buildingPath=false
      pathStack=[]
      document.getElementById('train').style="display:none"
      gctx.clearRect(0,0,Game.GAME_WIDTH,Game.GAME_HEIGHT)
    }
    
    document.addEventListener('mousemove',(event)=>{
      mouse={x:event.pageX,y:event.pageY}
      if(buildingPath){
        let startPoint = pathStack[pathStack.length-1]
        drawGuide(gctx,startPoint)
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

        console.log(pathStack)
        displayPath(gctx)
      }
    })

    function displayPath(ctx){
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

    function drawGuide(ctx,startPoint){
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

      forest_el = document.getElementById('forest')
      forest_el.addEventListener('load',()=>{

        let forest = new Forest(bctx,2000,1000,100,1500,Math.PI/2,0,Math.PI*2,forest_el)
        forest.draw()
  
        forest = new Forest(bctx,2000,1200,300,750,Math.PI/2,0,Math.PI*2,forest_el)
        forest.draw()
        
        forest = new Forest(bctx,1000,2500,300,750,3*Math.PI/4,0,Math.PI*2,forest_el)
        forest.draw()

        forest = new Forest(bctx,3000,2500,300,750,Math.PI/4,0,Math.PI*2,forest_el)
        forest.draw()

      })
      forest_el.setAttribute('src',"forest.jpeg")

      mountain_el = document.getElementById('mountain')
      mountain_el.addEventListener('load',()=>{

        let mountain = new Forest(bctx,2000,1200,150,500,Math.PI/2,0,Math.PI*2,mountain_el)
        mountain.draw()
  
        mountain = new Forest(bctx,1000,2500,50,650,3*Math.PI/4,0,Math.PI*2,mountain_el)
        mountain.draw()
        
        mountain = new Forest(bctx,3000,2500,250,650,Math.PI/4,0,Math.PI*2,mountain_el)
        mountain.draw()

        // mountain = new Forest(bctx,3000,2500,300,750,Math.PI/4,0,Math.PI*2,mountain_el)
        // mountain.draw()

      })
      mountain_el.setAttribute('src',"mountain.jpeg")


      // let fs=bctx.createPattern()
      let farms = new Farms(bctx)

      let wb = new WaterBodies2(ctx)

      trains=new Trains()
      let train
      train = new Train2( Game.getUniqueTrainId(),ctx,bctx,'Mumbai Express','blue',25,'passenger',
          [ {x:160*5,y:50*5},
            {x:150*5,y:50*5},
            {x:140*5,y:50*5},
            {x:100*5,y:50*5},
            {x:100*5,y:150*5},
            {x:150*5,y:150*5},
            // {x:150*5,y:60*5},
            // {x:30*5,y:60*5},
            // {x:30*5,y:10*5},
            // {x:160*5,y:10*5},
            // {x:160*5,y:160*5},
            // {x:100*5,y:160*5},
          ]
      )
      // train = new Train( Game.getUniqueTrainId(),ctx,bctx,'Mumbai Express','blue',25,'passenger',
      //     [{row:100,column:1},
      //       {row:100,column:10},
      //       {row:120,column:10},
      //       {row:120,column:20},
      //       {row:100,column:20},
      //       {row:100,column:5}
      //     ]
      // )
      trains.add(train.id,train)

      //this creates icons for industries
      let industries=new Industries(bctx)

      // train = new Train(Game.getUniqueTrainId(),ctx,bctx, 'Delhi Express','red',10,'freight',
      //   [{row:100,column:100},
      //       {row:100,column:90},
      //       {row:90,column:90},
      //       {row:90,column:100}]
      // )
      // trains.add(train.id,train)

    createGrid(bctx)
      drawGame()
      // animationFrame = requestAnimationFrame(drawGame)
    }

    function displayIteration(bctx,iteration){
      bctx.clearRect(Game.GAME_WIDTH-50,0,100,40)
      bctx.fillText(iteration,Game.GAME_WIDTH-50,20)
    }

    function drawGame(){
      iteration++
      ctx.clearRect(0,0,Game.GAME_WIDTH,Game.GAME_HEIGHT)
      displayIteration(bctx,iteration)
      if(trains){
        trains.draw(iteration)
        requestAnimationFrame(drawGame)
      }
    }

    function createGrid(bctx){
      
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