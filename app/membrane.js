module.exports = class Membrane{
	constructor(pts){
		this.vertices = pts;
		this.t = 0;
	
	}

	add(pt,p){
		//this.vertices.splice(Math.floor(Math.random()*this.vertices.length), 1)
		//this.vertices.pop();
		let maxdist=0;
		var discard;
		let mindist = Infinity;
		var closest;
		for(let i=0;i<this.vertices.length;i++){
			let curr = this.vertices[i];
			if(p.dist(curr.x,curr.y,pt.x,pt.y)>maxdist){
				discard = i;
				maxdist = p.dist(curr.x,curr.y,pt.x,pt.y);
			}
			if(p.dist(curr.x,curr.y,pt.x,pt.y)<mindist){
				closest=curr;
				mindist = p.dist(curr.x,curr.y,pt.x,pt.y);
			}
		}
		//console.log(discard);
		this.vertices.splice(discard,1);
		
		//this.vertices.push(pt);
		this.vertices.push(p.createVector((pt.x+closest.x)/2,(pt.y+closest.y)/2));
			
	}

	update(x,width,p){
		this.t = p.map(x,0,width,-5,5);
		//this.t = -2;
	}

	

	draw(p){
		
		

		p.push();
		p.strokeWeight(2);
		
		//p.noFill();
		if(this.vertices.length>=3){
			//let midx = this.vertices.sum((a,b)=>a.x+b.x)/this.vertices.length;
			//let midy = this.vertices.sum((a,b)=>a.x+b.x)/this.vertices.length;
			this.vertices.sort((a,b)=>a.x-b.x);
			p.smooth();
			p.stroke(0, 0, 0);
			p.curveTightness(this.t/2);
			p.fill(39,61,87,2);
			p.beginShape();
	
			//p.beginContour();

			// p.vertex(this.vertices[0].x,this.vertices[0].y);
			// for(let i=1;i<this.vertices.length-1;i+=2){
			// 	let first = this.vertices[i];
			// 	let second = this.vertices[i+1];
			// 	p.quadraticVertex(first.x,first.y,second.x,second.y);
			// }
			for(let i =0; i < this.vertices.length;i++){
				let curr = this.vertices[i];
				p.curveVertex(curr.x,curr.y);
			}
			p.endShape();
			
			p.fill(87,39,63,2);
			p.strokeWeight(1);
			p.stroke(255, 255, 255);
			this.vertices.sort((a,b)=>a.y-b.y);
			p.beginShape();
			for(let i =0; i < this.vertices.length;i++){
				let curr = this.vertices[i];
				p.curveVertex(curr.x,curr.y);
			}
			p.endShape();


		

		}
		p.pop();
	
	}



}