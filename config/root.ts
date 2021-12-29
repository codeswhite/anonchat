import path from "path";

// Helper function
function root(args: any){
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat("../", ...args));
}

export default root;
