;(function (d3) {
  function update () {
    var data = d3.range(5).map(function (d, i) {
      return {v: Math.random()}
    })

    console.log('update')

    // adding an entity as holder for each box
    var entities = d3.select('a-scene')
      .selectAll('a-entity')
      .data(data)

    var newobj = entities.enter()
      .append('a-entity')
      .attr('rotation', function (d, i) {
        var a = 360 / data.length
        return '0 ' + 20* i + ' 0'
      })

    // appending a box within each entity
    newobj.append('a-sphere')
      .attr('color', '#80cdc1')
      .attr('radius', function (d, i) {
        return d.v
      })
      .attr('depth', 0)
      .attr('position', function (d, i) {
        return '0 1 -5'
      })

    // update height of each box
    entities.select('a-sphere')
      .attr('radius', function (d, i) {
        return d.v
      })

    newobj.append('a-text')
      .attr('value', function (d) {
        return parseInt(d.v * 10)
      })
      .attr('color', 'black')
      .attr('position', function (d) {
        return '-0.1 2 -2'
      })
      .attr('visible', false)

    entities.on('mouseenter', function () {
      d3.select(this)
        .select('a-text')
        .attr('visible', true)

      d3.select(this)
        .select('a-sphere')
        .attr('color', '#018571')
    })

    entities.on('mouseleave', function () {
      d3.select(this)
        .select('a-text')
        .attr('visible', false)

      d3.select(this)
        .select('a-sphere')
        .attr('color', '#80cdc1')
    })
  }

  //setInterval(update, 5000)
  setTimeout(function() { update() }, 500)

  update()
})(window.d3)
