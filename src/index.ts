import * as p5 from 'p5';

const myP5 = (sketch) => {
       // swaps two numbers in the array
       const swap = (arr: Array<number>, index1: number, index2: number): void => {
        if (index1 < 0 || index1 >= arr.length ||
            index2 < 0 || index2 >= arr.length)
            throw "Index out of range";
        let temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
        return;
    }

    // partition function in quicksort
    const partition = (arr: Array<number>, low: number, high: number, pivot: number): number => {
        let left = low;
        let right = high - 1;
        while (left <= right) {
            while(arr[left] < pivot) {
                left++;
            }
            while(arr[right] >= pivot) {
                right--;
            }
            if (left >= right)
                break
            if (arr[left] >= pivot && arr[right] < pivot) {
                swap(arr, left, right);
                left++;
                right--;
            }
        }
        swap(arr, left, high);
        return left;
    }

    let arr: Array<number> = [];
    let partitions: Array<Array<number>> = [];
    let canvas: p5.Graphics;
    let graphicsDimension: {x: number, y: number};
    let numRects; // width of container / rectSize
    let rectSize = 10;

    // draw a rectangle for every number in the array
    const visualize = (arr: Array<number>): void => {
        let rectWidth = graphicsDimension.x/numRects;
        for (let i = 0; i < arr.length; i++) {
            canvas.rect(i*rectWidth, sketch.height, rectWidth, -arr[i], 0, 0, 5, 5);
        }
        return;
    }

    // accepts main canvas width, height
    const setupSecondCanvas = (width, height) => {
      // setup a separate canvas for the visualization
      graphicsDimension = {x: Math.ceil(width / 2), y: height};
      canvas = sketch.createGraphics(graphicsDimension.x, graphicsDimension.y);
      canvas.background("#373737");
      canvas.noStroke();

      // generate random numbers
      numRects = graphicsDimension.x / rectSize;
      for (let i = 0; i < numRects; i++) {
          arr.push(sketch.random(height));
      }
      partitions.push([0, arr.length-1]);
    }

    let radio;
    sketch.setup = () => {
        document.body.style.overflow = "hidden"; // get rid of scrollbars
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight); // setup main canvas

        setupSecondCanvas(sketch.width, sketch.height);

        // create basic UI
        radio = sketch.createRadio();
        radio.option(10, '10fps');
        radio.option(30, '30fps');
        radio.option(60, '60fps');
        radio.selected('60');
        radio.position(20, 20);
        const button = sketch.createButton('Reset');
        button.position(20, 50);
        button.mousePressed(onClick);
    }

    // reset the canvas and rerun the algorithm
    const onClick = () => {
      canvas.remove();
      arr = [];
      partitions = [];
      setupSecondCanvas(sketch.windowWidth, sketch.windowHeight);

      sketch.frameRate(parseInt(radio.value()));

      sketch.loop();
      sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    }

    sketch.draw = () => {
        sketch.background("#373737");

        // one partition per frame
        let low = partitions[0][0];
        let high = partitions[0][1];
        let newPivot = partition(arr, low, high, arr[high]);
        if (low < newPivot - 1)
            partitions.push([low, newPivot - 1]);
        if (newPivot + 1 < high)
            partitions.push([newPivot + 1, high]);
        partitions.shift();

        // visualize the partitions
        visualize(arr);
        sketch.image(canvas, 0, 0);

        // make it symmetric
        sketch.push();
        sketch.scale(-1, 1);
        sketch.translate(-sketch.width, 0);
        sketch.image(canvas, 0, 0);
        sketch.pop();
        canvas.clear();
        if (partitions.length === 0) {
            sketch.noLoop();
        }
    }
}

const sketchInstance = new p5(myP5);