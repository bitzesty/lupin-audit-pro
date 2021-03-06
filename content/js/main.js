matchHeight = function() {
  // container(s) of the elements you want to have matching heights
  var container = document.querySelectorAll(".js-match-height");

  // loop over all the containers
  var k = container.length;
  while (k--) {

    // the elements within each container
    var elements = container[k].children;

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

var AffiliateForm = {
  init: function() {
    this.id = 1;
    this.target = $(".removable-target");

    this.bindEvents();
    this.showHideDeleteButtons();
  },
  bindEvents: function () {
    var self = this;

    $(".add-auditor").click(function(e) {
      e.preventDefault();
      e.stopPropagation();

      self.addNewAuditor();
      self.showHideDeleteButtons();
    });

    $(document).on("click", ".delete-auditor", function(e) {
      e.preventDefault();
      e.stopPropagation();

      self.gracefullyRemoveElement($(this).closest(".removable"), function() {
        self.showHideDeleteButtons();
      });
    });
  },
  gracefullyRemoveElement: function(el, callback) {
    el.animate({opacity: 0}, 200, function() {
      $(this).slideUp(400, function() {
        $(this).remove();
        callback();
      });
    });
  },
  getNewID: function() {
    this.id += 1;
    return this.id;
  },
  showHideDeleteButtons: function() {
    var count = $(".removable").length;

    if (count === 1) {
      $(".removable .delete-auditor").addClass("hidden");
    } else {
      $(".removable .delete-auditor").removeClass("hidden");
    }
  },
  addNewAuditor: function() {
    var id = this.getNewID();

    var html = [
      '<fieldset class="removable">',
        '<legend>',
          'Auditor ' + id,
          '&nbsp;',
          '<a href="" class="delete-auditor">',
            'Delete',
          '</a>',
        '</legend>',

        '<div class="form-group">',
          '<label for="auditor_' + id + '_name">Auditor name</label>',
          '<input name="auditor_' + id + '_name" type="text" class="form-control name" id="auditor_' + id + '_name">',
        '</div>',

        '<div class="form-group">',
          '<label for="auditor_' + id + '_email">Email</label>',
          '<input name="auditor_' + id + '_email" type="email" class="form-control email" id="auditor_' + id + '_email">',
        '</div>',

        '<div class="form-group">',
          '<label for="auditor_' + id + '_telephone">Phone</label>',
          '<input name="auditor_' + id + '_telephone" type="text" class="form-control telephone" id="auditor_' + id + '_telephone">',
        '</div>',
      '</fieldset>',
    ].join("");

    $(".removable-target").append(html);
  }
};

var Form = {
  init: function() {
    this.form = $("form");

    if (this.form.length === 0) {
      return;
    }

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);

    this.bindEvents();
  },
  bindEvents: function() {
    var self = this;

    this.form.on("submit", function(e) {
      e.preventDefault();
      e.stopPropagation();

      var form = $(this);
      var button = form.find("button[type='submit']");

      button.prop("disabled", true);
      button.text("Please wait...");

      var url = form.attr("action");
      var data = form.serialize() + "&sender=ajax";

      $.ajax({
        url: url,
        type: "POST",
        data: data,
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        success: self.onSuccess,
        error: self.onError
      })
    });
  },
  onSuccess: function() {
    this.hideForm();

    $(this.form.data("success-container")).removeClass("hidden");

    if (this.form.hasClass("affiliate-form")) {
      this.changeTitle();
    }
  },
  onError: function() {
    this.hideForm();

    if (this.form.hasClass("affiliate-form")) {
      $(".section__title--special").hide();
    }

    $(this.form.data("error-container")).removeClass("hidden");
  },
  hideForm: function() {
    this.form.addClass("hidden");
  },
  changeTitle: function() {
    $(".section__title--special").text("Your registration has been submitted.")
  }
};

ready(function domReady() {

  matchHeight();

  window.addEventListener('resize', function() {
    matchHeight();
  });

  AffiliateForm.init();
  Form.init();
});
