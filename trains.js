class Trains{
  constructor(){
    this.trains={}  
  }
  add(trainId,train){
    this.trains[trainId]=train
  }
  delete(trainId){
    delete this.trains[trainId]
  }
  list(){
    return Object.values(this.trains)
  }
  entries(){
    return Object.entries(this.trains)
  }
  draw(ctx,iteration){
    let entries = this.entries()
    for(let e=0;e<entries.length;e++){
      entries[e][1].draw(ctx,iteration)
    }
  }
}