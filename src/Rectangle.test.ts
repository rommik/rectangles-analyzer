import Rectangle from './Rectangle';

describe('Rectangle Tests', () => {
  test('should initialize a rectangle object', () => {
    const rect = new Rectangle({ origin: { x: 0, y: 0 }, width: 10, height: 10 });

    expect(rect).toBeDefined();
  });

  test('should throw error when width negative or zero ', () => {
    expect(() => {
      new Rectangle({ origin: { x: 0, y: 0 }, width: -10, height: 10 });
    }).toThrow('Width cannot be 0 or negative value');
  });

  test('should throw error when height negative or zero', () => {
    expect(() => {
      new Rectangle({ origin: { x: 0, y: 0 }, width: 10, height: -10 });
    }).toThrow('Height cannot be 0 or negative value');
  });

  test('should return the origin, width, and height', () => {
    const rect = new Rectangle({ origin: { x: 5, y: 7 }, width: 10, height: 20 });

    expect(rect.originPoint.x).toBe(5);
    expect(rect.originPoint.y).toBe(7);
    expect(rect.Width).toBe(10);
    expect(rect.Height).toBe(20);
  });

  test('should return the list of all corners', () => {
    const rect = new Rectangle({ origin: { x: 5, y: 7 }, width: 10, height: 20 });

    const corners = rect.corners;

    expect(corners.length).toStrictEqual(4);
    expect(corners[0]).toStrictEqual({ x: 5, y: 7 });
    expect(corners[1]).toStrictEqual({ x: 5, y: 7 + 20 });
    expect(corners[2]).toStrictEqual({ x: 5 + 10, y: 7 + 20 });
    expect(corners[3]).toStrictEqual({ x: 5 + 10, y: 7 });
  });

  test('should return list of vertical and horizontal sides', () => {
    const rect = new Rectangle({ origin: { x: 5, y: 7 }, width: 10, height: 20 });

    const horizontalSides = rect.horizontalSides;
    const verticalSides = rect.verticalSides;

    expect(horizontalSides.length).toStrictEqual(2);
    expect(verticalSides.length).toStrictEqual(2);
  });
  test('should calculate Area of a Rectangle', () => {
    const rect = new Rectangle({ origin: { x: 0, y: 0 }, width: 10, height: 10 });

    expect(rect.area()).toBe(10 * 10);
  });

  test('should return coordinates of four corners of a rectangle ', () => {
    const rect = new Rectangle({ origin: { x: 0, y: 0 }, width: 10, height: 10 });

    expect(rect.cornerA).toStrictEqual({ x: 0, y: 0 });
    expect(rect.cornerB).toStrictEqual({ x: 0, y: 10 });
    expect(rect.cornerC).toStrictEqual({ x: 10, y: 10 });
    expect(rect.cornerD).toStrictEqual({ x: 10, y: 0 });
  });

  test('should detect if rectangle is inside of another rectangle', () => {
    const rect1 = new Rectangle({ origin: { x: 0, y: 0 }, width: 10, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 2, y: 2 }, width: 5, height: 5 });

    const rect2InRect1 = rect2.isContainedInside(rect1);
    const rect1InRect2 = rect1.isContainedInside(rect2);

    expect(rect2InRect1).toBeTruthy();
    expect(rect1InRect2).toBeFalsy();
  });

  test('should detect two rectangles with identical properties as inside each other.', () => {
    const rect1 = new Rectangle({ origin: { x: 0, y: 0 }, width: 10, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 0, y: 0 }, width: 10, height: 10 });

    const rect2InRect1 = rect2.isContainedInside(rect1);
    const rect1InRect2 = rect1.isContainedInside(rect2);

    expect(rect2InRect1).toBeTruthy();
    expect(rect1InRect2).toBeTruthy();
  });

  test('should detect intersecting rectangles with 4 points', () => {
    const rect1 = new Rectangle({ origin: { x: 5, y: 5 }, width: 10, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 7, y: 3 }, width: 5, height: 20 });

    const commonPoints = rect1.intersectingPoints(rect2);

    expect(commonPoints.length).toStrictEqual(4);
  });

  test('should detect intersecting rectangles with 2 points', () => {
    const rect1 = new Rectangle({ origin: { x: 5, y: 5 }, width: 10, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 7, y: 7 }, width: 5, height: 20 });

    const commonPoints = rect1.intersectingPoints(rect2);

    expect(commonPoints.length).toStrictEqual(2);
  });

  test('should not detect intersecting rectangles when no common points exist', () => {
    const rect1 = new Rectangle({ origin: { x: 5, y: 5 }, width: 10, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 25, y: 5 }, width: 5, height: 20 });

    const commonPoints = rect1.intersectingPoints(rect2);

    expect(commonPoints.length).toStrictEqual(0);
  });

  test('should detect proper adjacency', () => {
    const rect1 = new Rectangle({ origin: { x: 5, y: 5 }, width: 5, height: 5 });
    const rect2 = new Rectangle({ origin: { x: 10, y: 5 }, width: 5, height: 5 });

    const adjacency = rect1.isAdjacent(rect2);

    expect(adjacency.isAdjacent).toBeTruthy();
    expect(adjacency.adjacencyType).toStrictEqual('proper');
  });

  test('should detect subline adjacency', () => {
    const rect1 = new Rectangle({ origin: { x: 5, y: 5 }, width: 5, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 10, y: 7 }, width: 5, height: 5 });

    const adjacency = rect1.isAdjacent(rect2);

    expect(adjacency.isAdjacent).toBeTruthy();
    expect(adjacency.adjacencyType).toStrictEqual('subline');
  });

  test('should detect partial adjacency', () => {
    const rect1 = new Rectangle({ origin: { x: 5, y: 5 }, width: 5, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 10, y: 7 }, width: 5, height: 25 });

    const adjacency = rect1.isAdjacent(rect2);

    expect(adjacency.isAdjacent).toBeTruthy();
    expect(adjacency.adjacencyType).toStrictEqual('partial');
  });

  test('should detect partial adjacency where only corners overlap', () => {
    const rect1 = new Rectangle({ origin: { x: 10, y: 10 }, width: 10, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 20, y: 0 }, width: 10, height: 10 });

    const adjacency = rect1.isAdjacent(rect2);

    expect(adjacency.isAdjacent).toBeTruthy();
    expect(adjacency.adjacencyType).toStrictEqual('partial');
  });

  test('should detect no adjacency', () => {
    const rect1 = new Rectangle({ origin: { x: 5, y: 5 }, width: 5, height: 10 });
    const rect2 = new Rectangle({ origin: { x: 25, y: 7 }, width: 5, height: 25 });

    const adjacency = rect1.isAdjacent(rect2);

    expect(adjacency.isAdjacent).toBeFalsy();
    expect(adjacency.adjacencyType).toStrictEqual('none');
  });
});
