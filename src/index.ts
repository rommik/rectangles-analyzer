import Rectangle from './Rectangle';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';


//Read data from ../data folder and process rectangles
fs.createReadStream(path.resolve(__dirname, '../data', 'data.csv'))
  .pipe(csv.parse({ headers: true }))

  .on('error', (error) => console.error(error))
  .on('data', (row) => {
    console.log(`=====`);
    analyzeRectangles(row);
  })
  .on('end', (rowCount: number) => {
    console.log(`=====`);
    console.log(`Processed ${rowCount} rows`);
  });

//Analyze Rectangles and console.log the result
function analyzeRectangles(row: any) {
  const rect1 = new Rectangle({
    origin: { x: parseInt(row.origin1x), y: parseInt(row.origin1y) },
    width: parseInt(row.width1),
    height: parseInt(row.height1)
  });

  const rect2 = new Rectangle({
    origin: { x: parseInt(row.origin2x), y: parseInt(row.origin2y) },
    width: parseInt(row.width2),
    height: parseInt(row.height2)
  });

  console.log(
    `Rectangle 1: origin:${JSON.stringify(rect1.originPoint)} , width: ${rect1.Width}, height: ${
      rect1.Height
    }, corners: ${JSON.stringify(rect1.corners)}`
  );

  console.log(
    `Rectangle 2: origin:${JSON.stringify(rect2.originPoint)} , width: ${rect2.Width}, height: ${
      rect2.Height
    }, corners: ${JSON.stringify(rect1.corners)}`
  );

  const isRect2Container = rect1.isContainedInside(rect2);
  const isRect1Container = rect2.isContainedInside(rect1);

  if (isRect2Container || isRect1Container) {
    if (isRect1Container) {
      console.log(`Rectangle 2 is contained inside Rectangle 1`);
    } else {
      console.log(`Rectangle 1 is contained inside Rectangle 2`);
    }
    return;
  } else {
    console.log(`Rectangles have no containment`);
  }

  const adjacency = rect1.isAdjacent(rect2);

  if (adjacency.isAdjacent) {
    console.log(`Rectangles have adjacency of type: ${adjacency.adjacencyType}`);
    return;
  } else {
    console.log(`Rectangles are not adjacent`);
  }

  const intersections = rect1.intersectingPoints(rect2);
  if (intersections && intersections.length > 0) {
    console.log(`Rectangles intersect at these coordinates: ${JSON.stringify(intersections)}`);
    return;
  } else {
    console.log(`Rectangles have no intersections`);
  }
}
