class Game {
  static GAME_WIDTH = 4000
  static GAME_HEIGHT = 4000
  static ROWS = 800
  static COLS = 800
  static CELL_WIDTH = Game.GAME_WIDTH / Game.COLS
  static CELL_HEIGHT = Game.GAME_HEIGHT / Game.ROWS
  static TRACK_COST_PER_UNIT = 10000
  static PASSENGER_COACH_COST = 2000
  static FREIGHT_CAR_COST = 1000
  static getUniqueTrainId(){
    return `T${Math.random().toString(16).slice(2)}`
  }
}