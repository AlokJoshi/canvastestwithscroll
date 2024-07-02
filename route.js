class Route{
  constructor(name,path){
    //route is an array of x,y points
    //each route has a unique id: routeId
    this.id="R" + Math.random().toString().slice(2)
    this.name=name
    this.path=path
  }
}