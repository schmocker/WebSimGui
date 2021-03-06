class Box {
    constructor(WebSimGui, id, model_obj) {
        this.WebSimGui = WebSimGui;
        this.id = id;

        this.connections_from = Array();
        this.connections_to = Array();



        var this_box = this
        this.div = d3.select("#working_field").append('div')
            .html('<div class="name">'+model_obj.name+'</div>')
            .classed("box", true)
            .call(d3.drag()
                .on("start", function() {this_box.on_dragstart(d3.event)})
                .on("drag", function() {this_box.on_drag(d3.event)})
                .on("end", function() {this_box.on_dragend(d3.event)}))
            .on("mouseover", function() {this_box.on_hover(d3.event)})
            .on("dblclick ", function() {this_box.on_dbclick(d3.event)});

        this.input = new Rail(this, 'in', 'left', model_obj.inputs);
        this.output = new Rail(this, 'out', 'right', model_obj.outputs);

        this.updatePosition(model_obj.posX,model_obj.posY);

    }

    get position() {
        var abs_pos = this.div.node().getBoundingClientRect();

        var pos = {};
        pos["width"] = abs_pos["width"];
        pos["height"] = abs_pos["height"];

        pos["left"] = parseFloat(this.div.style("left"));
        pos["x1"] = pos["left"];
        pos["right"] = pos["left"] + pos["width"];
        pos["x2"] = pos["right"];

        pos["top"] = parseFloat(this.div.style("top"));
        pos["y1"] = pos["top"];
        pos["bottom"] = pos["top"] + pos["height"];
        pos["y2"] = pos["bottom"];

        pos["x_center"] = pos["x1"] + pos["width"] / 2;
        pos["y_center"] = pos["y1"] + pos["height"] / 2;
        return pos
    }

    on_dbclick() {
        alert("Settings not yet implemented");
    }

    on_hover() {
        $(".box").css("z-index", "0");
        $(this).css("z-index", "1");
    }
    on_dragstart(evt) {
        this.div.classed("box_drag", true);
    }
    on_drag(evt) {
        this.div.classed("box_drag", true);
        var x = parseFloat(this.div.style("left")) + evt.dx;
        var y = parseFloat(this.div.style("top")) + evt.dy;
        this.updatePosition(x,y);
    }

    on_dragend(evt) {
        this.updatePosition();
        this.div.classed("box_drag", false);
        let data = {
            'box': this.id,
            'position': this.position
        };
        $.post('/', {
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: 'POST'
        }, function (data) {
            console.log(data);
        });
    }

    updatePosition(x,y){
        //eigene Position
        this.div.style("left", x + "px");
        this.div.style("top", y + "px");
        //Position der Verbindungen
        for (let i in this.connections_from) {
            this.connections_from[i].updatePosition();
        }
        for (let i in this.connections_to) {
            this.connections_to[i].updatePosition();
        }
        this.input.updatePosition();
        this.output.updatePosition();
    }


}