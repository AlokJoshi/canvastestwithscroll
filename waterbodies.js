class WaterBodies{
  constructor(){
    this.waterbodies=[]
  }
  add(waterbody){
    this.waterbodies.push(waterbody)
  }
  draw(){
    for(let wb=0;wb<this.waterbodies.length;wb++){
      this.waterbodies[wb].draw()
    }
  }
}