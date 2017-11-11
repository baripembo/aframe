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

    
    var r = window.innerHeight,
      format = d3.format(",d"),
      fill = d3.scale.category20b();

    var bubble = d3.layout.pack()
      .sort(null)
      .size([r, r]);

    // var vis = d3.select("body").append("svg")
    //   .attr("width", window.innerWidth)
    //   .attr("height", r)
    //   .attr("class", "bubble");

    d3.json("data/all-mobs.json", function(json) {
      console.log('data loaded');
      var data = classes(json);
      
      //sort by ascending tag count in all mobs
      var popular_tags = data.children.slice(0);
      popular_tags.sort(function(a,b) {return (a.value > b.value)});
      
      //var max = d3.max(data.children, function(d, i) {  return d.value; });
      
      //find mob with most tags
      var tag_count=0;
      var popular_mob;
      for (var i=0;i<json.length;i++) {
        var tags = d3.keys(json[i].tags);
        if (tags.length>tag_count) {
          popular_mob = json[i].title;
          tag_count = tags.length;
        }
      }
      
      var header = vis.append("text")
        .text(json.length+ " mobs, " + format(data.children.length) + " tags")
        .attr("class","header")
        .attr("x",740)
        .attr("y",60);
      
      var most_popular_tag = popular_tags[popular_tags.length-1];
      var subhead = vis.append("g")
        .attr("class","subhead")
        .attr("transform", "translate(740,90)");
        
      subhead.append("text")
        .text("Most used tag: " + most_popular_tag.className + " used " + most_popular_tag.value + " times in " + most_popular_tag.packageName + " mob")
          .attr("x",0)
          .attr("y",0)
          
      subhead.append("text")
        .text("Mob with most tags: " + popular_mob + " with "+tag_count+" tags")
        .attr("dx",0)
        .attr("dy",25);
    
        
        
        
      var dur = d3.scale.linear().domain([0,data.children.length]).range([1000,800]);
      
      json.reverse();
      
      var node = vis.selectAll("g.node")
        .data(bubble.nodes(data)
        .filter(function(d) { return !d.children; }))
        .enter().append("g")
          .attr("class", "node")
          .attr("fill-opacity", 0)
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

      node.append("title")
        .text(function(d) { return d.packageName + ", " + d.className + ": " + format(d.value); });

      node.append("circle")
          .attr("r", function(d) { return d.r; })
          .style("fill", function(d) { return fill(d.packageName); });

      node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

      vis.selectAll("g.node")
        .transition()
        .duration(0)//function(d,i) { return dur(i); }
        .delay(function(d, i) { return i * 4; })
        .attr("fill-opacity", 1)
        //.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    });

    function classes(root) {
      var classes = [];
      var count = [];
      for (var i=0;i<root.length;i++) {
        for ( key in root[i].tags ) {
          classes.push({packageName:root[i].title, className:root[i].tags[key].name, value:Number(root[i].tags[key].count)});
          count.push(Number(root[i].tags[key].count));
        }
      }
      return {children: classes, tagcount:count};
    }
    
    
    
})(window.d3)
