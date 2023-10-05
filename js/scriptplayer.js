

document.addEventListener("DOMContentLoaded", 
  function (event) {

        // Call server to get quest info
      $ajaxUtils
        .sendGetRequest("/data/player.json",
          function (res) {
            var player = res.save.player;
            var char = res.save.character;
            var message1 = 
              "<p>Last login: " + Date(player.lastLogin) + "</p>";
              message1 += "<p>Experience: " + player.xp + "/" + player.reqXP + "</p>";
            


            var message2 = "<p>Name: " + char.name + ", " + char.age + " years old, " + char.role + "</p>";
            message2 += "<p>Level " + char.level + "</p>";
            message2 += "<p>Experience: " + char.xp + "/" + char.reqXP + "</p>";
            message2 += "<p>Health: " + char.health + "/" + char.maxHealth + "</p>";
            message2 += "<p>Coins: " + char.coins + "</p>";
            message2 += "<p>Location: " + char.location + "</p>";

            document.querySelector("#playerinfo")
              .innerHTML = message1;
            document.querySelector("#charinfo")
              .innerHTML = message2;  
          });
        
});
