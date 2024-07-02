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
  trains(){
    return this.trains.values()
  }
  list(){
    console.log(this.trains)
  }
}