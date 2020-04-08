// https://kylemcdonald.github.io/cv-examples/
const FlowCalculator = require("./flow"); //name is whatever name you exported
const Graph = require("./Graph"); // this is the real-time graph that anlayzes motions
const p5 = require("p5");
const Particle = require("./particle");
const Membrane = require("./membrane");

var capture;
var previousPixels;
var flow;
var w = 640,
    h = 480;
var step = 8;
let particles = [];
let pt1,pt2,pt3;
let pts=[];
var uMotionGraph, vMotionGraph;

const p5flow = (p) => {


    p.setup = () => {
        p.createCanvas(w, h);
        capture = p.createCapture({
            audio: false,
            video: {
                width: w,
                height: h
            }
        }, function() {
            console.log('capture ready.')
        });
        capture.elt.setAttribute('playsinline', '');
        //hide the DOM video element that p5 inserts, otherwise there're always two windows
        capture.hide();
        flow = new FlowCalculator(step); //this is the flow.js
        uMotionGraph = new Graph(100, -step / 2, +step / 2);
        vMotionGraph = new Graph(100, -step / 2, +step / 2);

        for (let i=0;i<20;i++){
            pt = p.createVector(Math.random()*p.width, Math.random()*p.height);
            pts.push(pt);
        }
        mem = new Membrane(pts);
    }

    function copyImage(src, dst){
        var n = src.length;
        if (!dst || dst.length != n) dst = new src.constructor(n);
        while (n--) dst[n] = src[n];
        return dst;
    }

    function same(a1, a2, stride, n){
        for (var i = 0; i < n; i += stride) {
            if (a1[i] != a2[i]) {
                return false;
            }
        }
        return true;
    }

    p.draw = () => {
        const width = p.width;
        const height = p.height;
        capture.loadPixels();
        if (capture.pixels.length > 0) {
            if (previousPixels) {

                // cheap way to ignore duplicate frames
                if (same(previousPixels, capture.pixels, 4, width)) {
                    return;
                }

                flow.calculate(previousPixels, capture.pixels, capture.width, capture.height);
            }
            previousPixels = copyImage(capture.pixels, previousPixels);
            p.image(capture, 0, 0, w, h);
            mem.draw(p);
            if (flow.flow && flow.flow.u != 0 && flow.flow.v != 0) {
                uMotionGraph.addSample(flow.flow.u);
                vMotionGraph.addSample(flow.flow.v);

                p.strokeWeight(2);
                flow.flow.zones.forEach(function(zone) {
                    p.stroke(p.map(zone.u, -step, +step, 0, 255),
                    p.map(zone.v, -step, +step, 0, 255), 128);
                    //p.line(zone.x, zone.y, zone.x + zone.u, zone.y + zone.v);
                    if(Math.random()>0.9){mem.draw(p);}
                    

                    const speed = Math.sqrt(zone.u * zone.u + zone.v * zone.v);
                    if (speed > 20) {
                        particles.push(new Particle(zone.x,zone.y,zone.u,zone.v));
                        mem.add(p.createVector(zone.x,zone.y),p);
                        mem.update(zone.x,p.width,p);
                        //console.log(mem.vertices.length);
                       //mem.draw(p);
                        
                    }
                    
                })
            }
            
            //draw, update, clear offscreen
          
           
            
          
        }
    }

    

}

const myp5 = new p5(p5flow,"main");

