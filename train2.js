class Train2 {
  constructor(id, ctx, bctx, name, color, length, type, segmentsArray) {
    this.id = id
    this.color = color
    this.length = length //number of coaches
    this.segmentsArray = segmentsArray
    this.name = name
    this.ctx = ctx
    this.bctx = bctx
    //segments array looks like this:
    // [{y:100,x:1},
    //   {y:100,x:10},
    //   {y:120,x:10},
    //   {y:120,x:20},
    //   {y:100,x:20},
    // ]
    //smoothedSegmentsArray is an array of objects. Each obj is 
    //{x:##,y:##,radian:##,distance:##}
    //radian is the angle clockwise in canvas at object index i considering object index i+1 
    //distance is the distance from origin. Hence for object at i==0, distance is 0
    this.points = this.getSmoothedSegmentsArray(this.segmentsArray)
    this.type = type  //either passenger or freight
    this.speed = this.getSpeed(type, length) //speed will depend on whether it is passenger or freight and on length
    this.index = 0
    this.prevXDirection
    this.prevYDirection
    this.drawTracks()
    return this
  }
  getSpeed(type, length) {
    return type == 'passenger' ? length <= 5 ? 1 : 2 : 10
  }
  getSmoothedSegmentsArray(segmentsArray) {
    //Array to return
    //local segments array
    let lSA = [...segmentsArray]
    let sA = []
    let sAFinal = []
    let radius = 100
    let numdivisions = 10

    //convert to x and y 
    for (let i = 0; i < segmentsArray.length; i++) {
      sA.push({ x: lSA[i].x, y: lSA[i].y, curve: false })
      console.log(`Orinal x: ${lSA[i].x}, Original y: ${lSA[i].y},curve:${false}`)
    }

    //from now on deal with sA and push into sAFinal
    let done = false
    let i = 0
    let next, next2next
    let curr = sA[i]
    while (!done) {
      next = sA[i + 1]
      next2next = sA[i + 2]
      //if curr,next and next2next are in the same x or the same y then
      //we can add both curr and next
      if ((curr.x == next.x && next.x == next2next.x) || (curr.y == next.y && next.y == next2next.y)) {
        if (curr.x == next.x && next.x == next2next.x) {
          curr.radian = next.y > curr.y ? 3*Math.PI / 2 : Math.PI / 2


          next.radian = next2next.y > next.y ? 3*Math.PI / 2 : Math.PI / 2


          sAFinal.push(curr)
          sAFinal.push(next)
          curr = next2next
          i += 2
        } else if (curr.y == next.y && next.y == next2next.y) {
          curr.radian = next.x > curr.x ? 0 : Math.PI


          next.radian = next2next.x > next.x ? 0 : Math.PI

          sAFinal.push(curr)
          sAFinal.push(next)
          curr = next2next
          i += 2
        }
      } else {
        if (curr.x == next.x) {

          curr.radian = next.y > curr.y ?  3 * Math.PI / 2 : Math.PI / 2 
          //push the curr node into the sAFinal
          sAFinal.push(curr)

          // console.log(`Curr added after changing only the tan ${Object.entries(curr)}`)

          if (next.x != next2next.x) {
            // console.log(`next.x != next2next.x`)
            //we need to take some action here
            //we need to add a new object in segment array between
            //curr and next and another object between next and next2nex
            let new1 = {
              x: next.x, y: next.y + (next.y < curr.y ? radius : -radius),
              centerx: next.x, centery: next.y, radius, radian: curr.radian, curve: false
            }

            console.log(`adding new1: ${Object.entries(new1)}`)
            sAFinal.push(new1)

            //add additional segments
            addAdditionalSegments(true, curr, next, next2next, radius, numdivisions)

            let new2 = {
              x: next.x + (next2next.x < next.x ? -radius : radius), y: next.y,
              centerx: next.x, centery: next.y, radius, curve: false
            }
            // console.log(`adding new2: ${Object.entries(new2)}`)

            // sAFinal.push(new2)
            curr = new2
          }
          // console.log(`deleting ${Object.entries(next)} after adding 2 nodes`)
        } else if (curr.y == next.y) {

          curr.radian = next.x > curr.x ? 0 : Math.PI

          //push the curr node into the sAFinal
          sAFinal.push(curr)
          // console.log(`Curr added after changing only the tan ${Object.entries(curr)}`)

          if (next.y != next2next.y) {
            // console.log(`next.y != next2next.y`)
            //we need to take some action here
            //we need to add a new object in segment array between
            //curr and next and another object between next and next2nex
            let new1 = {
              x: next.x + (curr.x < next.x ? -radius : radius), y: next.y,
              centerx: next.x, centery: next.y, radius: radius, radian: curr.radian, curve: false
            }

            console.log(`adding new1: ${Object.entries(new1)}`)
            sAFinal.push(new1)

            //add additional segments
            addAdditionalSegments(false, curr, next, next2next, radius, numdivisions)

            let new2 = {
              x: next.x, y: next.y + (next2next.y < next.y ? -radius : radius),
              centerx: next.x, centery: next.y, radius: radius, curve: false
            }
            // sAFinal.push(new2)

            // console.log(`adding new2: ${Object.entries(new2)}`)

            curr = new2
          }
          console.log(`deleting ${Object.entries(next)} after adding 2 nodes`)
        } else {
          console.log(`Error in specification`)
          exit
        }
        i++
      }
      done = i + 2 > segmentsArray.length - 1
      //last to last point is new2
      if (done && curr) {
        curr.radian = curr.x == next.x ? (next.y > curr.y ?  3 * Math.PI / 2 :Math.PI / 2) : next.x > curr.x ? 0 : Math.PI
        sAFinal.push(curr)
      }
    }
    //now we add the last point
    console.log(`Last point ${Object.entries(sA[sA.length - 1])}`)
    sAFinal.push((sA[sA.length - 1]))

    //now we have to identify those segments that have to be split further
    function addAdditionalSegments(samex, curr, next, next2next, radius, numdivisions) {
      //samex is true if curr.x == next.x and false if curr.y==next.y
      //we find the centerx and centery
      let xDirection = 0, yDirection = 0
      let centerx = 0, centery = 0
      let clockwise, startRadian, endRadian

      if (samex) {
        xDirection = next2next.x - next.x > 0 ? xDirection = 1 : xDirection = -1
        yDirection = next.y - curr.y > 0 ? yDirection = 1 : yDirection = -1
        centerx = next.x + xDirection * radius
        centery = next.y - yDirection * radius
        clockwise = xDirection * yDirection != 1
        // startRadian = xDirection == 1 ? Math.PI : Math.PI * 2
        // startRadian = curr.radian
      } else {
        //that is curr and next have the same y
        xDirection = next.x - curr.x > 0 ? xDirection = 1 : xDirection = -1
        yDirection = next2next.y - next.y > 0 ? yDirection = 1 : yDirection = -1
        centerx = next.x - xDirection * radius
        centery = next.y + yDirection * radius
        clockwise = xDirection * yDirection == 1
        // startRadian = yDirection == 1 ? 3 * Math.PI / 2 : Math.PI / 2
        // startRadian = curr.radian
      }
      startRadian = curr.radian + (clockwise ? Math.PI / 2 : -Math.PI / 2)
      endRadian = startRadian + (clockwise ? -Math.PI / 2 : Math.PI / 2)

      console.log(`centerx:${centerx}, centery:${centery}, 
        clockwise:${clockwise}, startRadian:${startRadian}, endRadian:${endRadian}`)
      // =============================================================

      let theta = (endRadian - startRadian) / numdivisions
      //quarter circle circumference is Math.PI*radius/2 divided again by numdivisions
      // const d = Math.PI * radius / (2 * numdivisions)
      for (let i = 0; i < numdivisions; i++) {
        //turn i+1 times theta
        //note that the radian of the final line is Math.PI/2 more!!
        const radian = startRadian + (i + 1) * theta
        const x = centerx + radius * Math.cos(radian)
        const y = centery - radius * Math.sin(radian)
        // const radian = startRadian + (i + 1) * theta
        // const x = centerx + radius * Math.cos(radian)
        // const y = centery + radius * Math.sin(radian)
        sAFinal.push({
          x, y, radian: curr.radian - (i+1)*theta, curve: true
        })
        // console.log(`radian:${radian}, x:${x}, y:${y}, radian:${radian}`)
      }
    }

    //calculate the distance between each point and do a cumDistance
    let cumDistance = 0
    sAFinal[0].cumDistance = cumDistance
    let prevx = sAFinal[0].x
    let prevy = sAFinal[0].y
    for (let i = 1; i < sAFinal.length; i++) {
      const nextx = sAFinal[i].x
      const nexty = sAFinal[i].y
      cumDistance += Math.hypot(nextx - prevx, nexty - prevy)
      sAFinal[i].cumDistance = cumDistance
      prevx = nextx
      prevy = nexty
    }

    //display the final result 
    console.log("sAFinal after updating the cumDistance")
    sAFinal.forEach((element, index) => {
      console.log(`${index},x:${element.x},y:${element.y},radian:${element.radian},cumDistance:${element.cumDistance},curve:${element.curve}`)
    });

    //now we convert sAFinal into an array where the difference between any 2 indexes of the array
    //is one pixel
    let uArray = []
    let prevD = sAFinal[0].cumDistance
    let px = sAFinal[0].x
    let py = sAFinal[0].y
    let radian = sAFinal[0].radian
    let elNumber = 0
    let curve = sAFinal[0].curve
    for (let i = 1; i < sAFinal.length; i++) {
      const nextD = sAFinal[i].cumDistance
      const nx = sAFinal[i].x
      const ny = sAFinal[i].y
      const q1 = (nextD - prevD) / Math.floor(nextD - prevD)
      const q2 = (nextD - prevD) / (Math.floor(nextD - prevD) + 1)
      const denominator = q1 < q2 ? Math.floor(nextD - prevD) : (Math.floor(nextD - prevD) + 1)
      radian = sAFinal[i].radian
      curve = sAFinal[i].curve
      for (let j = 0; j < denominator; j++) {
        uArray.push({
          elNumber,
          x: Math.round((px + j * (nx - px) / denominator) * 100) / 100,
          y: Math.round((py + j * (ny - py) / denominator) * 100) / 100,
          radian,
          curve
        })
        elNumber++
      }
      prevD = nextD
      px = nx
      py = ny
    }

    return uArray
  }
  draw(iteration) {
    //speed is highest when one iteration results in 
    //one unit of movement in the train.

    let speed = this.speed
    if (iteration % speed == 0) {
      this.index++
    } else {
      return
    }

    //the location at which the first coach is
    this.index = this.index % (this.points.length + this.length * (Game.coachLength+1))
    // this.index = this.index % (this.points.length + this.length)

    for(let co=0;co<this.length;co++){
      //draw a coach/engine at this.index position
      // if (this.index-co*(Game.coachLength+1)>=0 && this.index+co*(Game.coachLength+1) < this.points.length) {
        // let index = this.index-co*(Game.coachLength+1)
      const index = this.index-co*(Game.coachLength+1)
      if (index>=0 && index < this.points.length) {
        //this creates a new coach and draws it as well
        let coach = new Coach(this.ctx,this.points[index].x, this.points[index].y,this.points[index].radian,
          this.color)       
        
      }else if (index>=this.points.length){
        debugger
      }
    }

  }
  drawTracks() {
    this.bctx.save()

    for (let index = 1; index < this.points.length; index++) {
      this.bctx.beginPath()
      this.bctx.moveTo(this.points[index - 1].x, this.points[index - 1].y)
      //if the track goes over waterbody then the color is different
      if (this.points[index].overWater) {
        this.bctx.strokeStyle = 'yellow'
        this.bctx.lineWidth = 4
        // this.bctx.setLineDash([2,2]);
      } else {
        this.bctx.strokeStyle = 'darkgray'
        this.bctx.lineWidth = 1
        // this.bctx.setLineDash([4,2]);
      }
      this.bctx.lineTo(this.points[index].x, this.points[index].y)
      // this.bctx.closePath()
      this.bctx.stroke()
      // this.bctx.moveTo(this.points[index].x,this.points[index].y)
    }
    this.bctx.restore()
  }
}