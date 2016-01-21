module.exports = function() {
    // body.prepend(
    //     $(tag("header", {class: "mw-header"}), function() {
    //         // Move stuff here
    //
    //     })
    // );

    // Adjust Logo and Top Menu
    $("#Logo").append($("#TopMenu"));
    $("#TopMenu li").not(".CartLink, .First").remove();

    // Set Up Bottom Part of Header Area
    var mw_header_bottom = "<div class='mw_header_bottom'>" +
                          "<div class='mw_search'></div>" +
                          "<div class='mw_menu_btn sprites-menu' data-ur-toggler-component='button'></div>" +
                          "</div>";
    var header = $("#Header");
    header.children($("br")).remove();

    // Add mw_header_bottom to the end of header
    header.append(mw_header_bottom);
    // Move #SearchForm to the newly created .mw_search div
    $(".mw_search")
      .append($("#SearchForm"));

    // Set up header for #Menu
    header.append($("#Menu"));
    header.children($("#Menu"))
      .append($(".Left #SideCategoryList"));
    $("#Menu li").addClass("mw_bar2");

    // Set up Search Form
    $("#SearchForm").children($("p")).remove();

    var searchForm = $("#SearchForm form");

    // Alternative to scoped$ ():
      // searchForm.children($("label")).remove();
      // searchForm.children($("input[type=text]")).attr("placeholder", "Search...");
    scoped$("#SearchForm form", function () {
      scoped$("label").remove();
      scoped$("input[type=text]").attr("placeholder", "Search...");
    });

    searchForm.children($("input[type=image]"))
      .attr("style", "opacity: 0;")
      .wrap("div")
      .parent()
        .addClass("mw_search_btn sprites-search");

    // Set up #TopMenu
    var topMenu = $("#TopMenu");
    $("#TopMenu ul li.First a")
      .empty()
      .append("<div class='mw_account_btn sprites-user'></div>");
    $("#TopMenu ul li.CartLink a")
      .empty()
      .append("<div class='mw_account_btn sprites-cart'></div>");

    // Set Up Toggle Widget
    scoped$("#Header", function () {
      $this.attr("data-ur-set", "toggler")
      scoped$("#Menu").attr("data-ur-toggler-component", "content")
    });
};
