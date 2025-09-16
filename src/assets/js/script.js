var smallSize = document.querySelector(".small-size");
  var mediumSize = document.querySelector(".medium-size");
  var largeSize = document.querySelector(".large-size");
  var body = document.querySelector("body");

  function zoomBody(zoomPercentage, element) {
    var sizeBoxes = document.querySelectorAll(".size-box");
    sizeBoxes.forEach(function (box) {
      box.classList.remove("active");
    });
    element.classList.add("active");
    body.style.zoom = zoomPercentage + "%";
    setCookie("fontSize", zoomPercentage, 30);
  }