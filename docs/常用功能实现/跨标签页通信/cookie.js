// PageA
$(function() {
  $("#btn").click(function() {
    var name = $("#name").val();
    document.cookie = "name=" + name;
  });
});
// PageB
$(function() {
  function getCookie(key) {
    return JSON.parse(
      '{"' +
        document.cookie.replace(/;\s+/gim, '","').replace(/=/gim, '":"') +
        '"}'
    )[key];
  }
  setInterval(function() {
    console.log("name=" + getCookie("name"));
  }, 10000);
});
