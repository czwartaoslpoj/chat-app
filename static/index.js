document.addEventListener('DOMContentLoaded', () => {
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  var username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Please enter username");
    localStorage.setItem("username", username);
  }
  var MessagesToShow = ""

  //displaying all channels list
  socket.on('connect', () => {
    socket.emit("getallchannels")

    socket.on('displayallchannels', data => {
      dataAsJson = JSON.parse(data)
      dataAsJson.forEach((element, index) => {
        const button = document.createElement('button');
        button.id = element.name
        button.innerHTML = element.name
        button.onclick = () => {

          localStorage.setItem("last_clicked_channel", element.name)
          socket.emit('displayAllMessages', element.name)

          // document.querySelector("#chatbox").innerHTML = element.message
        }
        document.querySelector('#channelList').append(button);
      });
    });

    //add channel to the list of channels
    document.querySelector('#addChannel').onclick = () => {
      var newChannel = document.querySelector('#channelName').value
      channelsList = document.querySelectorAll('#channelList').value
      socket.emit('addNewChannel', newChannel);

    };

    //send message in the specific, last clicked on channel
    document.querySelector('#sendAMessage').onclick = () => {
      var timeStamp = new Date();
      var messageTime = "(" + timeStamp.getHours() + ":" + timeStamp.getMinutes() + ":" + timeStamp.getSeconds() + ")"
      console.log(messageTime)
      var last_clicked_channel = localStorage.getItem("last_clicked_channel")
      var NewMessage = document.querySelector("#NewMessage").value
      document.querySelector("#NewMessage").value = ""
      socket.emit('addNewMessage', NewMessage, last_clicked_channel, username, messageTime)
      socket.emit('checkIfInSecretWords', NewMessage)




    }


  });

  //create button for every channel

  socket.on('newChannelAdded', channel => {
    const button = document.createElement('button');
    channelAsJson = JSON.parse(channel)
    button.onclick = () => {
      localStorage.setItem("last_clicked_channel", channelAsJson.name)
      socket.emit('displayAllMessages', channelAsJson.name)
    }
    button.innerHTML = channelAsJson.name;
    console.log(channelAsJson)
    document.querySelector('#channelList').append(button);
    document.querySelector("#channelName").value = ""
  });


  socket.on('newMessageAdded', channel => {
    console.log(channel)
    channelAsJson2 = JSON.parse(channel)
    var message_to_be_displayed = ""
    channelAsJson2.message.forEach(item => {
      message_to_be_displayed = message_to_be_displayed + item.user + item.time + " : " + item.content + "\n"
    })
    console.log("message is", message_to_be_displayed)
    document.querySelector('#chatbox').innerHTML = message_to_be_displayed
  })

  socket.on('allMessagesDisplayed', allMessages => {
    allMessagesAsJson = JSON.parse(allMessages)
    MessagesToShow = ""
    console.log(allMessagesAsJson)
    allMessagesAsJson.forEach(item => {
      MessagesToShow = MessagesToShow + item.user + item.time + ":" + item.content + "\n"
    })
    document.querySelector("#chatbox").innerHTML = MessagesToShow
  })

  socket.on("errorMessage", () => {
    alert("This channel already exists")
  })

  socket.on("secretWordFound", secretWord => {
    alert(secretWord)
  })

})