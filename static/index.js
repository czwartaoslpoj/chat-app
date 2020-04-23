document.addEventListener('DOMContentLoaded', () => {
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  var username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Please enter username");
    localStorage.setItem("username", username);
  }

  socket.on('connect', () => {
    document.querySelector('#suspicious-button').onclick = () => {
      socket.emit('adduser', username);
    };
  });
  socket.on('all-users', data => {
    document.querySelector('#tag').innerHTML = data.users
  });
});