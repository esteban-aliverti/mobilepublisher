$(".btn-action" ).click(function(e) {
var app = $(this).data("app");
var action = $(this).data("action");

alert(app + action);

 e.stopPropagation();
});