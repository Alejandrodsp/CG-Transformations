class Shape {
  constructor() {
    this.gl = gl;
    //definitions of the possible forms to be generated
    this.cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(
      this.gl, 
      16
    );
    this.coneBufferInfo = flattenedPrimitives.createTruncatedConeBufferInfo(
      this.gl,
      10,
      0,
      20,
      12,
      1
    );
    this.sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(
      this.gl,
      10,
      12,
      6
    );
    this.cylinderBufferInfo = flattenedPrimitives.createCylinderBufferInfo(
      this.gl,
      10,
      12,
      12,
      6
    );

    //array with all object buffer information
    this.shapesArray = [
      this.cubeBufferInfo,
      this.coneBufferInfo,
      this.sphereBufferInfo,
      this.cylinderBufferInfo,
    ];
  }
  
  //function to select a random shape buffer
  getRandomShapeBuffer() {
    const randomIndex = Math.floor(this.shapesArray.length * Math.random());

    return this.shapesArray[randomIndex];
  }
}