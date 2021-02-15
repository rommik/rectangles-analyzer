import { checkIntersection, colinearPointWithinSegment } from 'line-intersect';
export interface Point {
  x: number;
  y: number;
}
export interface RectangleSide {
  from: Point;
  to: Point;
}

export interface AdjacencyTest {
  isAdjacent: boolean;
  adjacencyType: string | 'none' | 'partial' | 'subline' | 'proper';
}

export default class Rectangle {
  private origin: Point;
  private width: number;
  private height: number;

  constructor(properties: { origin: Point; width: number; height: number }) {
    if (properties.width <= 0) throw new Error('Width cannot be 0 or negative value');
    if (properties.height <= 0) throw new Error('Height cannot be 0 or negative value');

    this.origin = properties.origin;
    this.height = properties.height;
    this.width = properties.width;
  }

  /** Public Getters */
  public get originPoint(): Point {
    return this.origin;
  }

  public get Width(): number {
    return this.width;
  }

  public get Height(): number {
    return this.height;
  }
  /**  Corners
   *    B------C
   *    |      |
   *    |      |
   *    A------D
   *
   * Where A {X,Y}, B {X, Y+H}, C{X+W,Y+H}, D{X+W, Y}
   * */
  public get corners(): Point[] {
    return [this.cornerA, this.cornerB, this.cornerC, this.cornerD];
  }

  public get cornerA(): Point {
    return this.origin;
  }

  public get cornerB(): Point {
    return { x: this.origin.x, y: this.origin.y + this.height };
  }
  public get cornerC(): Point {
    return { x: this.origin.x + this.width, y: this.origin.y + this.height };
  }
  public get cornerD(): Point {
    return { x: this.origin.x + this.width, y: this.origin.y };
  }

  public get horizontalSides(): RectangleSide[] {
    return [
      { from: this.cornerA, to: this.cornerD },
      { from: this.cornerB, to: this.cornerC }
    ];
  }

  public get verticalSides(): RectangleSide[] {
    return [
      { from: this.cornerA, to: this.cornerB },
      { from: this.cornerC, to: this.cornerD }
    ];
  }

  /** Methods */
  public area(): number {
    return this.width * this.height;
  }

  /**
   *
   * @param container - possible container for this rectangle
   *
   * Perform a check if this rectangle is inside of another.
   * If Both rectangles have identical point of origin and dimensions, they are both inside each other.
   */
  public isContainedInside(container: Rectangle): boolean {
    if (this.area() > container.area()) return false;

    /**
     *  B -------------- C
     *  |   B---------C  |
     *  |   |         |  |
     *  |   |         |  |
     *  |   A---------D  |
     *  |                |
     *  A----------------D
     *
     */
    if (
      this.cornerA.x >= container.cornerA.x &&
      this.cornerC.x <= container.cornerC.x &&
      this.cornerA.y >= container.cornerA.y &&
      this.cornerC.y <= container.cornerC.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   * @param rect
   *
   * Checks if each side intersects the perpendicular sides of the input rectangle.
   */
  public intersectingPoints(rect: Rectangle): Point[] {
    const result: Point[] = [];

    this.verticalSides.forEach((vSide) => {
      rect.horizontalSides.forEach((hSide) => {
        const intersectionPoint = this.linesIntersection(vSide, hSide);
        if (intersectionPoint) result.push(intersectionPoint);
      });
    });

    this.horizontalSides.forEach((hSide) => {
      rect.verticalSides.forEach((vSide) => {
        const intersectionPoint = this.linesIntersection(hSide, vSide);
        if (intersectionPoint) result.push(intersectionPoint);
      });
    });

    return result;
  }

  private linesIntersection(side1: RectangleSide, side2: RectangleSide): Point | null {
    const result = checkIntersection(
      side1.from.x,
      side1.from.y,
      side1.to.x,
      side1.to.y,
      side2.from.x,
      side2.from.y,
      side2.to.x,
      side2.to.y
    );
    if (result.type === 'intersecting') {
      return { x: result.point.x, y: result.point.y };
    } else {
      return null;
    }
  }

  /**
   *
   * @param previousTest
   * @param newTest
   *
   * This function is used to resolve false positive conflicts in adjacency test.
   * Partial adjacency is possible when two rectangles share a common point (like a corner)
   */
  private adjacencyTestResult(previousTest: AdjacencyTest, newTest: AdjacencyTest) {
    if (!previousTest.isAdjacent && newTest.isAdjacent) {
      previousTest.isAdjacent = newTest.isAdjacent;
      previousTest.adjacencyType = newTest.adjacencyType;
    } else {
      if (newTest.adjacencyType === 'proper' || newTest.adjacencyType === 'subline') {
        previousTest.adjacencyType = newTest.adjacencyType;
      }
    }
  }
  /**
   *
   * @param rect
   * Two rectangles are adjacent when they share points but their sides do not intersect
   *
   */

  public isAdjacent(rect: Rectangle): AdjacencyTest {
    const result: AdjacencyTest = { isAdjacent: false, adjacencyType: 'none' };

    //check horizontal sides first
    for (let horizontalSide of this.horizontalSides) {
      for (let rectHorizontalSide of rect.horizontalSides) {
        const testResult = this.areSidesAdjacent(horizontalSide, rectHorizontalSide);
        this.adjacencyTestResult(result, testResult);
      }
    }

    //check vertical sides
    for (let verticalSide of this.verticalSides) {
      for (let rectVerticalSide of rect.verticalSides) {
        const testResult = this.areSidesAdjacent(verticalSide, rectVerticalSide);
        this.adjacencyTestResult(result, testResult);
      }
    }

    return result;
  }

  /**
   *
   * @param side1
   * @param side2
   *
   * Adjacency is determined by the corners of one side on the line of another
   * if both corners are on a line - subline
   * if both side corners are on other rectangles - proper
   * if one corner on one line , and another corner on another - partial
   */
  private areSidesAdjacent(side1: RectangleSide, side2: RectangleSide): AdjacencyTest {
    const result = { isAdjacent: false, adjacencyType: 'none' };

    const check = checkIntersection(
      side1.from.x,
      side1.from.y,
      side1.to.x,
      side1.to.y,
      side2.from.x,
      side2.from.y,
      side2.to.x,
      side2.to.y
    );

    if (check.type !== 'colinear') return result; //no common points.

    const side1pointFrom = colinearPointWithinSegment(
      side1.from.x,
      side1.from.y,
      side2.from.x,
      side2.from.y,
      side2.to.x,
      side2.to.y
    );
    const side1pointTo = colinearPointWithinSegment(
      side1.to.x,
      side1.to.y,
      side2.from.x,
      side2.from.y,
      side2.to.x,
      side2.to.y
    );

    const side2pointFrom = colinearPointWithinSegment(
      side2.from.x,
      side2.from.y,
      side1.from.x,
      side1.from.y,
      side1.to.x,
      side1.to.y
    );
    const side2pointTo = colinearPointWithinSegment(
      side2.to.x,
      side2.to.y,
      side1.from.x,
      side1.from.y,
      side1.to.x,
      side1.to.y
    );

    if (side1pointFrom || side1pointTo || side2pointFrom || side2pointTo) {
      result.isAdjacent = true;

      const isProper = side1pointFrom && side1pointTo && side2pointFrom && side2pointTo;
      if (isProper) {
        result.adjacencyType = 'proper';
        return result;
      }

      const isSubLine = (side1pointFrom && side1pointTo) || (side2pointFrom && side2pointTo);
      if (isSubLine) {
        result.adjacencyType = 'subline';
        return result;
      }

      result.adjacencyType = 'partial';
    }
    return result;
  }
}
