var search = function () {
  let query = document.getElementById('query').value;

  window.location.href = 'http://localhost:2000/?search='+query;
};
