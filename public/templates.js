angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("board.html","");
$templateCache.put("cards.html","<div class=\"containerSize\">\n  <div class=\"row\">\n    <div ng-repeat=\"board in boards\" class=\"col s6 m4 l3\">\n      <div class=\"card\">\n        <a href=\"#/board/{{board.id}}\">\n          <div class=\"card-image waves-effect waves-light\">\n            <img ng-src=\"{{board.img}}\">\n            <span class=\"card-title text-muted txtBlackBorder\">\n            </span>\n          </div>\n        </a>\n        <div class=\"card-content\">\n          <h5>{{board.title}}</h5>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("navMain.html","<div class=\"nav-wrapper\">\n  <a href=\"#\" class=\"brand-logo logoText waves-effect waves-light\">0xF Chan</a>\n  <a href=\"#\" data-activates=\"mobile-demo\" class=\"button-collapse hide-on-med-and-up\">\n  	<i class=\"material-icons\">menu</i></a>\n  <ul id=\"nav-desktop-tablet\" class=\"right hide-on-small-and-down\">\n	  <li>\n	  	<a href=\"#/search\">\n	  		<i class=\"material-icons left\">search</i>Search\n	  	</a>\n	  </li>\n  </ul>\n  <ul class=\"side-nav\" id=\"mobile-demo\">\n    <li><a href=\"#/search\">Search</a></li>\n  </ul>\n</div>\n<script type=\"text/javascript\">\n  $(\".button-collapse\").sideNav();\n</script>");
$templateCache.put("navSearch.html","<div class=\"nav-wrapper row\" id = \"navSearch\">\n	<div class=\"col s2 m0 l0\">\n		<a href=\"#\" data-activates=\"mobile-demo\" class=\"button-collapse hide-on-med-and-up\">\n  	<i class=\"material-icons\">menu</i></a>\n	</div>\n  <div class=\"col s0 m2 l2\">\n    <ul>\n      <li id = \"navSearchHome\" >\n      <a href=\"#/home\" class=\"navFontSize\">Home</a></li>\n    </ul>\n  </div>\n  <div class = \"col s10 m10 l10 rowNoPadding\">\n  	<form>\n      <div class=\"input-field\">\n        <input id=\"search\" class=\"navFontSize\" type=\"search\" required>\n        <label for=\"search\">\n          <i class=\"material-icons\">search</i>\n        </label>\n        <i class=\"material-icons\">close</i>\n			</div>\n		</form>\n  </div>\n</div>\n<ul class=\"side-nav\" id=\"mobile-demo\">\n  <li><a href=\"#/home\">Home</a></li>\n</ul>\n<script type=\"text/javascript\">\n  $(\".button-collapse\").sideNav();\n</script>");}]);