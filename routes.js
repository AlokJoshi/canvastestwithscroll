class Routes{
  constructor(){
    this.routes={}  
  }
  add(routeId,route){
    this.routes[routeId]=route
    // console.log(this.routes)
  }
  delete(routeId){
    delete this.routes[routeId]
    // console.log(this.routes)
  }
  list(){
    console.log(this.routes)
  }
}