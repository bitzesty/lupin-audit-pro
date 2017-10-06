matchHeight = function() {
  // container(s) of the elements you want to have matching heights
  var container = document.querySelectorAll(".js-match-height");
  console.log(container);

  // loop over all the containers
  var k = container.length;
  while (k--) {

    // the elements within each container
    var elements = container[k].children;

    console.log(elements);

    // reset height of first element for responsiveness
    elements[0].style.height = "auto";

    // use the first element as a starting point
    var first = elements[0].getBoundingClientRect();
    var largest = first.bottom - first.top;

    // loop over all the elements within each container
    var i = elements.length;
    while (i--) {

      // again reset the height for responsiveness
      elements[i].style.height = "auto";

      // calculate heights of all elements
      var element = elements[i].getBoundingClientRect();
      var height = element.bottom - element.top;
      if (height > largest) {

        // store the height of the highest element within a container
        largest = height;
      }
    }

    // loop back over the elements
    var j = elements.length;
    while (j--) {

      // apply the highest height to all elements within that container
      elements[j].style.height = largest + "px";
    }
  }
};

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function domReady() {

  matchHeight();

  window.addEventListener('resize', function() {
    matchHeight();
  });
});

console.log("lol");