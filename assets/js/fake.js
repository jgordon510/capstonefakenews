var menuTestObject = {
  label: "Test Label",
  items: [{
    label: "First item",
    key: "#"
  }, {
    label: "Second item",
    key: "#"
  }]
};

window.onload = function() {
  window.articles = [];
  $.getJSON("articles/keyList.json", function(result) {
    result.forEach(function(articleName) {
      $.getJSON('articles/' + articleName + '.json', function(article) {
        window.articles.push(article);
        if (window.articles.length === result.length) {
          buildPage()
        }
      });
    });
  });

  function buildPage() {
    if (typeof getQueryStrings()["id"] === 'undefined') {
      $("#slider_area").show();
      //todo
      Render.mainMenuAppend(menuTestObject);

      var contentAreas = [{
        callback: Render.mainContentAppend,
        quantity: 3,
        label: "from around the world"
      }, {
        callback: Render.mainContentAppend,
        quantity: 3,
        label: "latest articles"
      }, {
        callback: Render.rightColumnAppendDesk,
        quantity: 3,
        label: "from the desk"
      }, {
        callback: Render.rightColumnAppendEditorial,
        quantity: 4,
        label: "editorial"
      }, {
        callback: Render.popularContentAppend,
        quantity: 4,
        label: "popular"
      }, {
        callback: Render.otherContentAppend,
        quantity: 4,
        label: "other content"
      }];

      contentAreas.forEach(function(contentArea) {
        var articles = window.articles.slice();

        var contentObject = {
          items: [],
          label: contentArea.label
        };
        for (var i = 0; i < contentArea.quantity; i++) {
          contentObject.items.push(articles.splice(Math.floor(Math.random() * articles.length), 1)[0]);
        }
        console.log(contentObject)

        contentArea.callback(contentObject)

      });
    }
    else {
      $("#slider_area").hide();
      $.getJSON('articles/' + getQueryStrings()["id"] + '.json', function(article) {
        var HTML = '<h2 class="title">' + article.label + "</h2>";
        HTML += '<img src="images/' + article.image + '" alt="" /><p>';
        HTML += '<h2">' + article.date + "</h2>";
        HTML += '<div class = "article">' + article.text + '</div>';
        $("#main_content_area").html(HTML);
      });
    }
  }


  function getQueryStrings() {
    var assoc = {};
    var decode = function(s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
      var key = keyValues[i].split('=');
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    }
    return assoc;
  }
};


var Render = {
  mainMenuAppend: function(menu) {
    var HTML = '<li><a href="#">' + menu.label + '</a>' +
      '<ul>';
    menu.items.forEach(function(item) {
      HTML += '<li><a href="/index.html?id=' + item.key + '">' + item.label + '</a></li>';
    });
    HTML += '</ul>' +
      '</li>';
    $("#main_menu_area ul").append(HTML);
  },
  mainContentAppend: function(content) {
    var HTML = '<div class="single_left_coloum_wrapper">' +
      '<h2 class="title">' + content.label + '</h2>'
    content.items.forEach(function(item) {
      HTML += '<div class="single_left_coloum floatleft"> <img src="images/' + item.image + '" alt="" />' +
        '<h3>' + item.label + '</h3>' +
        '<p>' + item.text.substring(0,100) + '...</p>' +
        '<a class="readmore" href="/index.html?id=' + item.key + '">read more</a> </div>';
    });
    HTML += '</div>';
    $("#main_content_area").append(HTML);
  },
  otherContentAppend: function(content) {
    var HTML = '<div class="single_left_coloum_wrapper single_cat_left">' +
      '<h2 class="title">other news</h2>';

    content.items.forEach(function(item) {
      HTML += '<div class="single_cat_left_content floatleft">' +
        '<h3>' + item.label + ' </h3>' +
        '<p>' + item.text.substring(0,100) + '</p>' +
        '<a class="readmore" href="/index.html?id=' + item.key + '">read more</a>' +
        '</div>';
    });
    HTML += '</div>';
    $("#main_content_area").append(HTML);
  },
  rightColumnAppendDesk: function(content) {
    var HTML = '<div class="single_right_coloum">' +
      '<h2 class="title">From the desk</h2>';
    content.items.forEach(function(item) {
      HTML += '<ul>' +
        '<li>' +
        '<div class="single_cat_right_content">' +
        '<h3>' + item.label + '</h3>' +
        '<p>' + item.text.substring(0,100) + '</p>' +
        '<p class="single_cat_right_content_meta"><a href="/index.html?id=' + item.key + '"><span>read more</span></a> 3 hours ago</p>' +
        '</div>' +
        '</li>' +
        '</ul>';
    });

    HTML += '</div>';
    $("#right_column").append(HTML);
  },
  rightColumnAppendEditorial: function(content) {
    var HTML = '<div class="single_right_coloum">' +
      '<h2 class="title">Editorial</h2>';
    content.items.forEach(function(item) {
      HTML += '<div class="single_cat_right_content editorial"> <img src="images/' + item.image + '" alt="" />' +
        '<h3>' + item.label + '</h3>' +
        '</div>';
    });

    HTML += '</div>';
    $("#right_column").append(HTML);
  },
  popularContentAppend: function(content) {
    var HTML = '<h2 class="title">Popular</h2>' +
      '<ul>';
    content.items.forEach(function(item) {
      HTML += '<li>' +
        '<div class="single_popular">' +
        '<p>' + item.date + '</p>' +
        '<h3>' + item.label + ' <a href="/index.html?id=' + item.key + '" class="readmore">Read More</a></h3>' +
        '</div>' +
        '</li>';
    });
    HTML += '</ul>' 
    console.log("test");
    $("#popular_area").append(HTML);
  }
};