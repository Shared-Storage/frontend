exports.log = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.log(object)
    : null;
};
exports.debug = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.debug(object)
    : null;
};
exports.info = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.info(object)
    : null;
};
exports.warn = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.warn(object)
    : null;
};
exports.error = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.error(object)
    : null;
};
exports.table = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.table(object)
    : null;
};
exports.group = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.group(object)
    : null;
};
exports.groupCollapsed = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.groupCollapsed(object)
    : null;
};
exports.groupEnd = (object) => {
  return process.env.REACT_APP_ENABLE_DEBUG === "true"
    ? console.groupEnd(object)
    : null;
};
