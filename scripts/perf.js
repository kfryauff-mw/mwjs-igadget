module.exports = function(){
  // This incorporates the moov_perf module, used for improving performance
  // of sites on mobile devices by reducing overhead of images
  const Perf = require("moov_perf")
  global.perf = new Perf(cheerio);

  // optimizeImg() will rewrite all img tags in the current scope to point to our optimizer
  $("img").quality("80").optimizeImg();

  // quality() can be used to reduce size of optimized images further
  //     Setting the quality before optimizing an image can drastically reduce the size of images
  //     80% is a good sweet-spot for reducing size while maintaining quality

  // perf.ignore("www.domain.to.ignore")
  //     Any images with srcs hosted by ignored domains will be skipped by optimizeImg
}