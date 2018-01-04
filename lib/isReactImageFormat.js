export default object =>
  object !== null &&
  typeof object === 'object' &&
  object.uri !== null &&
  typeof object.uri === 'string';
