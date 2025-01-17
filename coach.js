class Coach {
  constructor(ctx, x, y, radian, color) {
    this.width = Game.coachWidth
    this.length = Game.coachLength
    this.x = x
    this.y = y
    this.radian = radian
    this.ctx = ctx
    this.color = color
    this.draw()
  }
  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.fillStyle = this.color
    this.ctx.strokeStyle = 'black'
    this.ctx.lineWidth = 0.1

    // this.ctx.translate(this.x, this.y + (this.radian == 0 ? -this.width / 2 : this.width / 2))
    this.ctx.translate(this.x - this.width*Math.cos(this.radian+Math.PI/2)/2, this.y - this.width*Math.sin(this.radian+Math.PI/2)/2)
    this.ctx.rotate(this.radian)
    this.ctx.fillRect(0, 0, this.length, this.width)
    this.ctx.strokeRect(0, 0, this.length, this.width)
    this.ctx.closePath()
    this.ctx.restore()
  }
}