module.exports = function() {
  // Add _category class to body
  $this.addClass("_category");

  // Remove Unnecessary Elements
  $(".NewsletterSubscription").remove();
  $("#CategoryBreadcrumb").remove();

  // Set up toggler for Shop by Brand
  var createToggleMenu = function () {
    if($this.attr("style").contains("display:none;")) return;
    $this.attr("data-ur-set", "toggler");
    scoped$("h2", function() {
      $this.addClass("mw_bar1");
      $this.attr("data-ur-toggler-component", "button");
      $this.append("<div class='mw_indicator'></div>");
    });
    $this.children("div").attr("data-ur-toggler-component", "content");
    scoped$("li a").each( function(index, element) {
      $(this).append("<div class='mw_arrow'></div>");
    });
  };
  scoped$("#SideShopByBrand", createToggleMenu);
  scoped$("#SideCategoryShopByPrice", createToggleMenu);



};
