var modal;
var btn;
var span;
var websimgui

window.onload = function() {
    websimgui = new WebSimGui();


    modal = document.getElementById('myModal');
    btn = document.getElementById("myBtn");
    span = document.getElementsByClassName("close")[0];
    btn.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }





    websimgui.addBox('box_1');
    websimgui.addBox('box_2');
    websimgui.addBox('box_3');
    websimgui.boxes[2].input.addPort("gugus1");
    websimgui.boxes[2].input.addPort("gugus2");
    websimgui.boxes[2].input.addPort("gugus3");
    websimgui.boxes[1].input.addPort("gugus1");
    websimgui.boxes[1].input.addPort("gugus2");
    websimgui.boxes[0].input.addPort("gugus0");
    websimgui.addConnection(websimgui.boxes[0],websimgui.boxes[1]);
    websimgui.addConnection(websimgui.boxes[0],websimgui.boxes[2]);
}



class WebSimGui {
    constructor(){

        this.svgContainer = d3.select("#working_field").append("svg")
            .attr("width", "100%")
            .attr("height", "100%");
        this.boxes = Array();
        this.connections = Array();
    }

    addBox(name){
        this.boxes.push(new Box(name,'working_field'));
    }

    addConnection(box1, box2){
        this.connections.push(new Connection(box1,box2,this.svgContainer));
    }
}


class Connection {
    constructor(fromBox, toBox, svg) {
        this.fromBox = fromBox;
        this.toBox = toBox;

        this.fromBox.connections_from.push(this);
        this.toBox.connections_to.push(this);

        this.id = this.fromBox.id + '_TO_' + this.toBox.id;



        this.line = svg.append("line")
            .style("stroke", "black")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", 0);

        this.arrow = svg.append("polygon")
            .style("cursor", "pointer")
            .attr("points", "0,0 0,0 0,0")
    }

    updatePosition() {
        this.updateLine();
        this.updateArrow();
    }
    updateLine() {
        this.line.attr("x1", this.fromBox.position["x_center"]);
        this.line.attr("y1", this.fromBox.position["y_center"]);
        this.line.attr("x2", this.toBox.position["x_center"]);
        this.line.attr("y2", this.toBox.position["y_center"]);
    }
    updateArrow() {
        var vec = [this.line.attr("x2") - this.line.attr("x1"), this.line.attr("y2") - this.line.attr("y1")];
        var length = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));

        var norm = [vec[0] / length, vec[1] / length];


        var len = 20;
        var arrow_Tail = [(Number(this.line.attr("x1")) + Number(this.line.attr("x2"))) / 2 - len / 2 * norm[0], (Number(this.line.attr("y1")) + Number(this.line.attr("y2"))) / 2 - len / 2 * norm[1]];

        var arrow_Point = [arrow_Tail[0] + len * norm[0], arrow_Tail[1] + len * norm[1]];
        var arrow_Left = [arrow_Tail[0] - len / 2 * norm[1], arrow_Tail[1] + len / 2 * norm[0]];
        var arrow_Right = [arrow_Tail[0] + len / 2 * norm[1], arrow_Tail[1] - len / 2 * norm[0]];
        var attr = "" + arrow_Point[0] + "," + arrow_Point[1] +
            " " + arrow_Left[0] + "," + arrow_Left[1] +
            " " + arrow_Right[0] + "," + arrow_Right[1];
        this.arrow.attr("points", attr);
    }
}


class Box {
    constructor(id, workfield_id) {
        this.id = id;
        //$('#'+workfield_id).append('<div class="box" id='+this.id+'>'+this.id+'</div>');

        this.connections_from = Array();
        this.connections_to = Array();



        var this_box = this
        this.div = d3.select("#working_field").append('div')
            .html('<div class="name">'+this.id+'</div>')
            .classed("box", true)
            .call(d3.drag()
                .on("start", function() {this_box.on_dragstart(d3.event)})
                .on("drag", function() {this_box.on_drag(d3.event)})
                .on("end", function() {this_box.on_dragend(d3.event)}))
            .on("mouseover", function() {this_box.on_hover(d3.event)})
            .on("dblclick ", function() {this_box.on_dbclick(d3.event)});


        this.input = new Input(this)

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
        var data = {
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
        for (var i in this.connections_from) {
            this.connections_from[i].updatePosition();
        }
        for (var i in this.connections_to) {
            this.connections_to[i].updatePosition();
        }
        this.input.updatePosition();
    }


}


class Input {
    constructor(box){
        this.box = box;
        this.ports = [];
    }

    updatePosition(){
        var x = this.box.position["left"];
        if (this.ports.length==1) {
            var y = this.box.position["y_center"];
        } else {
            var y = this.box.position["top"];
        }

        for (var i = 0; i < this.ports.length; i++) {
            this.ports[i].updatePosition(x,y);
            y += this.box.position["height"]/(this.ports.length-1);
        }

    }
    addPort(Name){
        this.ports.push( new Port(this));
    }

}

class Port{
    constructor(portSide) {
        this.portSide = portSide;
        this.pos = [0,0];

        this.size = 10;
        var thisPort = this;
        this.port = websimgui.svgContainer.append("polyline")
            .attr("fill", "black")
            //.attr("stroke-width", "0")
            .attr("points", "0,0")
            .style("cursor", "crosshair")
            .on("mousedown", function(){thisPort.connecting(d3.event)});
        //.on("mouseover", function(){d3.select(this).attr("fill", "blue")})
        //.on("mouseout", function(){d3.select(this).attr("fill", "black")});
    }

    connecting(evt){


        var line = websimgui.svgContainer.append("line")
            .style("stroke", "black")
            .style("stroke-dasharray", "5,5")
            .attr("x1", this.pos[0])
            .attr("y1", this.pos[1])
            .attr("x2", this.pos[0])
            .attr("y2", this.pos[1]);

        d3.selectAll("polyline").on("mouseover", function(){
            d3.select(this).on("mouseleave", function(){
                line.style("stroke-dasharray", "5,5");
                d3.select(this).on("mouseleave",null);
            });
            line.style("stroke-dasharray", "none");
        });

        var w = d3.select(window)
            .on("mousemove", mousemove)
            .on("mouseup", mouseup);

        d3.event.preventDefault();

        function mousemove() {
            var pos = d3.mouse(websimgui.svgContainer.node());
            line.attr("x2", pos[0]);
            line.attr("y2", pos[1]);
        }

        function mouseup() {
            line.remove();
            w.on("mousemove", null).on("mouseup", null);
        }

    }

    updatePosition(x,y){
        this.pos = [x,y];
        console.log("hallo");
        var form = [-this.size,this.size/1.5,0,0,-this.size,-this.size/1.5];
        var point = "X1,Y1 X2,Y2 X3,Y3"
            .replace("X1",form[0]+x)
            .replace("Y1",form[1]+y)
            .replace("X2",form[2]+x)
            .replace("Y2",form[3]+y)
            .replace("X3",form[4]+x)
            .replace("Y3",form[5]+y);

        this.port.attr("points", point);
    }
}


function validateForm() {
    var boxName = document.forms["addBoxForm"]["boxName"].value;
    if (boxName == "") {
        alert("Box Name must be filled out");
        return false;
    }
    modal.style.display = "none";
    websimgui.addBox(boxName);
}